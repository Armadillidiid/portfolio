---
title: transript
date: "2026-01-19T12:16:51.072Z"
tags: []
---

So you’ve got an EC2 instance you want to ship updates to it. How do you go about it?

A lot of us start with the classics of SSH into the box, `git pull` and building on the server. While someone with more experience might build in CI runner like GitHub action and copy the artifacts over to the server.

For the most part, these approaches works. I've used them in the my pet project before. But it falls starts to fall apart when you want to scale beyond one server.

With one single server, you can manage SSH keys and do a all or nothing deploy. But the moment you introduce a second instance, the problem space changes entirely. You have to start thinking about:

1. Automatic rollbacks: What happens when a deployment succeeds on one instance but fails on another? You wouldn't want the risk whereby your instances are running different revisions

2. Credential management. What if your instances are ephemeral like when using an Auto Scaling Group? Keys will be created and revoked constantly so SSH workflow breakdowns.

3. Traffic shift. How do you prevent requests from heading to that instance during deployment?

These are the types of problems that we overlook with ad-hoc solutions.

That's why today we're going to look at CodeBuild, CodeDeploy and CodePipeline and utilize to better deploy our updates.
