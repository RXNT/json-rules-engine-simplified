# json-rules-engine-simplified
A simple rules engine expressed in JSON

The primary goal of this project is to be 
an alternative of [json-rules-engine](https://github.com/CacheControl/json-rules-engine) for [react-jsonschema-form-conditionals](https://github.com/RxNT/react-jsonschema-form-conditionals),
as such it has similar interface and configuration, but simplified predicate language, similar to SQL. 

## Features

- Optional schema and rules validation
- Basic boolean operations (`and` `or` and `not`) that allow to have any arbitrary complexity 
- Rules expressed in simple, easy to read JSON 
- Declarative conditional logic with [predicates](https://github.com/landau/predicate)
- Support of nested structures with [selectn](https://github.com/wilmoore/selectn.js) 
including composite arrays 
- Secure - no use of eval()

## Installation

Install `json-rules-engine-simplified` by running:

```bash
npm install --s json-rules-engine-simplified
```

## Usage

The simplest example of using `json-rules-engine-simplified`

```jsx
import { Engine } from 'json-rules-engine-simplified'

let rules = [{
    conditions: {
      firstName: "empty"
    },
    event: {
        type: "remove",
        params: { 
            fields: [ "password" ]
        },
    }
}];

/**
 * Setup a new engine
 */
let engine = new Engine(rules);

let formData = {
  lastName: "Smit"
}

// Run the engine to evaluate
engine
  .run(formData)
  .then(events => { // run() returns remove event
    events.map(event => console.log(event.type));
  })

```

## Schema and rules validation on construction

In order to prevent most common errors, `Engine` does initial validation on the schema, during construction.
If no `schema` is provided to the constructor 


## Conditional logic

Conditional logic is based on public [predicate](https://github.com/landau/predicate) library 
with boolean logic extension. 

[Predicate](https://github.com/landau/predicate) library has a lot of predicates that we found more, than sufficient for our use cases.

### Single line conditionals

Let's say we need to `remove` `password`, when `firstName` is missing, this can be expressed like this:

```js
let rules = [{
    conditions: {
      firstName: "empty"
    },
    event: {
        type: "remove",
        params: { fields: [ "password" ] },
    }
}]
```

This translates into -
when `firstName` is `empty`, perform `remove` of `password`, pretty straightforward. 

`Empty` keyword is [equal in predicate library](https://landau.github.io/predicate/#equal) and required 
action will be performed only when `predicate.empty(registration.firstName)` is `true`. 

### Conditionals with arguments

Let's say we need to `remove` `telephone`, when `age` is `less` than `5`  

```js
let rules = [{
    conditions: { age: { less : 5 } },
    event: {
      type: "remove",
      params: { fields: [ "telephone" ] }
    }
}]
```

This translates into -  
when `age` is `less` than 5, `remove` `telephone` field from the schema.

[Less](https://landau.github.io/predicate/#less) keyword is [less in predicate](https://landau.github.io/predicate/#less) and required 
event will be returned only when `predicate.empty(registration.age, 5)` is `true`. 

### Boolean operations on a single field

#### AND

For the field AND is a default behavior.

Looking at previous rule, we decide that we want to change the rule and `remove` a `telephone`, 
when `age` is between `5` and `70`, so it would be available only to people older, than `70` and younger than `5`.

```js
let rules = [{
    conditions: {
        age: {
          greater: 5,
          less : 70,
        }
    },
    event: {
      type: "remove",
      params: { fields: [ "telephone" ] }
    }
}]
```

By default action will be applied only when both field conditions are true.
In this case, when age is `greater` than 5 and `less` than 70.
 
#### NOT

Let's say we want to change the logic to opposite, and remove telephone when 
age is greater, `less`er then `5` or `greater` than `70`, 
 
```js
let rules = [{
  conditions: {
    age: {
      not: {
          greater: 5,
          less : 70,
      }
    }
  },
  event: {
    type: "remove",
    params: { fields: "telephone"}
  }
}]
```

This does it, since the final result will be opposite of the previous result.
 
#### OR

The previous example works, but it's a bit hard to understand, luckily we can express it in more natural way
with `or` conditional.

```js
let rules = [{
  conditions: { age: { 
      or: [
        { less : 5 },
        { greater: 70 }
      ]
    }
  },
  event: {
    type: "remove",
    params: { fields: "telephone" }
  }
}]
```

This is the same as `NOT`, but easier to grasp.

### Boolean operations on multi fields

To support cases, when action depends on more, than one field meeting criteria we introduced
multi fields boolean operations.

#### Default AND operation

Let's say we want to `require` `bio`, when `age` is less than 70 and `country` is `USA`

```js
let rules = [{
  conditions: {
    age: { less : 70 },
    country: { is: "USA" }
  },
  event: { 
    type: "require",
    params: { fields: [ "bio" ]}
  }
}]
```

This is the way we can express this. By default each field is treated as a 
separate condition and all conditions must be meet.

#### OR

In addition to previous rule we need `bio`, if `state` is `NY`.

```js
let rules = [{
  conditions: {
    or: [
      {
        age: { less : 70 },
        country: { is: "USA" }
      },
      {
        state: { is: "NY"}
      }
    ]
  },
  event: { 
    type: "require",
    params: { fields: [ "bio" ]}
  }
}]
```

#### NOT

When we don't require `bio` we need `zip` code.

```js
let rules = [{
    conditions: {
      not: {
        or: [
          {
            age: { less : 70 },
            country: { is: "USA" }
          },
          {
            state: { is: "NY"}
          }
        ]
      }
    },
    event: { 
      type: "require",
      params: { fields: [ "zip" ]}
    }
}]
```

### Nested object queries

Sometimes we need to make changes to the form if some nested condition is true. 

For example if one of the `hobbies` is "baseball", make `state` `required`.
This can be expressed like this:

```js
let rules = [{
    conditions: {
      hobbies: {
        name: { equals: "baseball" },
      }
    },
    event: { 
      type: "require",
      params: { fields: [ "state" ]}
    }
}]
``` 

## Contribute

- Issue Tracker: github.com/RxNT/json-rules-engine-simplified/issues
- Source Code: github.com/RxNT/json-rules-engine-simplified

## Support

If you are having issues, please let us know.
We have a mailing list located at: ...

## License

The project is licensed under the ... license.

