---
title: Setting up a Monorepo using PNPM workspaces with TypeScript and Tailwind
date: 2024-02-02T08:40:21.284Z
tags:
  - software-architecture
  - typescript
cover: >-
  covers/setting-up-a-monorepo-using-pnpm-workspaces-with-typescript-and-tailwind.png
---

In this article, We're going learn how to set up a monorepo and share multiple configs and dependencies between each package inside one repository. Before, we proceed, we have to understand what a monorepo is and what benefits it brings to the table.

## What is a Monorepo?

A monorepo is a single repository containing multiple distinct projects, with well-defined relationships. It contains different applications or libraries which are somewhat dependent on each other but are logically independent

At this moment in time, the de facto way of developing applications is having a separate repo for each distinct project, library, or team. It is customary for each repository to have a single build artifact and its dedicated build pipeline. Nevertheless, the industry has gradually gravitated away from this practice, primarily for two significant reasons: **ease of code reuse and desire for team autonomy.**

Typically, the common process we reuse code is we publish it as a package to a remote registry like npm. Then, the app dependent on it installs it from the registry as an external dependency and uses the package as it sees fit. However, this approach poses multiple problems.

First, we have to set up package publishing and tooling with the CI environment for the package being shared. But then, we introduce another problem: inconsistent tooling. The shared package will now require its own set of commands for running tests, building, serving, linting, deploying, and so forth. I could go on to provide numerous examples to illustrate how much maintenance overhead and work this will lead to in the long run.

But this is where monorepo's shine. They can drastically enhance this workflow by eliminating the overhead of publishing versioned packages so that it can be used by other internal projects and eliminating the concept of a breaking change when everything is fixed in the same commit. Let's take a quick dive into how to set one up using PNPM workspaces.

## Setup Root Level Project

The first thing that we need to do is set up our root project which will encapsulate and manage all our applications. We can do so by initializing a pnpm project in our desired folder.

```bash
mkdir 'pnpm-monorepo' && cd pnpm-monorepo && pnpm init
```

Now our root project has been initialized, we should be able to add necessary root-level dependencies and dotfile configs that we’ll use across our projects.

### TypeScript

```bash
pnpm add -D typescript
```

We'll start by setting up TypeScript as our initial root-level dependency. Installing it at this level ensures consistency in versioning across all projects. Let's populate our base configuration with the following code:

`tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "skipLibCheck": true,
    "noImplicitAny": false,
    "allowJs": true,
    "noErrorTruncation": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    "declaration": true,
    "composite": true,
    "sourceMap": true,
    "declarationMap": true
  }
}
```

This will serve as the default `tsc` compiler config shared throughout our project. While it might seem daunting due to the multitude of configurable options, [Matt Pocock has written a comprehensive piece](https://www.totaltypescript.com/tsconfig-cheat-sheet) explaining the purpose of each property if you're interested.

Following that, we'll create our `tsconfig.node.json` file which will be extended by our base config. This file serves a [unique purpose](https://github.com/vitejs/vite/issues/11396#issuecomment-1474749697), acting as a workaround for Vite to omit bundling node types to the browser. If you're utilizing a different framework, you could skip creating this file.

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  }
}
```

Now let's look to set up linting and formatting. For these, we'll be using ESLint and Prettier.

### Prettier

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
echo '{"printWidth": 80, "singleQuote": false}' > .prettierrc.json
echo 'dist
node_modules
*/*.yml' > .prettierignore
```

For quality-of-life purposes, let's add a package script to format every project in our codebase.

```bash
pnpm pkg set scripts.format="prettier --write \"./**/*.{js,jsx,ts,tsx,json}\""
```

### ESLint

```bash
pnpm create @eslint/config
```

The ESLint wizard will ask you a set of questions to set up the linter as per your needs. This is the configuration I've chosen for this project.

`.eslint.cjs`

```javascript
module.exports = {
  env: { browser: true, es2021: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  overrides: [
    {
      env: { node: true },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: { sourceType: "script" },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["@typescript-eslint", "react"],
  rules: {},
};
```

By default, ESLint will look for configuration files in all parent folders up to the root directory. We don't want such behavior so we'll set the `root` property to true.

```javascript
module.exports = {
  root: true,
  ...
}
```

Now, let's configure PNPM to use [workspaces](https://pnpm.io/workspaces) by adding a `pnpm-workspace.yaml` file. It serves the purpose of including/excluding directories to be added to our workspace using [glob patterns.](<https://en.wikipedia.org/wiki/Glob_(programming)>)

`pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

The glob pattern here adds all direct subdirs of our specified folders. To add extra projects, we can do so by simply adding the absolute path of the project to our workspace file.

At this point, our repository has been set up to use workspaces. Now, let's proceed to create our individual projects.. Our applications will be housed under the `apps/` folder and the shared projects will created under `packages/.`

## Create a Project

For our applications, I'll be using [Vite](https://vitejs.dev/) to initialize the projects. Now this can be done using any other JS framework like Next.js, Vue.js, Svelte, etc., and will remain still applicable.

First, let's create our `apps` and `packages` directory at the root.

```bash
mkdir apps packages
```

Now, let's init (for this article) our main application by changing our current directory and calling the bash script:

```bash
cd apps
pnpm create vite frontend --template react-ts
cd ../
pnpm install
```

PNPM has a [filtering feature](https://pnpm.io/filtering) that allows you to restrict commands to specific subsets of packages using a filter tag (`--filter`). This will come in handy later on, so let's create one now.

```bash
pnpm -w exec -- pnpm pkg set scripts.frontend="pnpm --filter @monorepo/frontend"
```

PNPM follows a workspace naming convention, assigning child projects the format "`@root-project-name/project-name`". In our case, our root project name is "`monorepo`" so our child project `package.json` name would be "`@monorepo/frontend`". Let's proceed to make this adjustment in our `package.json`.

`/packages/apps/frontend/package.json`

```bash
{
"name": "@monorepo/frontend"
...
}
```

Let's extend our base `tsconfig.json` and `tsconfig.node.json` from our root folder.

`/apps/frontend/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    // "noEmit": true,
    "baseUrl": "."
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Typically, we would enable "`noEmit`" in our config to prevent TypeScript compiler from generating transpiled code, as this task is managed by our bundler, Vite. However, this is not a concern thanks to our base config.

`/apps/frontend/tsconfig.node.json`

```json
{
  "extends": "../../tsconfig.node.json",
  "include": ["vite.config.ts"]
}
```

We're done setting up our main application at this point. If you have any extra dotfile configurations, feel free to extend them too.

## Create Shared Package

Let's create an extra project to share some code across our applications or even other shared packages. The project is going to be built as an external library with declaration files bundled together.

Let's create the project by running these commands from our root directory.

```bash
cd packages
pnpm create vite ui --template react-ts
cd ui/src
rm -rf assets App.tsx App.css ../.eslintrc.*
pnpm -w install
pnpm -w exec -- pnpm pkg set scripts.ui="pnpm --filter @monorepo/ui"
```

> TIP: When executing commands for the root project while working within a child project, you can use the '--workspace-root' flag or its shorthand '-w' to prevent changing directories. For example, 'pnpm -w run frontend dev' will spin up the dev server for our frontend app while within the 'ui' working directory.

Let's change the name of our project to match naming previous naming convention and also extend our `tsconfig.json` and `tsconfig.node.json`.

`/packages/apps/ui/package.json`

```json
{
"name": "@monorepo/ui"
...
}
```

`/packages/apps/ui/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`/packages/apps/ui/tsconfig.node.json`

```json
{
  "extends": "../../tsconfig.node.json",
  "include": ["vite.config.ts"]
}
```

By default, Vite builds our assets in app mode using `index.html` as the entry file. However, we intend to build our app in library mode and expose the `main.ts` file as the entry point for our package. Let's proceed to modify the Vite configuration to accommodate this. Also while we're at it, we'll install a Vite plugin to auto-generate declaration files for our library.

```bash
pnpm -w ui add -D vite-plugin-dts @types/node
```

`/packages/ui/vite.config.ts`

```javascript
import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: { entry: resolve(__dirname, "src/main.ts"), formats: ["es"] },
  },
  plugins: [dts()],
});
```

With all this finally out of the way, let's create an example component.

`/packages/ui/src/components/Button.tsx`

```typescript
import * as React from "react";

type ButtonProps = React.ComponentProps<"button"> & {
  children: React.ReactNode;
};

