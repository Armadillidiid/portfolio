---
title: Unveiling React Server Components
date: "2024-04-17T07:22:01.000Z"
tags:
  - reactjs
  - frontend-development
  - nextjs
cover: >-
  https://cdn.hashnode.com/res/hashnode/image/upload/v1713253147290/da5a8e46-43ae-4c85-892a-e76d4012d11c.png
---

React has undergone a significant evolution since its inception in 2013, transitioning from Higher-Order Components (HOCs) and lifecycle methods to the introduction of hooks in 2019. Now, one of the most recent and monumental changes is the advent of **_React Server Components_**. It opens the doors to running React code exclusively on the server.

Similar to how hooks revolutionized how we code in React, **_RSCs_** represent another paradigm shift. However, there's been widespread confusion surrounding their functionality, particularly regarding how they tie well with traditional **_Client components_**.

In this blog post, we'll walk through the timeline of React, explaining Server-Side Rendering (SSR), Suspense, Component Boundaries, RSCs, what they aim to solve, and how they all interconnect to shape the React as we know today.

## What is Server Side Rendering?

To understand React Server Components (RSCs), we need first to understand how Server Side Rendering works (SSR) and what it tackles. So what is the SSR you might ask? In the simplest terms, it is the generation of HTML from React components on the server. This server-rendered HTML is then sent down to the browser allowing users to view the content of the page while the JavaScript bundle loads and runs.

Before SSR became a thing, users would stare at a blank white page before React could bootstrap the page and attach event handlers. This rendered a bad user experience for users with a poor internet connection (because you have to download the JS bundle first) and users with low-end devices as the JS script has to be parsed and executed, leading to longer [FCP](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint) (First Contentful Paint).

The typical HTML file sent down looks a lot like the below:

```javascript
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/js/bundle.js"></script>
  </body>
</html>
```

The `bundle.js` (usually named with random hash strings as the filename) is the minified bundled output of our application code and contains everything including third-party dependencies needed to run on the browser. This is commonly referred to as the traditional "client-side" rendering strategy (CSR).

Server Side Rendering was introduced specifically to solve this very problem. Instead of viewing a blank page till React bootstraps the page, the server can send a pre-rendered HTML presentation of the content. Albeit, it won't be interactive still event handlers are attached. This illusion creates a better UX.

