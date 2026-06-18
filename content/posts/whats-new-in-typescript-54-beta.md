---
title: What's New in TypeScript 5.4 Beta
date: "2024-02-08T08:24:47.000Z"
tags:
  - javascript
  - webdev
  - typescript
cover: covers/whats-new-in-typescript-54-beta.png
---

Greetings! [TypeScript 5.4 Beta](https://devblogs.microsoft.com/typescript/announcing-typescript-5-4-beta) just dropped and it presents new exciting features with some bug fixes and QoL changes. Without further delay, let's quickly explore some of these game-changing improvements.

## `Object.groupBy` and `Map.groupBy`

One of the new API changes added in [TypeScript 5.4 Beta](https://devblogs.microsoft.com/typescript/announcing-typescript-5-4-beta) is the declarations for upcoming JavaScript methods: [`Object.groupBy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy) and [`Map.groupBy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy) . These static methods simplify the grouping of items in an array (and iterables such as objects or maps) far easier.

It works by accepting an iterable and a function that classifies which group each element should be placed in. The result of this function is then used to create an object key for each distinct group and adds the original element to an array for every key. Here's an example:

```typescript
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 42 },
  { name: "Charlie", age: 60 },
  { name: "David", age: 30 },
  // ... more people
];

// Group people by age range
const ageGroups = Object.groupBy(people, (person) => {
  if (person.age < 30) return "young";
  else if (person.age >= 30 && person.age < 60) return "adult";
  else return "senior";
});
```

The result of the above is well equivalent to this:

```typescript
const people = {
  young: [
    { name: "Alice", age: 25 },
    { name: "David", age: 30 },
  ],
  adult: [{ name: "Bob", age: 42 }],
  senior: [{ name: "Charlie", age: 60 }],
};
```

And this can be done with other iterables such as arrays or maps.

For `Map.groupBy`, it performs equivalently to `Object.groupBy`, but instead produces a map as output rather than a plain object.

```typescript
const fruits = ["apple", "banana", "orange", "kiwi"];

// Group fruits by their first letter
const letterGroups = Map.groupBy(fruits, (fruit) => fruit.charAt(0));

// Resulting map:
// Map {
//   'a' => ['apple'],
//   'b' => ['banana'],
//   'o' => ['orange'],
//   'k' => ['kiwi']
// }
```

A good thing to note is the objects produced end up as a `Parital` record as there's no concrete way for the compiler to ensure all keys were created. To access variables, you'll have to use an optional chaining operator or check for `undefined`.

```typescript
type AgeGroup = Partial<Record<"young" | "adult" | "senior", { name: string; age: number }[]>>;

ageGroups?.young; // OK
ageGroups.young && ageGroups.young[0].age; // OK
ageGroups.young[0].age; // Error: Object is possibly 'undefined'
```

This static method is yet to be included in the standard as it's a pending [TC39 proposal](https://github.com/tc39/proposal-array-grouping). However, it's in stage 4, indicating that it will be included in the next stable release, `ES2024`. To use these methods currently, you have to change your target and lib to `ESNext` in your `tsconfig` settings.

## `NoInfer` Utility Type

For a long time, there have been situations where you have a generic function with multiple arguments or properties of the same type parameter, but don't want to infer all the types to the generic value. This utility type precisely addresses this issue, providing more control over which types get inferred.

Let's consider a function that receives a list of values, such as fruits in this example, along with a default value.

```typescript
declare function getValue<T>(values: T[], defaultValue: T): T;

// Example: Without NoInfer<T>
const result = getValue(["apple", "lemon"], "apple"); // OK
```

For this example, TypeScript infers the type of result as `"apple" | "lemon"` as it should be. But what if we changed our default value to something very different?

```typescript
const result = getValue(["apple", "lemon"], "bomb"); // Also OK
```

Currently, the inferred result is `"apple" | "lemon" | "bomb."` But you may wonder, why is that the case? Isn't our `"values"` parameter intended to be our source of truth, allowing us to choose an initial value exclusively from there? Indeed, it should be, but a subtle nuance exists. As both share the same generic type, `"bomb"` is regarded as a valid inference candidate, akin to the list of values. In simpler terms, TypeScript will infer the values of `defaultValue` into the union of fruits `T`.

One common approach that comes to mind to address this is to add a distinct type parameter that extends our intended type parameter.

```typescript
declare function getValue<const T, U extends T>(values: T[], defaultValue: U): T;

const result = getValue(["apple", "lemon"], "bomb");
// Error: Argument of type "bomb" is not assignable to parameter of type ("apple" | "lemon")
```

This also works but it's a bit more verbose and generic `D` most likely won't be used anywhere else in the signature.

This is where the new utility type `NoInfer` comes in. By surrounding our type in `NoInfer<...>` , TypeScript will skip to adding the type parameter as a candidate for type inference.

```typescript
declare function getValue<const T>(values: T[], defaultValue: NoInfer<T>): T;

// Example: With NoInfer<T>
const result = getValue(["apple", "lemon"], "bomb");
// Error: Argument of type "bomb" is not assignable to parameter of type ("apple" | "lemon")
```

By excluding the `defaultValue` type, we ensure that whatever is inputted isn't included in the union of values returned or inferred by our function.

Now previously before this utility type was officially introduced, the community had created a workaround type to combat this issue.

```typescript
type NoInfer<T> = T & { [K in keyof T]: T[K] };
```

Albeit it is less efficient in terms of performance compared to the built-in utility type we have today, mainly because of complex types that require deep exploration by TypeScript to find inference candidates. Here is a reference to the [GitHub issue](https://github.com/microsoft/TypeScript/issues/14829) that prompted this change.

## Wrap up

To conclude, TypeScript 5.4 Beta introduces substantial improvements, one of which I forgot to mention; [preserved narrowing in closures](https://devblogs.microsoft.com/typescript/announcing-typescript-5-4-beta/#preserved-narrowing-in-closures-following-last-assignments). This allows for a more accurate narrowing of types within functions, addressing a common pain point in type-checking. This is just one among several noteworthy changes introduced. For a more comprehensive overview, refer to the [official release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-4-beta).

I hope you found this post useful. If you did, please give it a like. 🙂
