---
title: What are TypeScript Discriminated Unions and Why Should You Care?
date: "2023-11-12T17:51:09.000Z"
tags:
  - typescript
cover: >-
  https://cdn.hashnode.com/res/hashnode/image/upload/v1699799784091/da862bd3-1eaf-448c-b5e4-48f7990561f3.png
---

We've all been in a situation where we want to access a set of properties inside an object based on the value of one property key. This is where discriminated unions shine. But before we dive in, let's refresh our understanding of unions and intersections.

A union is a combination of two or more sets to form a new set that contains all the elements from the original sets. An intersection on the other hand refers to common elements shared by two or more sets.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1699694044773/25fd19b8-b491-44b0-ae24-f082410fb273.png align="center")

With this groundwork, a discriminated union, also known as a tagged union in other programming languages, is a concept that allows us to define a type that can hold values of different subtypes. It might seem like an intersection, but that's not the case. Instead, it's a method of combining various related types into a single type.

We have an object with one essential property called the discriminant which acts as an intersection of the common property within the union.

Let's examine the common pattern developers often use to create a pseudo-discriminated union and understand why it might not be the optimal choice.

## Making Every Property Optional

Using a typical API fetch example, we developers will frequently create a type alias like the one below:

```typescript
type State<T> = {
  data?: T;
  isPending?: boolean;
  isError?: boolean;
  error?: Error;
};

// Examples
const loading: State<string> = {
  isPending: true,
  isError: false,
};

const error: State<string> = {
  isPending: false,
  isError: true,
  error: Error;
};

const success: State<string> = {
  data: "hello",
  isPending: false,
  isError: false,
};
```

At a glance, this might appear acceptable – checking `isLoading` and `isError` to gauge when response data is ready. However, there's a huge drawback.

The problem lies in our ability to define numerous shapes for our object, a scenario that ideally should not be possible. Consider the myriad permutations that could arise:

```typescript
const example: State<string> = {
  data: "hello",
  isPending: true,
  isError: true,
};
```

Here we can access our `data` even when `isPending` and `isError` are true.

```typescript
const example2: State<string> = {
  // data is missing
  isPending: false,
  isError: false,
};
```

and here, `isLoading` and `isError` are both false meaning the API call was a success but our `data` doesn't exist.

This is because we're trying to depict three specific states our fetch could be in, whereas, in reality, it could embody any combination of our properties. The primary aim of optional properties is to characterize an object that may or may not be present.

## Discriminated Unions

A better way to represent the state of our fetch state is by using an intersection of three distinct shapes. Let's create a basic union of objects to showcase it.

```typescript
type State<T> =
  | {
      isPending: false;
      isError: false;
    }
  | {
      isPending: true;
      isError: false;
    }
  | {
      isPending: false;
      isError: true;
    };
```

Our discriminators or discriminant properties are `isLoading` and `isPending`. With this logic set for TypeScript to infer which distinct object we currently want to access, we could now tackle extra properties we want in each state.

```typescript
type State<T> =
  | {
      data: T;
      isPending: false;
      isError: false;
    }
  | {
      data?: T;
      isPending: true;
      isError: false;
    }
  | {
      data?: undefined;
      isPending: false;
      isError: true;
      error: Error;
    };
```

Our `State` type now accurately encapsulates all possible shapes of what we want, which in this instance is an API fetch.

## Components with Varied Props

What if we need a component to accept slightly different props to render some JSX? We could apply the same terms of discriminated states here. I'll be using [React](https://react.dev/), but this could be applied to any JS framework.

```typescript
type ExampleProps =
  | {
      role: "student";
      studentId: number;
      name: string;
      grade: string;
    }
  | {
      role: "admin";
      adminId: number;
      name: string;
      department: string;
    };

const Example = (props: ExampleProps) => {
  ...
};
```

Now when we try to use our component with per se, student as a role. We'll be required to pass in `studentId` and `grade` along with `name` which is the common property between the discriminated union.

```typescript
return (
  <>
    <Example role="student" studentId={3} name="John" grade="A" />;
    <Example role="admin" adminId={69} name="Steve" department="CS" />;
  </>
);
```

This is a big game changer in our we structure our components, but we're not done yet.

## Destructuring Discriminated Unions

If you had gone ahead and tried to destructure the incoming props, you would have run into the following errors for all properties apart from `role` and `name`.

```typescript
const {
  role,
  name,
  studentId, // Property 'studentId' does not exist on type 'ExampleProps'.
  grade, // Property 'grade' does not exist on type 'ExampleProps'.
  adminId, // Property 'adminId' does not exist on type 'ExampleProps'.
  department, // Property 'department' does not exist on type 'ExampleProps'.
} = props;
```

Why am I encountering these errors you might ask? Well, it should be obvious because we haven't tried to discriminate the unions first so TypeScript can't infer which distinct object we're trying to access. The only properties that are available to us are the shared members of the union thus why `role` and `name` doesn't throw an error. Let's correct that then shall we:

To fix this, we'll add a conditional check before we destructure or access our properties.

```typescript
  if (props.role === "admin") {
    const { adminId, name, department } = props;
    return (
      <div>
        {adminId} {name} {department}
      </div>
    );
  }

  if (props.role === "student") {
    // No destructuring
    return (
      <div>
        {props.studentId} {props.name} {props.grade}
      </div>
    );
  }
```

This strictness ensures we can only access properties when the discriminants satisfy an equality expression.

## Summary

Discriminating unions are a powerful type pattern in TypeScript when used properly. They cut through the complexity of optional properties, making it simpler to define what we need. No more conditional acrobatics – just let TypeScript infer the existence of distinct properties with the discriminator, keeping our code free of unexpected runtime errors.