It is achieved using [`react-dom/server`](https://react.dev/reference/react-dom/server) APIs, specifically the [`renderToString`](https://react.dev/reference/react-dom/server/renderToString) method. This API method helps render a React tree to an HTML string like so:

```javascript
//SERVER
import { renderToString } from "react-dom/server";
import App from "./App.js";

const html = renderToString(<App />);
```

Then on the client, the browser calls [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot#root-render) to make the server-generated HTML interactive. This is accomplished through a technique called `hydration`.

```javascript
//CLIENT
import { hydrateRoot } from "react-dom/client";

const domNode = document.getElementById("root");
const root = hydrateRoot(domNode, reactNode);
```

**_Hydration_** you say? What is that?

Well, **_hydration_** is the process of using client-side JavaScript to add application state and interactivity to server-rendered HTML. To quote [Dan Abramov](https://twitter.com/dan_abramov) on his GitHub gist about SSR:

> Hydration is like watering the “dry” HTML with the “water” of interactivity and event handlers.

React will attach to the HTML that exists inside the `domNode`, and take over managing the DOM inside it. It will attach event handlers, fire off any effects, and so on.

However, for frameworks like Next.js, Remix, etc., SSR could come in different forms or rendering strategies. It could be static or dynamic. Let me explain:

1. **Static Rendering**: With static rendering, components are pre-rendered at build time, or in the background after data revalidation. The output is then cached and pushed to be served by a [CDN](https://developer.mozilla.org/docs/Glossary/CDN). This rendering strategy is only used when the data in a component can be known at build time, such as a static blog.
2. **Dynamic Rendering:** With dynamic rendering, all components or routes are rendered each time at **request time.** This means when a client fetches UI components from the server, it is rendered dynamically based on information that can only be known at request time such as cookies or URL search params. This strategy ensures that the returned response is always up-to-date and tailored to the specific request.

And that's everything to know about Server Side Rendering. It's not a new concept and has actually been part of React since its inception. Don't believe me? [Here are the release notes from v0.4.0.](https://github.com/facebook/react/blob/main/CHANGELOG.md#040-july-17-2013) Albeit, the SSR back then wasn't the same as what we have today, it was always in the works.

That aside, SSR until recently posed two major imperfections despite being better than "client-side" rendering (CSR).

## Flaws of Legacy SSR

With the previous SSR, pre-rendering of the HTML and hydration were an "**all-or-nothing**" decision. This meant for the server to respond with HTML to the client, all components must have their data ready beforehand. It needed to wait for **all blocking components** to be ready before it could start sending any pre-rendered HTML. This was its first flaw.

The second major flaw was that React had to hydrate every JavaScript code before you could interact with the UI. This meant that once React starts calling your component functions, it won't stop until it's done with your entire tree. While this issue may be arguable for users with high-end devices, it proves untenable for general use cases. Especially if the user wants to navigate out of the current page quickly, but can't do so due to hydration blocking interactions.

The above problems contain one common pattern: **they require the selection of performing only one task at a time**. As recently discussed, in SSR, a sequence of stages must be completed before users can view and interact with a page. Due to this sequential nature, they act as blocking operations, preventing the server from advancing to the next stage until the preceding one is finished.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711223310269/86728ec4-a699-45c5-8f64-e066dc4430f3.png align="center")

What if we could split up these sequential stages to be handled asynchronously for each part of the page?

Luckily, the React team foresaw this problem and created what we know today as [**_Suspense_**](https://react.dev/reference/react/Suspense).

## Streaming with React Suspense

**Streaming** allows us to break down a page's HTML into smaller chunks and progressively send those chunks, bit by bit, from the server to the client. The result of this is:

1. Pages display earlier, eliminating the need to wait for data loading on the server.
2. Interactivity with the page is enabled sooner, bypassing the necessity to wait for the entire DOM tree to complete hydration. (More on this later on)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711300473280/aa847545-5820-45b5-b456-5c03b23a7d23.png align="center")

This is accomplished through the API [`renderToPipeableStream`](https://react.dev/reference/react-dom/server/renderToPipeableStream), which utilizes [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) under the hood.

Streaming isn't anything new as browsers have long utilized it for handling media assets; videos buffer and play as additional content downloads.

It aligns perfectly with React's core component model as each component could be classified as a chunk. Components that don't depend on dynamic data, such as a `Navbar`, can be prioritized and sent down first for earlier hydration. Subsequently, other components could be transmitted once all their required data has been fetched.

For example, consider we have the following component structure:

```javascript
const Page = () => (
  <Layout>
    <NavBar />
    <Sidebar />
    <main>
      <PostFeed />
      <Comments />
    </main>
  </Layout>
);
```

Which will be rendered to this:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711306707206/afa2e4da-b7b1-4fc1-b7ec-e0ca75546e9c.png align="center")

The components `<Comments/>` and `<PostFeed/>` require data fetching. Thus, it's preferable to instruct the server not to wait for their readiness and instead send a fallback UI (e.g. skeleton, spinner) in their place. We can achieve this by wrapping them both in `<Suspense>`.

```typescript
...
<Suspense fallback={<Spinner />}>
  <Post />
  <Comments />
</Suspense>
...
```

React will now display a spinner component while they get ready:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711308930577/71667508-e570-4983-a17f-a5c185d427fa.png align="center")

If we further inspect the returned HTML, we'll find neither component in the DOM tree - `<Comments />` or `<PostFeed />` .

```xml
<div id="root">
  <nav>
    <!--NavBar -->
    <a href="/">Home</a>
  </nav>
  <aside>
    <!-- Sidebar -->
    <a href="/profile">Profile</a>
  </aside>
  <main>
    <!-- Spinner -->
    <img width="200" height="200" src="/static/spinner.gif" alt="Loading..." />
  </main>
</div>
```

Once both components are ready on the server, using the pre-existing stream, additional HTML, along with an inline `<script>` , will be sent to replace the fallback element. Since this comprises solely of HTML, React doesn't even need to be loaded at the time for the components HTML to display.

With this approach, we don't have to delay our pre-rendered HTML from being sent down anymore due to a component or groups of components.

> **Early Adoption**
>
> Suspense queitly made its debut in 2018 in the form of `React.lazy`. Initially, it only supported lazy-loading code on the client. Despite its limited scope upon release though, its overarching goal was to integrate with Server-Side Rendering.

I previously hinted at the advantage of "**_Interactivity with the page is enabled sooner_**" when discussing the benefits of Suspense. This is enabled by a concept called "**_Selective Hydration_**."

## Quick Memo on Selective Hydration

Wrapping our components with `<Suspense>` brings one more improvement that's not immediately apparent: **hydration no longer blocks the browser from performing other tasks.**

This improvement is due to React's intelligent prioritization of hydration based on user interaction. For instance, when a user triggers an event like a click, React ensures that the corresponding components along the interaction path are prioritized for hydration. This includes traversing up the component tree, ensuring that every relevant component is hydrated until a Suspense boundary is encountered.

Also when React hydrates components within a Suspense boundary, it does so in small intervals where the browser still retains its ability to handle events. This guarantees the UI remains responsive during prolonged hydration periods.

Now, let's imagine that hydration for `<Comments />` hasn't occurred yet, while the `<PostFeed />` component is currently undergoing hydration. Both their code has being downloaded also.

Now, if we were to click on `<Comments />` rendered HTML.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711355223553/dcaeb1bf-168e-4c0e-afbb-507486d732b2.png align="center")

In the same capture phase of the click, React will stop whatever it's doing and urgently hydrate `<Comments />` just in time to respond to the click event.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711356090641/9ada9154-65eb-4969-9a46-0beac6593fc8.png align="center")

To quote [Dan Abramov](https://twitter.com/dan_abramov) again:

> **This creates an illusion that hydration is instant because components on the interaction path get hydrated first.**

Following that, React will proceed to hydrate the remainder of the application.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711356571885/2526e666-d3b9-4a43-a8e0-0b8997f01ccc.png align="center")

And that's how our pages appear to be more responsive more quickly. By utilizing `Suspense`, we automatically opt into all these features. For more details, you can explore the [documentation](https://react.dev/reference/react/Suspense).

So far, we've discussed what Server-Side Rendering (SSR) is and how well it integrates with Suspense. However, there's one more ingredient we could add to the mix to make our dish complete.

In all our previous examples, our React code has consistently run on the server to generate an initial shell and then is sent down to the client, to enhance the loading experience to feel somewhat faster. We've even explored the possibility of streaming the chunks of HTML. However, what if we wanted to execute code exclusively on the server and send down only the outputs (without the source code)?

For instance, imagine we want to query our remote database. This hasn't been feasible so far with React, even with Server-Side Rendering. Our components still get rendered on both the server and the client.

Meta frameworks like Next.js and Remix each introduced their own solutions. Next.js implemented [`getServerSideProps`](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props), Remix introduced [`loader`](https://remix.run/docs/en/main/route/loader) functions etc. These solutions enabled us to run some code ahead of rendering our components. However, they each had their drawbacks, including inconsistent implementations (no official standard) and limitations such as only functioning at the route level (components at the top of the tree).

Fortunately, the React team came up with an official standard to address this problem: **React Server Components**.

## New Paradigm: React Server Components

**_React Server Components_** (RSCs) represent a fundamental shift by executing code on the server rather than the client. This also grants us access to server infrastructure such as file systems and data stores. Essentially, anything runnable in a Node environment can be executed within RSCs. But this also comes with a trade-off; **a significant portion of React and Web APIs become incompatible.**

Here is a simple example of a server component:

```typescript
import { PrismaClient } from "@prisma/client";

export const Page = async () => {
  // Connect to the database
  const db = new PrismaClient();

  // Fetch all blog posts that contains keyword "Next"
  const results = await db.post.findMany({
    where: {
      title: {
        contains: "Next",
      },
    },
  });

  return (
    <>
      <h1>Blog posts</h1>
      {results.map((item) => (
        <article key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.content}</p>
        </article>
      ))}
    </>
  );
};

export default Page;
```

There's a lot to address here. Initially, one might wonder how our component is capable of being asynchronous. You might argue our async call is going to trigger on every render. While this skepticism would be valid for a "**_Client component"_** (more on this later), it doesn't apply in this case.

The thing is, **_Server Components_** do not actually **re-render**. They're rendered only once on the server to the generate UI, and the result is sent down. Hence, why certain React APIs become incompatible as interactivity isn't needed.

If a state change occurs and we wish to display the fresh update, we can call [`router.refresh`](https://nextjs.org/docs/app/api-reference/functions/use-router#userouter). This action will trigger a new request to the server, prompting the re-rendering of Server Components, and then merge the updated RSC payload without losing the client-side state.

In the code example, we're also establishing a connection to our database using our preferred ORM. Due to the environment isolation of RSCs, we avoid exposing confidential secrets (e.g., DATABASE_URL) while eliminating unnecessary round trips (zero waterfalls).

Considering that our servers are also consistently provisioned closer to our data sources (e.g., database, message broker), RSCs will always resolve quicker (in terms of latency).

It's good to know in this shifting landscape, what we commonly refer to as "**Client components**" are traditional React components imbued with interactivity. Even though the name implies they're only rendered on the client, this isn't the fact as they're pre-rendered on the server too due to SSR. Honestly, the naming convention can be a bit misleading—a misnomer, if you will—but it's what everyone calls it.

## Component Boundaries and Directive

By default, all components are opted-in as "**Server Components**". To make a component or module client-side, we have to **explicitly opt-in** using the "`use client`" directive. This is usually carried out by specifying it at the top of the file:

```typescript
"use client";

import React, { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default Counter;
```

This directive signals React to execute the module on the client side. Additionally, it's important to note that by adding a directive, the same effect is applied to transitive dependencies—modules that are directly imported.

> **NOTE**: There's also an additional directive called "`use server`". It is currently used for Server Actions and has a totally different behaviour.

When a file is marked with '`use client`' and is imported from a Server Component, it serves as a boundary in the module dependency tree between code intended for server-side execution and that meant for client-side execution.

It's important to differentiate between a module dependency tree and a render tree because they each capture a different hierarchical structure of an app. What leads to this distinction?

The module dependency tree outlines the relationships between modules in terms of their dependencies and imports. This tree helps bundlers determine the dependencies of each module and how they should be packaged for deployment.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711737680719/8827550c-cd44-4bed-8c2d-9cf45a7e2d12.png align="center")

On the other hand, the render tree focuses solely on component modules, excluding non-component modules. It represents the flow of components as they render in the application.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711737894663/7beb65b5-d8d3-4da8-a1d0-e6b4fd953874.png align="center")

In my personal opinion, I find it much simpler to visualize boundaries within a dependency tree compared to a render tree. The mental model becomes increasingly complex when JSX is passed as props between components. This is because directives become automatically applied to modules directly imported into the component.

Consequently, in a render tree, we might encounter a scenario where a server component acts as a child to a client component. Yes, this scenario is indeed possible, which can lead to confusion in understanding the execution environment of each component.

To better illustrate this, take for example the following component structure:

<iframe src="https://codesandbox.io/p/devbox/github/Armadillidiid/render-and-module-tree-demo/tree/main/?embed=1&file=%2Fapp%2Fpage.js" style="width:100%;height:500px;border:0;border-radius:4px;overflow:hidden" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711494675438/1a9dc806-00ae-4860-88af-f1d9bf989b60.png align="center")