export const Button = ({ children, ...props }: ButtonProps) => {
  return <button {...props}>{children}</button>;
};
```

Let's now export it out of our main entry file.

`/packages/ui/main.ts`

```typescript
export { Button } from "./components/Button";
```

We'll be finished creating our library once we update the `package.json` file with the entry file and type declarations.

```json
{
 ...,
 "main": "dist/ui.js",
 "types": "dist/src/main.d.ts",
}
```

> NOTE: The output name for 'main' property is based on your application, whereas the type declaration output name is derived from your entry filename.

We now have a basic functional component named `Button` that accepts all possible props a button could have, in addition to a `children` prop for displaying content.

Let's head back to our main application and import our `ui` package. First, we have to install the library under `monorepo/@frontend` using the workspace filter command:

```bash
pnpm -w frontend add @monorepo/ui
```

> NOTE: By default, when we try to install a package, pnpm will always try to link the package from our workspace based on the declared range. This wasn't always the case before; if the range wasn't matched, it would install the package from the npm registry. With the "`workspace:`" protocol, pnpm will refuse to resolve to anything other than a local workspace package.

Inside the `@frontend` application, our `package.json` should look similar to this:

```json
{
...
"dependencies": {
    "@monorepo/ui": "workspace:^",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
...
}
```

Lastly, let's build our `@ui` library. We can't import anything if there's no output artifact to begin with.

```bash
pnpm -w ui build
```

That's it, now we should be able to import our components or whatever is exported from the `ui` package.

If you remember, we created a button component in the `ui` package. Let's render that button inside our `frontend` application:

`/apps/frontend/src/App.tsx`

```typescript
import { Button } from "@monorepo/ui";

const App = () => {
  return (
    <Button
      style={{
        backgroundColor: "blue",
        padding: "10px",
      }}
    >
      Hello World
    </Button>
  );
};
export default App;
```

If we spin up our dev server and visit our localhost in our browser, we'll see a blue button rendered, saying 'Hello World'."

![](setting-up-a-monorepo-using-pnpm-workspaces-with-typescript-and-tailwind/content/95337788.png)

## Dev Mode

Everything works with the current setup but it's highly inefficient. There are currently two problems:

1. We have to manually rebuild our dependency packages each time a change is made to them.
2. We have to restart our server each time when the former is performed.

To address the initial problem, we'll establish a development script to build our `ui` package in watch mode.

`/packages/ui/package.json`

```json
  "scripts": {
    "dev": "vite build --watch",
    ...
  },
```

Additionally, we'll create a root-level script to execute the "`dev`" script across all packages in our workspace recursively, as specified in their package.json.

`/package.json`

```typescript
  "scripts": {
    "dev": "pnpm --recursive --parallel --stream run dev",
    ...
  },
```

> TIP: To selectively run a script for a package and its dependencies only, suffix an ellipsis to the package name (`<package_name>...`) with the `--filter` flag. For instance, if building for production, use: `pnpm --filter @monorepo/frontend... build`. This will build the specified package (`@monorepo/frontend`) and also its dependencies in the workspace.

To fix the second issue, we're going to have to configure an alias in the `vite.config.ts` of the `@frontend` app.

```typescript
export default defineConfig({
  ...,
  resolve: {
    alias: {
      "@monorepo/ui": path.resolve(__dirname, "../../packages/ui/src/main.ts"),
    },
  },
});
```

By adding our `ui` package as an alias, it forces Vite to hot reload whenever the build artifact changes.

## Bonus: Add Tailwind Support

To establish a single source of truth for all Tailwind configurations, we'll create an additional project for this purpose under the "`/packages`" directory.

```typescript
cd packages
mkdir tailwind && cd tailwind && pnpm init
touch tailwind.config.js postcss.config.js
pnpm -D install tailwindcss postcss autoprefixer
```

Update the project name to match previously used naming convention.  
`/packages/tailwind/package.json`

```json
{
"name": "@monorepo/tailwind"
...
}
```

Add the paths to all of our HTML templates, JS components, and any other files that contains Tailwind class names in the `tailwind.config.js` file. In order for Tailwind to generate all of the CSS we need, it needs to know about every single file in our project that contains any Tailwind class names.

`/packages/tailwind/tailwind.config.js`

```typescript
/** @type {import('tailwindcss').Config} */
export default = {
   content: [
    "./index.html",
    "../../packages/**/src/**/*.{html,js,ts,jsx,tsx}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add `tailwindcss` and `autoprefixer` property to our `postcss.config.js` file.

`/packages/tailwind/postcss.config.js`

```typescript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Add `@monorepo/tailwind` package to the `frontend` application

```bash
pnpm -w frontend add -D @monorepo/tailwind
```

Re-export default Tailwind config from `tailwind` package

`/apps/frontend/tailwind.config.js`

```typescript
export * from "@monorepo/tailwind/tailwind.config.js";
```

Re-export default PostCSS config from `tailwind` package

`/apps/frontend/postcss.config.js`

```typescript
export * from "@monorepo/tailwind/postcss.config.js";
```

Add the Tailwind directives to our CSS

`/apps/frontend/src/index.css`

```typescript
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Let's update our button component to use Tailwind class

`/apps/frontend/src/App.tsx`

```typescript
const App = () => {
  return <Button className="bg-yellow-500">Hello World</Button>;
};
```

Without restarting our server, we should see our button background should now be yellow.

![](setting-up-a-monorepo-using-pnpm-workspaces-with-typescript-and-tailwind/content/9c05f282.png)

## Conclusion

And there you have it! We've covered the basics of setting up a monorepo using PNPM workspaces. Additionally, we've explored configuring a project in library mode using Vite and adding Tailwind support. Embracing a monorepo approach changes our perspective on how we organize code, reducing barriers to creating new projects and promoting efficient code sharing.

If you're interested in exploring the finalized code from the blog, here is the [GitHub repo](https://github.com/Armadillidiid/pnpm-monorepo-demo).

Thank you for reading! If you got up to this point, please consider following for more upcoming blogs.
