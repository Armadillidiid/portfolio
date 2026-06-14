---
title: A better way to deploy updates to EC2
date: "2026-01-27T08:49:31.953Z"
tags: []
---

So you’ve got an EC2 instance you want to deploy updates to it. How do you go about it?

A lot of us start with the classics of SSH into the box, `git pull` and building on the server. While someone with more experience might build in CI runner like GitHub action and copy the artifacts over to the server.

For the most part, these approaches works. I've used them in the my pet project before. But it starts to fall apart once you want to scale beyond a single server.

The moment you introduce a second instance, you have to start thinking about things like automatic rollbacks or credential management.

What happens when a deployment succeeds on one instance but fails on another? Or What if your instances are ephemeral like when using an Auto Scaling Group.

These are the types of problems that we overlook with ad-hoc solutions.

That's why today we're going to look at CodeBuild, CodeDeploy and CodePipeline and how to utilize them to better roll out your updates.

If you want to see the final result for yourself, check out the [GitHub repo](https://github.com/Armadillidiid/ec2-codepipeline-build-deploy).

## CI/CD Overview

In a typical CI/CD workflow, we can usually map it into 3 stages:

![Stages of development cycle](path)

1. **Source**: a change lands somewhere (push/merge/tag)
2. **Build**: compile/test/build images and produce deployable artifacts
3. **Deploy**: roll those artifacts out to your runtime (EC2/Lambda/ECS)

For each of these stages, AWS provides a service.

CodeBuild (as the name suggests) is used for building your code to deployable artifacts and running your CI processes. It allows you to run pretty much anything you can script out as a shell command.

While CodeDeploy help move these deployable artifacts (called revisions) onto your compute platform of choice. At this time of writing, that's EC2, Lambda and ECS.

CodePipeline on the otherhand orchestrates the whole flow end-to-end through stages. It passes the output artifacts of one stage as the input to the next.

## Starting point

Here's an example GitHub actions I wrote sometime back to deploy updates to EC2 instances using RYSNC.

[GitHub action](https://github.com/Armadillidiid/food-delivery-ecommerce/blob/main/.github/workflows/main.yaml)

From analysis, I'm sure we can spot two phases:

1. Build: Login to ECR, build and push the container image
2. Deploy: SSH into host, pull new image and restart services.

Let’s translate it to what it would look like using CodeBuild and CodeDeploy. Then connect it all with CodePipeline.

## 1. Create buildspec

First, we'll create our build specification named `buildspec.yml` at the root of our project. By default, CodeBuild looks for this file at the root of our project.

> If you want to specify a location other than root (for example in a monorepo), you must configure a path override.

Inside the build spec file, we define our build commands. There are 4 fixed phases under which we can do so:

- `install`
- `pre_build`
- `build`
- `post_build`

You can keep things clean across different phases, or you can throw everything into a single one. CodeBuild doesn’t care. They're mostly for readability.

Here’s the build phase revamped to a `buildspec.yml` file:

```yaml
version: 0.2

phases:
  install:
    commands:
      - echo "Nothing to install. Skipping..."

  pre_build:
    commands:
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${IMAGE_TAG:-$COMMIT_HASH}

  build:
    commands:
      - docker build -f apps/api/Dockerfile -t $REPOSITORY_URI:latest -t $REPOSITORY_URI:$IMAGE_TAG .

  post_build:
    commands:
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - cp apps/api/docker-compose.prod.yml.template apps/api/docker-compose.prod.yml
      - sed -i "s|REPOSITORY_URI|${REPOSITORY_URI}|g" apps/api/docker-compose.prod.yml
      - sed -i "s|IMAGE_TAG|${IMAGE_TAG}|g" apps/api/docker-compose.prod.yml
      - echo "AWS_REGION=${AWS_DEFAULT_REGION}" > apps/api/.env.infra
      - echo "ECR_REPOSITORY=${REPOSITORY_URI}" >> apps/api/.env.infra

artifacts:
  base-directory: apps/api
  files:
    - "**/*"
```

## 2. Create AppSpec

Now we head into the “deploy” part.

CodeDeploy doesn’t magically know how to deploy our app. We teach it via an **AppSpec** file named `appspec.yml`.

This AppSpec file's shape looks different for each compute platform. Unfortunately for us, EC2 tends to be the most verbose as you do a lot of the heavy lifting yourself compared to ECS or Lambda.

For EC2 deployments, we'll need to define the following:

1. **os**: Operating system of the instance (E.g `linux` or `windows`)
2. **files**: Files to copy to the instance.
3. **hooks**: Scripts to run at specific lifecycle events.

A typical lifecycle sequence for EC2 looks like this:

`ApplicationStop → BeforeInstall → AfterInstall → ApplicationStart → ValidateService`

I won't go into the specifics, but in summary, they're predefined checkpoints during a deployment where you can run custom scripts.

For ECS and Lambda, they spin up a lambda function, while for EC2, they run on the instance itself. You can dig into the full list in the [docs](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html#appspec-reference-server) if you’re curious.

Example `appspec.yml`:

```yaml
version: 0.0
os: linux
files:
  - source: /
    destination: /var/app/current
hooks:
  ApplicationStop:
    - location: scripts/stop_application.sh
      timeout: 300
  BeforeInstall:
    - location: scripts/before_install.sh
      timeout: 300
  AfterInstall:
    - location: scripts/after_install.sh
      timeout: 300
  ApplicationStart:
    - location: scripts/start_application.sh
      timeout: 300
```

### 2.1 Lifecycle scripts

Starting with `ApplicationStop` event, we spin down the running containers. On the first deploy, there will be nothing running, so we'll ignore failures to keep the hook successful.

```bash
#!/bin/bash
set -e

cd /var/app/current || exit 0
docker-compose -f docker-compose.prod.yml down || true
```

Then for `BeforeInstall`, we clean up artifacts of previous deployment.

```bash
#!/bin/bash
rm -rf /var/app/current/*
docker image prune -af --filter "until=72h" || true
```

Moving forward to `AfterInstall`, we do a little bit more. We load the environment variables generated during the build, use that to login to ECR and pull the new image down.

```bash
#!/bin/bash
set -e

cd /var/app/current
source .env.infra
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPOSITORY%:*}
docker-compose -f docker-compose.prod.yml pull
```

Finally, we the start up the docker service for `ApplicationStart`.

```bash
#!/bin/bash
docker-compose -f docker-compose.prod.yml up -d
```

With this setup, our deployment can now scales beyond a single instance and should I say... a lot neater.

If done correctly, we can repeatedly redeploy and each time, our application should be up.

If for whatever there's an issue with the current deployment, CodeDeploy will come to our aid and trigger a rollback deployment of the last known good revision.

> In production, the `ValidateService` hook is a great place to call healthcheck endpoints and fail the deployment if the app isn't responding correctly.

## 3. CodeDeploy agent

For CodeDeploy to communicate with any compute, it requires an agent to be registered and running on each instance. On ECS and Lambda, this is already done for you while on EC2, we must do it ourselves ([if not deploying behind an ASG](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codedeploy.ServerDeploymentGroup.html#installagent) ).

A simple approach is to install it in our instance bootstrapping (user data). Example:

```ts
userData.addCommands(
// Install docker & etc.
// ...
"dnf install -y ruby curl"
"cd /home/ec2-user"
`curl -fsSL "https://aws-codedeploy-${this.region}.s3.${this.region}.amazonaws.com/latest/install" -o install`
"chmod +x ./install"
"./install auto"
"systemctl start codedeploy-agent"
"systemctl enable codedeploy-agent"
)
```

## 4. Provision resources with CDK

With our `appspec.yml` and `buildpsec.yml` defined, the remaining work is plumbing. We'll create the build, deploy and pipeline projects and connect them up.

For this section, I'm going to stick to using [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide) to provision the resources. I like to think you don't care to see screenshots clicking around the dashboard.

### 4.1 CodeBuild

We'll define the path to the buildspec and enable `privileged` mode. That's the most important thing here.

```ts
this.codeBuildProject = new codebuild.PipelineProject(this, "ApiCodeBuildProject", {
  buildSpec: codebuild.BuildSpec.fromSourceFilename("apps/api/buildspec.yml"),
  environment: {
    buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
    privileged: true, // Required for Docker builds
    computeType: codebuild.ComputeType.SMALL,
  },
  environmentVariables: {
    AWS_DEFAULT_REGION: { value: this.region },
    AWS_ACCOUNT_ID: { value: this.account },
    IMAGE_REPO_NAME: { value: this.ecrRepository.repositoryName },
    IMAGE_TAG: { value: "latest" },
  },
});
```

You might notice we don't specify any input source or output destination here. That's because we're going to let CodePipeline orchestrate that at the pipeline level, rather than individually.

If we're using CodeBuild standalone (outside CodePipeline), we'd have to define these on the project itself.

Because we push the container image to ECR, we must grant CodeBuild permission:

```ts
this.ecrRepository.grantPullPush(this.codeBuildProject);
```

### 4.2 CodeDeploy

Next up, we'll create our CodeDeploy application. It's mostly just a logical container for our service.

```ts
this.codeDeployApplication = new codedeploy.ServerApplication(this, "ApiCodeDeployApplication");
```

The important part is the **deployment group**. Think of a deployment group as answering the question “which instances should receive this deployment, and how should the rollout happen?”

In other words, target selection + deployment behavior.

```ts
this.codeDeployDeploymentGroup = new codedeploy.ServerDeploymentGroup(this, "ApiDeploymentGroup", {
  application: this.codeDeployApplication,
  ec2InstanceTags: new codedeploy.InstanceTagSet({
    Application: "ec2-codepipeline-build-deploy",
  }),
  deploymentConfig: codedeploy.ServerDeploymentConfig.ALL_AT_ONCE,
});
```

Because we're deploying to a standalone EC2 instance with no [ASG](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html), we have to use EC2 instance tags as the means for target selection.

Without tags, CodeDeploy has no way of knowing which instances should be included as part of the deployment group.

So we assign our instance a custom tag:

```ts
cdk.Tags.of(this.instance).add("Application", "ec2-codepipeline-build-deploy");
```

### 4.3 CodePipeline

Finally, let's tie everything up using CodePipeline.

We're going to create a pipeline with 3 stages: source, build and deploy.

Our source stage will kickstart the pipeline. Since we don't want to manually trigger the pipeline, we can connect our code repository to CodePipeline to automatically start the pipeline based on a number of triggers (E.g, on push to branch, git tags, pull request events, etc.).

First, we'll create an S3 bucket where our artifacts will live:

```ts
const artifactBucket = new s3.Bucket(this, "WebPipelineArtifacts");
```

Then define the pipeline artifacts. This is like the bucket keys where each gets stored under:

```ts
const sourceOutput = new codepipeline.Artifact("SourceOutput");
const buildOutput = new codepipeline.Artifact("BuildOutput");
```

Inside a stage, we attach actions which run against the input artifact. AWS provides a number of curated actions you can use for each service.

For our source stage, we'll make use of CodeStar Connections action, which lets us connect to our 3rd-party repositories like GitHub, GitLab, etc.

There are two ways to create a CodeStar connection: via OAuth app and GitHub app. GitHub App is recommended and requires setting it up in the console. You can read more about it [here](https://docs.aws.amazon.com/codepipeline/latest/userguide/update-github-action-connections.html).

After creating the connection, you plug the ARN gotten back into the source action:

```ts
const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction((
  actionName: "GitHub_Source",
  owner: props.githubRepoOwner,
  repo: props.githubRepoName,
  branch: props.githubBranch,
  output: sourceOutput,
  connectionArn: props.githubConnectionArn,
));

this.pipeline.addStage({
  stageName: "Source",
  actions: [sourceAction],
});
```

> If your code is on CodeCommit, feel free to skip and replace the above source action with its counterpart (`CodeCommitSourceAction`), or whatever your source is.

For build stage, we'll use the CodeBuild action and link our project. Input will be the repository artifact and output is a new artifact

```ts
this.pipeline.addStage({
  stageName: "Build",
  actions: [
    new codepipeline_actions.CodeBuildAction({
      actionName: "Build_Docker_Image",
      project: this.codeBuildProject,
      input: sourceOutput,
      outputs: [buildOutput],
    }),
  ],
});
```

Finally, deployment. We attach the deployment group created earlier:

```ts
this.pipeline.addStage({
  stageName: "Deploy",
  actions: [
    new codepipeline_actions.CodeDeployServerDeployAction({
      actionName: "Deploy_to_EC2",
      deploymentGroup: this.codeDeployDeploymentGroup,
      input: buildOutput,
    }),
  ],
});
```

And that's it. We're done piecing together all the parts.

If we were now to push a new commit to the branch we set (e.g, `main`), our pipeline will automatically get triggered.

It will pull the new GitHub revision, build the output in a managed Linux environment and deploy that revision to the EC2 instances selected by the deployment group.

## Bonus: Manual Trigger

The current workflow shown works fine for as long you want CodePipeline to run immediately on every push. But realistically speaking, you wouldn't really want that.

If you use GitHub actions for running extra pre-deploy jobs like linting, version bumping, building release notes etc., you would only want to start deployment after those checks pass.

A clean solution I find is to [disable automatic triggering](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codepipeline-readme.html#trigger) on CodeStar connections source action:

```ts
new codepipeline_actions.CodeStarConnectionsSourceAction({
  // ...
  triggerOnPush: false,
});
```

And manually start the pipeline from your GitHub action when all's ready.

```yaml
- name: Trigger CodePipeline
  run: |
    aws codepipeline start-pipeline-execution \
      --name MyPipelineName \
      --client-request-token "${{ github.sha }}-${{ github.run_id }}" \
      --region $AWS_REGION
```

This way, GitHub handles your CI while AWS handles your CD. Thereby giving you a nice split.

## Conclusion

In this post, we took a common SSH + RSYNC workflow and rewired it using CodeBuild, CodeDeploy, and CodePipeline.

For the sake of simplicity, we stuck to deploying to a single EC2 instance. The downside of this is some downtime during deployments because CodeDeploy stops the application for a brief moment.

In a production setting, this wouldn't be much of a problem as you would have an ASG with more than one instance registered behind an ALB.

But if you really are constrained to having a single instance, then I'll probably look into a multi replica setup with K8s.

I just thought I should point that out.

Anyways, thanks for reading.