In our render tree, we have three components: `Comp A`, which is a conditionally rendered server component that accepts `Comp C` as children; `Comp B,` a client component; and `Comp C`, which serves as both a client and server component.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711494088867/fb29287a-0cd1-4ffc-9cd5-f9b15612f21f.png align="center")

Comp C is a client and server component? How is that even possible?

Well, when a component is defined in a module with a `'use client'` directive, or the component is imported and called in a Client Component, then the component is a Client Component. Otherwise, the component is a Server Component.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711737439650/78e21fa6-d9d5-4c20-abc0-6787e6a39288.png align="center")

In this scenario, `Comp A` receives `Comp C` as a child component, but it neither directly imports the module nor calls the component itself. As a result, `Comp C` doesn't appear as a node under `Comp A`. According to the definition provided earlier, `Comp C` becomes a server component by usage, as it's the parent `App` component that executes it.

On the other hand, under `Comp B`, `Comp C` is directly imported and rendered, making it a dependency of `Comp B`. Therefore, `Comp C` becomes a client component in this context.

It's important to note that if `Comp C` had interactivity or utilized unsupported Web APIs, React would raise an error because a server component can only be a child node to a client component in the module dependency tree if passed as children.

### When Components Should be Rendered as Client Components?

In general, if a component can be rendered on the server without any issues, it's best to keep it as a server component. This is beneficial due to the performance boosts provided by RSCs. However, since most applications require some level of interactivity in reality, not every component can be a server component.

