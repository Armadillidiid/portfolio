---
title: Different ways to conditionally provision a CDK resource
date: 2025-08-09T15:56:58.403Z
tags:
  - aws
  - devops
  - iac
cover: covers/different-ways-to-conditionally-provision-a-cdk-resource.png
---

So over the weekend, I had the brilliant idea to offload the grunt work of setting up a [WireGuard](https://www.wireguard.com/) server to Infrastructure as Code.

I got tired of replaying the same commands over and over whenever I wanted a new instance, so I finally bit the bullet that day and ran `npx cdk init`.

For the project, an S3 bucket was needed for periodic backups. But I noticed right after adding it to the stack, my deployments would sometimes begin to fail due to CDK complaining the bucket already exists.

My normal instinct was to simply conditionally create the bucket only if it didn’t exist. It seemed very straightforward, but with hindsight, it was everything but that.

That's why in this guide, I'll go over the different ways and how you can conditionally provision a CDK resource, based on what I learned.

But before we begin, let's look at what doesn't work.

## Don't bother using `if` statements

Now, if you're anything like me, your first order of thought would be to reach for an `if` statement (or a ternary operator if you prefer). After all, that's the go-to for programming when something needs to happen based on a condition.

For example, say you retrieve the condition as an environment variable, you might do the following:

```ts
import { Stack, type StackProps, RemovalPolicy } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as ssm from "aws-cdk-lib/aws-ssm";

import type { Construct } from "constructs";

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const shouldCreateBucket = process.env.SHOULD_CREATE_BUCKET === "true";

    const bucket = shouldCreateBucket
      ? new s3.Bucket(this, "MyBucket", {
          bucketName: "my-bucket",
          removalPolicy: RemovalPolicy.DESTROY,
        })
      : s3.Bucket.fromBucketName(this, "MyBucket", "my-bucket");

    // IGNORE: Filler resource to avoid stack from being empty when bucket gets deleted
    new ssm.StringParameter(this, "FillerParam", {
      parameterName: "/i-am-only-here-to-fill-space/ignore-me",
      stringValue: Date.now().toString(),
    });
  }
}
```

> S3 has a [deletion policy of `RETAIN` by default](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3-readme.html#bucket-deletion). In this example, I set it to `DESTROY` to demonstrate why using an `if` statement isn't viable.

> Also, ignore the SSM resource. It's only there to prevent the stack from being deleted during redeployment.

At first glance, this approach seems to work just fine. You go ahead to synthesize your application, deploy it, and you say "Great!" Everything appears to be in order.

However, if you later update your stack, prompting you to redeploy (this time with `SHOULD_CREATE_BUCKET` disabled since the bucket was already created), you'll notice a big issue.

Your deployment would succeed just fine without errors, but then you'll quickly realize that your S3 bucket is gone and was deleted.

"Huh, why does that happen?" you might say.

Well, it all comes down to how CDK fundamentally works.

CDK deployments are [run based on the generated CloudFormation templates](https://docs.aws.amazon.com/cdk/v2/guide/core-concepts.html#:~:text=Infrastructure%20created%20with%20the%20AWS%20CDK%20is%20eventually%20translated%2C%20or%20synthesized%20into%20AWS%20CloudFormation%20templates%20and%20deployed%20using%20the%20AWS%20CloudFormation%20service) after synthesis. On your first deployment when `SHOULD_CREATE_BUCKET` is set to true, CDK creates and manages the bucket as part of the stack.

But on your second deployment, when `SHOULD_CREATE_BUCKET` is set to false, CDK follows the `else` branch and omits the bucket from the CFN template. So to CDK, it looks like you want the bucket removed from the stack, so it attempts to do so according to your specified deletion policy, which we set to delete.

Remember, under the hood, CDK is just an abstraction over CloudFormation.

"What if, instead of a runtime value, we determine the condition at deployment time using something CDK is aware of, like a [parameter](https://docs.aws.amazon.com/cdk/v2/guide/parameters.html) or [context value](https://docs.aws.amazon.com/cdk/v2/guide/context.html) ?"

Spoiler alert, that doesn't work either 😬. Not for the reason you expect though.

```ts
// Using parameters
const shouldCreateBucket = new CfnParameter(this, "ShouldCreateBucket", {
  type: "String",
  description: "Should create a new S3 bucket?",
  allowedValues: ["true", "false"],
}).valueAsString;

const bucket =
  shouldCreateBucket === "true"
    ? new s3.Bucket(this, "MyBucket", { bucketName: "my-bucket" })
    : s3.Bucket.fromBucketName(this, "MyBucket", "my-bucket");

// ...
```

Values that aren’t known during synthesis are represented as a [token](https://docs.aws.amazon.com/cdk/v2/guide/tokens.html), and these tokens during synthesis are placeholder strings (e.g., `${TOKEN[`[`Bucket.Name`](http://Bucket.Name)`.1234]}`) to be later substituted.

So when you compare `shouldCreateBucket` to equal `"true"`, you’re really comparing against a random string, which always evaluates to `false`.

In essence, you're doing this:

```ts
 const bucket = `${TOKEN[Bucket.Name.1234]}` === "true"
   ? new s3.Bucket(this, "MyBucket", { bucketName: "my-bucket" })
   : s3.Bucket.fromBucketName(this, "MyBucket", "my-bucket");
```

By now, you should realize that we need some sort of baked-in way to express a conditional statement in CloudFormation at deployment time, rather than during synthesis, unless it's practically impossible.

Luckily, there is.

## Using `CfnCondition` construct

[`Conditions`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html) is CloudFormation's way to determine circumstances under which resources are created or configured. The construct for this in CDK is [`CfnCondition`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.CfnCondition.html).

Luciano Mammino wrote a [great piece](https://loige.co/create-resources-conditionally-with-cdk/) on this a couple years ago and still holds up today.

To create a condition, you instantiate it like we do with any other resource, and then attach it to the resource of choice.

To define the condition expression, we have to use what are called [intrinsic functions](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/intrinsic-function-reference.html). They're built-in CFN functions that enable us to perform operations on values that are not yet available until deployment time.

Using our parameter defined in the previous example, we can create a condition out of it.

```ts
// ...

const shouldCreateBucketCondition = new cdk.CfnCondition(this, "ShouldCreateBucketCondition", {
  expression: cdk.Fn.conditionEquals(shouldCreateBucket, "true"),
});

// ...
```

Then attach it to a resource:

```ts
// ...

const bucket = new s3.Bucket(this, "MyBucket", {
  bucketName: "my-bucket",
});
(bucket.node.defaultChild as s3.CfnBucket).cfnOptions.condition = shouldCreateBucketCondition;
```

I won't lie, the way to attach the condition feels a bit unintuitive. There's no `setCondition` method on the returned resource like when we attach a permission, nor a prop we can set it directly to.

I couldn't find much info on why it's this way, but my intelligent guess is because `CfnCondition` is an L1 construct, while `s3.Bucket` is an L2 construct. So we need to access the underlying L1 resource node to attach the condition.

At this point, we're sure the bucket will always exist, even if it didn't before. We can now confidently import the bucket and use it down the stack.

To do so, we'll use the resource unique identifier, which in this case is our bucket name:

```ts
// ...

const bucketAlt = s3.Bucket.fromBucketName(this, "ImportedOrCreatedBucket", bucketName);

new cdk.CfnOutput(this, "BucketArnOutput", {
  value: bucketAlt.bucketName,
  description: "ARN of S3 bucket",
});
```

If we synthesize the stack, we should see our condition expressed in the template and attached to the resource.

```plaintext
{
  // ...
  "Conditions": {
    "ShouldCreateBucketCondition": {
      "Fn::Equals": [
        {
          "Ref": "ShouldCreateBucket",
        },
        "true",
      ],
    },
  },
  "Resources": {
    // ...
    "MyBucketF68F3FF0": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "BucketName": "my-bucket",
      },
      "UpdateReplacePolicy": "Delete",
      "DeletionPolicy": "Delete",
      "Metadata": {
        "aws:cdk:path": "ExampleStack/MyBucket/Resource",
      },
      "Condition": "ShouldCreateBucketCondition", 👈️
    },
  },
}
```

Now, on redeployment, our bucket will only ever be created when our condition `SHOULD_CREATE_BUCKET` evaluates to true.

Great, this works! But there's a catch.

If you hadn't noticed, we have to manually update `SHOULD_CREATE_BUCKET` every time we deploy, making our bucket kind of a semi-unmanaged resource.

Personally, the tendency to forget setting the right state for each deployment just doesn't sit right with me.

Let's look at the other approach.

## Using `CustomResource` construct

[Custom resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html) are one of the ways (or the only way?) to break out of CloudFormation's limitations and write your own imperative logic. At some point, I realized that certain workflows just can't be expressed with the built-in resource types CloudFormation provides.

For example, maybe I want to provision Blob storage on Azure instead of S3, or (as I almost did) manage DNS records on Cloudflare because my domain isn’t on Route53.

With custom resources, you can do almost anything.

But, as Uncle Ben says, _"With great power comes great responsibility."_

This responsibility means having to write more code. Like, a lot more code, because you're now responsible for calling the APIs and handling errors yourself.

Let's see how to create a custom resource:

### What makes up a custom resource

> The official docs refer to what I call consumer as the "template-developer," but I prefer consumer as it's straightforward.

There are two main parts to a custom resource: the [provider](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.custom_resources.Provider.html), which contains the actual logic, and the [consumer](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.CustomResource.html), which basically calls the provider with the required properties.

For the consumer side, two things are needed:

1. A service token. E.g., Lambda function, SNS topic.
2. At least one resource property

```ts
const bucketResource = new CustomResource(this, "CustomBucketResource", {
  serviceToken: new CustomS3BucketProvider(this),
  properties: {
    bucketName: "my-bucket",
    // other properties
  },
});
```

The service token is where CloudFormation sends the requests to, which could either be an SNS topic or a Lambda function.

Resource properties is basically a record required by the provider. At least one property must be defined.

For our continued example, a Lambda function works perfectly fine.

On the provider side, we need two things also:

1. A handler that processes the requests CloudFormation sends and performs actions based on the event.
2. A CDK construct that provisions the handler and returns the ARN to be used as the service token.

> It's a good idea to treat the provider as a separate package, because as soon as you add any third-party dependency apart from the AWS SDK, you'll need to introduce bundling for your Lambda function.

### Defining our provider

To define our provider, we'll first need to create the [Lambda resource](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html) for our handler:

```ts
export class CustomS3BucketProvider extends Construct {
  public readonly provider: cr.Provider;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const lambdaFn = new lambda.Function(this, "S3CustomResourceHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "handler")),
      timeout: cdk.Duration.minutes(5),
      initialPolicy: [
        // IAM policies needed
      ],
    });

    // ...
  }
}
```

In it, we'll specify the essentials and path to the handler. Nothing too fancy.

For `initialPolicy`, we'll need to grant the Lambda permissions needed to interact with any resources it manages. In our case, that's S3.

```ts
{
  // ...
  initialPolicy: [
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:*"],
      resources: ["*"],
    }),
  ];
}
```

We can now complete the custom resource provider, pointing to the handler:

```ts
export class CustomS3BucketProvider extends Construct {
  public readonly provider: cr.Provider;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ...
    this.provider = new cr.Provider(this, "CustomS3BucketProvider", {
      onEventHandler: lambdaFn,
    });
  }
}
```

### Defining our handler

At its core, the handler is responsible for processing all resource lifecycle events: `Create`, `Update`, and `Delete`.

Every CFN resource goes through this lifecycle, whether it's internally managed or external. With our handler, we get to define how we respond to each of these events externally.

A `handler` function would generally follow this same structure regardless of the programming language you use:

```ts
type OnEventRequest = AWSCDKAsyncCustomResource.OnEventRequest;
type OnEventResponse = AWSCDKAsyncCustomResource.OnEventResponse;

export const handler = async (event: OnEventRequest): Promise<OnEventResponse> => {
  try {
    switch (event.RequestType) {
      case "Create":
        return await handleCreate(event); // { PhysicalResourceId: "xxx" }
      case "Update":
        return await handleUpdate(event); // { PhysicalResourceId: "xxx" }
      case "Delete":
        return await handleDelete(event); // { PhysicalResourceId: "xxx" }
      default:
        throw new Error("Unknown request type");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

async function handleCreate(event: OnEventRequest): Promise<OnEventResponse> {
  // TODO
}

async function handleUpdate(event: OnEventRequest): Promise<OnEventResponse> {
  // TODO
}

async function handleDelete(event: OnEventRequest): Promise<OnEventResponse> {
  // TODO
}
```

There's a lot to unpack here, so let's break it down.

> The type `AWSCDKAsyncCustomResource` is available as a declaration file in `aws-cdk-lib` under `/node_modules/aws-cdk-lib/custom-resources/lib/provider-framework/types.d.ts` (as of version `2.207.0`).

> Note: Importing this declaration will cause the TypeScript compiler to fail with an error due to this [GitHub issue](https://github.com/aws/aws-cdk/issues/31981). As a workaround, you can copy and use the type definitions provided below until the issue is resolved.

In it, we use a switch to exhaustively handle all event types (`Create`, `Update`, `Delete`). For each case, we return a response object that must include at least `PhysicalResourceId`.

To make things clearer, let’s look at the event interfaces, starting with the request event:

```typescript
interface OnEventRequest {
  RequestType: "Create" | "Update" | "Delete";
  LogicalResourceId: string;
  ResourceProperties: { [key: string]: any };
  OldResourceProperties?: { [key: string]: any };
  PhysicalResourceId?: string;
  ResourceType: string;
  RequestId: string;
  StackId: string;
}
```

CFN sends a request to our handler with the following packed inside.

> For more details on request objects, see [Custom resource request objects](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html).

```ts
interface OnEventResponse {
  PhysicalResourceId?: string;
  Data?: { [name: string]: any };
  NoEcho?: boolean;
  [key: string]: any; // For `IsComplete` handler if defined
}
```

For event response, there are three main properties we should care about.

1. The `PhysicalResourceId`, which is compulsory with an exception to one event (reason why it could be optional),
2. `Data`, an optional record of values which can be retrieved by the consumer using `Fn::GetAtt` (we'll call this later on to retrieve the bucket name)
3. And finally, `NoEcho` to mask sensitive output.

> For more details on response objects, see [Custom resource response objects](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-responses.html).

With that covered, we can now implement each event.

### Handling Lifecycle Events

To create an S3 bucket, we're going to obviously need the bucket name and possibly some additional attributes.

Let's define a props interface (or better yet, a schema validator) to clearly establish the contract between our provider and consumer. It will be used to validate the passed `ResourceProperties` in the event object.

```ts
type S3CustomResourceProperties = {
  BucketName: string;
  Versioning?: boolean | undefined;
  PublicReadAccess?: boolean | undefined;
};
```

Let's do the same for `Data` in our response.

```ts
export const S3_CUSTOM_RESOURCE_RESPONSE_ATTR = {
  BUCKET_NAME: "BucketName",
} as const;
```

> For simplicity, we're using a `const` object and an interface here, but you should really use a schema validator for stricter type-safety.

Next, let's complete our `handleCreate`. We're going to interact with S3 using the [AWS SDK V3 client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/).

> Tip: AWS client libraries come by default bundled in a Lambda function

```ts
import * as s3 from "@aws-sdk/client-s3";

async function handleCreate(event: OnEventRequest): Promise<OnEventResponse> {
  const { ResourceProperties } = event;
  const resourceProperties = ResourceProperties as S3CustomResourceProperties;
  const { BucketName, Versioning, PublicReadAccess } = resourceProperties;
  // ...
}
```

First, we check if our S3 bucket exists by calling `HeadBucketCommand`. If it does exist, do nothing and return early with a success response. If it doesn't, proceed to create the bucket.

```ts
//...

try {
  await s3Client.send(new s3.HeadBucketCommand({ Bucket: BucketName }));
  console.log(`Bucket ${BucketName} already exists - skipping creation`);

  // Early return if bucket exists
  return {
    PhysicalResourceId: BucketName,
    Data: {
      [S3_CUSTOM_RESOURCE_RESPONSE_ATTR.BUCKET_NAME]: BucketName,
    },
  };
} catch (error) {
  if (error instanceof s3.NotFound || error instanceof s3.NoSuchBucket) {
    console.log(`Bucket ${BucketName} does not exist, will create it`);
  } else {
    console.error("Error checking bucket existence");
    // Return "FAILED" response to CloudFormation
    throw error;
  }
}

// Create bucket
await s3Client.send(new s3.CreateBucketCommand({ Bucket: BucketName }));
console.log(`Bucket ${BucketName} created successfully`);

// ...
```

We can further configure the bucket with the extra props passed, and finally return a success response.

```ts
// ...

// Enable versioning if specified
if (Versioning) {
  await s3Client.send(
    new s3.PutBucketVersioningCommand({
      Bucket: BucketName,
      VersioningConfiguration: {
        Status: "Enabled",
      },
    }),
  );
  console.log("Versioning enabled");
}

// ...Configure extra props

return {
  PhysicalResourceId: bucketName,
  Data: {
    [S3_CUSTOM_RESOURCE_RESPONSE_ATTR.BUCKET_NAME]: bucketName,
  },
};
```

That's it. Upon the `Create` lifecycle of our custom resource in the consumer stack, our `handleCreate` will be called accordingly.

Handling the other events (`Update` and `Delete`) follows a similar pattern, though each has its nuances.

For example, the `Update` event is the only event that receives `OldResourceProperties` in the event payload.

```ts
async function handleUpdate(event: OnEventRequest): Promise<OnEventResponse> {
  const newProps = event.ResourceProperties as S3CustomResourceProperties;
  const oldProps = event.OldResourceProperties as S3CustomResourceProperties;
  // ...
}

async function handleDelete(event: OnEventRequest): Promise<OnEventResponse> {
  // TODO
}
```

We can use this to compare if there was a change to update the resource accordingly.

```ts
if (oldProps?.Versioning !== newProps.Versioning) {
  if (newProps.Versioning) {
    // Enabling versioning
  }
}
```

### Instantiate custom resource

With our provider and handler setup, we can finally now integrate our custom resource in our stack.

```ts
import {
  CustomS3BucketProvider,
  type S3CustomResourceProperties,
  S3_CUSTOM_RESOURCE_RESPONSE_ATTR,
} from "./s3-client";

const s3Provider = new CustomS3BucketProvider(this);
const s3ProviderProperties: S3CustomResourceProperties = {
  BucketName: "my-bucket",
  Versioning: true,
  PublicReadAccess: false,
};

const bucketResource = new CustomResource(this, "BucketResource", {
  serviceToken: s3Provider.serviceToken,
  properties: s3ProviderProperties,
});
```

To access the bucket name from response data, we can call the `.getAttString(attributeName)` method. Under the hood, it calls the intrinsic function `Fn::GetAtt` on the custom resource.

We could now use our `.fromBucketName(scope, id, bucketName)` or `.fromBucketAttributes(scope, id, attrs)` to import our bucket just like we did in our previous attempts.

```ts
const bucketName = bucketResource.getAttString(S3_CUSTOM_RESOURCE_RESPONSE_ATTR.BUCKET_NAME);

const bucketAlt = s3.Bucket.fromBucketName(this, "ImportedOrCreatedBucket", bucketName);
```

And voilà, we're done!

### Conclusion

In summary, we looked at three ways you could attempt to create a resource conditionally if you're new to CDK. Starting with `if` statements, to `CfnCondition`, and finally `CustomResource`. With the former writing the least code but non-functional, to the latter writing the most.

It's good to note I glossed over some details like adding a `package.json` inside the handler folder to make it an ECMAScript module, `IsComplete` handler, etc. You can find the [full code on this repo](https://github.com/Armadillidiid/wireguard-cdk).

Also, there are a few edge cases you should familiarize yourself with for each lifecycle event. For example, `Delete` event isn't called when `Create` event returns a `FAILED` status. So any resources you provisioned or side effects created have to be manually reverted and handled.

Also, also (last thing I promise 😅), the `CustomResource` class shouldn't be called directly in your consumer stack. It should be encapsulated in a custom construct that acts as a shim between your provider and your consumer. I skimped over that because the article was getting too long at this point.

Anyways, thanks for reading. I hope this blog post gave you a better sense of the various ways you might tackle this problem out in the wild. I'm by no means a CDK expert, so I'm all ears for your feedback and suggestions.

Until then, bye! 👋