My advice would be to thrive on making Client Components primarily as leaves within the component tree. Ideally, they should be positioned as far down a branch as possible, ensuring that their children do not inherit the "`use client`" directive.

## RSC Under the Hood

Have you taken a moment to inspect your network tab to view the response of a Server Component? It's noteworthy that RSCs aren't sent down as a JS script file.

On the server, React renders your Server Components into a special data format known as an **_RSC Payload_**. Then on the client, React downloads and parses the payload to resolve where to render the elements. The output structure resembles JSON a lot, that's because it mostly is.

Before inspecting the payload, there are a few things we need to first glance at.

React serializes components rendered on the server, along with any props passed from a Server Component to a Client Component. If you're familiar with `JSON.stringify`, then you're likely aware that not all types are serializable.

```typescript
let map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]); ❌
let set = new Set([1, 2, 3]); ❌
let arr = [1, 2, 3]; ✅
let json = JSON.stringify({ map, set, arr });


console.log(json);
// Output: "{"map":{},"set":{},"arr":[1,2,3]}"
```

To combat this, React uses a [custom mapper](https://github.com/facebook/react/blob/a1c62b8a7635c0bc51e477ba5437df9be5a9e64f/packages/react-client/src/ReactFlightReplyClient.js#L154). This custom mapper under the hood uses `JSON.stringify` but with a [replacer function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#the_replacer_parameter) to support non-serializable types. Depending on the type of the value, it performs a specific serialization operation. For example, if the value is a promise, it waits for its resolution and serializes the resolved value by calling `serializePromiseID`.

The serialize functions execute two purposes:

1. They take in the `id` of the serialized type and converts it into a string representation.
2. They prefix this resulting string with a dollar symbol and an identifier character to signify the unique type. For instance, 'W' for sets, 'Q' for maps, etc.

Thereafter, on the client side, React utilizes these unique prefixes to reference and deserialize the JSON string back to its original form.

That's enough talk. Let's add a new route with some non-default serializable types to see what the payload actually looks like. We'll still be using the code from our [previous CodeSandbox](https://codesandbox.io/p/github/Armadillidiid/render-and-module-tree-demo/draft/throbbing-waterfall).

`/app/new/page.js`

```typescript
import Link from "next/link";

export default function Page() {
  return <Link href="/">Prefetch</Link>;
};
```

```typescript
"use client";
// Converted CompA from server component to client
const CompA = ({ json }) => {
  return (
    <>
      <div>
        {json.map.constructor.name} {json.map}
      </div>
      <div>
        {json.set.constructor.name} {json.set}
      </div>
    </>
  );
};
export default CompA;
```

If we visit the route `/new` and renavigate back to the root page using the Link component, we should get this response in our network tab. Due to SSR, the **_RSC payload_** can only be seen on subsequent navigations. If you were to load `/new` as your initial load, you'd only get an HTML response.

```json
2:I["(app-pages-browser)/./app/CompA.js",["app/page","static/chunks/app/page.js"],""]
5:"$Sreact.suspense"
6:I["(app-pages-browser)/./node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js",["app/page","static/chunks/app/page.js"],"BailoutToCSR"]
3:[[1,"one"],[2,"two"],[3,"three"]]
4:[1,2,3]
0:["development",[["children","__PAGE__",["__PAGE__",{}],["__PAGE__",{},["$L1",[["$","$L2",null,{"json":{"map":"$Q3","set":"$W4","arr":[1,2,3]},"children":["$","h2",null,{"children":"Above 12:00 PM"}]}],["$","$5",null,{"fallback":null,"children":["$","$L6",null,{"reason":"next/dynamic","children":"$L7"}]}]],null]],[null,"$L8"]]]]
9:I["(app-pages-browser)/./app/CompB.js",["app/page","static/chunks/app/page.js"],""]
7:["$","$L9",null,{}]
8:[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","1",{"charSet":"utf-8"}],["$","title","2",{"children":"Create Next App"}],["$","meta","3",{"name":"description","content":"Generated by create next app"}],["$","link","4",{"rel":"icon","href":"/favicon.ico","type":"image/x-icon","sizes":"16x16"}],["$","meta","5",{"name":"next-size-adjust"}]]
1:null
```

Right out of the gate, the first notable observation is each line begins with a number, followed by a colon, and sometimes proceeded by the character "**I**". After that, the remaining data appears to be JSON.

```json
3:[[1,"one"],[2,"two"],[3,"three"]]
4:[1,2,3]
...,
    ...,
        [
          "$",
          "$L2",
          null,
          {
            "json": {
              "map": "$Q3",
              "set": "$W4",
              "arr": [1, 2, 3]
            },
            "children": [
              "$",
              "h2",
              null,
              {
                "children": "Above 12:00 PM"
              }
            ]
          }
        ]
    ...
...
```

I went ahead and removed some lines of the payload to analyze the essential parts.

There are a few key elements to decipher here. Notably, we can see our serialized set and map appear as the third element in the node array, each accompanied by their respective IDs. If further look down, you see where they are referenced by the id with theirs respective identifier prefix. The identifier prefix informs React about the data type for proper parsing.

What about the second element in the node? It represents the current level node, which could be either an HTML tag or a component. In cases where the node is a client component, it points to the payload line referencing the JavaScript file. This explains why some lines have an "**I**" prefix, as they reference a JavaScript file on the client.

Everything beyond "`$L1`" which represents the route segment component, constitutes a proper `node` with an expression resembling this:

```json
["$", "p", "0", { "children": "I'm a child node" }]
```

Which gets interpreted to the below in the DOM:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711666496843/ec34f668-c4fe-4773-81aa-0dab90c273dd.png align="center")

If you're curious to _play around with_ parsing of RSC payload, check out this [dev tool by Alvar Lagerlöf](https://rsc-parser.vercel.app/). It provides a visual representation of the payload with intuitive UI components.

Additionally, there's a [minimal RSC demo](https://github.com/reactjs/server-components-demo) without SSR built by the React team. It saves you the hassle of setting up a project to explore RSCs. Also, since it lacks SSR, you can access the RSC payload upon the initial page load without navigating.

## Conclusion

The advent of React Server Components marks a milestone in the way we code in React today. By shifting the heavy lifting of rendering to the server, we can achieve faster load times and ship less JavaScript bundles to the browser. Consider the image below, depicting legacy SSR:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711738629309/d8b47e81-f530-4a24-b008-6a612087c8be.png align="center")

However, by integrating Suspense and React Server Components, we can achieve results like the following:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1711718041599/a84c826e-72f2-4dda-9889-3295c04ef9b6.png align="center")

And if we want to take things to the next level, there's a new feature released in Next.js 14 (albeit currently experimental) called [Partial Prerendering](https://nextjs.org/docs/app/api-reference/next-config-js/partial-prerendering). If we utilize it, we can essentially eliminate the initial pre-render block, ensuring that content is delivered instantly upon user request.

These are exciting times to be a web developer as the ecosystem continues to push out new technologies each day. I'm filled with optimism for the future and hope that this blog post has successfully revealed the capabilities of React as it stands today.
