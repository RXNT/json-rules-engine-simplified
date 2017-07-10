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
            field: "password"
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

Rules engine expects to know all the rules in advance, it effectively drops builder pattern, but keeps the interface.

## Validation

In order to prevent most common errors, `Engine` does initial validation on the schema, during construction.
Validation is done automatically if you specify `schema` during construction.
 
```js
let rules = [{
    conditions: {
      firstName: "empty"
    },
    event: {
        type: "remove",
        params: { field: "password" },
    }
}];

let schema = {
    properties: {
        firstName: { type: "string" },
        lastName: { type: "string" }
    }
}

let engine = new Engine(rules, schema);
```
### Types of errors

- Conditions field validation (conditions use fields that are not part of the schema)
- Predicate validation (used predicates are not part of the
 [predicates](https://github.com/landau/predicate) library and most likely wrong)

Validation is done only during development, validation is disabled by default in `production`. 

WARNING!!! Currently validation does not support nested structures, so be extra careful, when using those.

## Conditional logic

Conditional logic is based on public [predicate](https://github.com/landau/predicate) library 
with boolean logic extension. 

[Predicate](https://github.com/landau/predicate) library has a lot of predicates that we found more, than sufficient for our use cases.

To showcase conditional logic, we'll be using simple `registration` schema

```js
let schema = {
  definitions: {
    hobby: {
      type: "object",
      properties: {
        name: { type: "string" },
        durationInMonth: { type: "integer" },
      }
    }
  },
  title: "A registration form",
  description: "A simple form example.",
  type: "object",
  required: [
    "firstName",
    "lastName"
  ],
  properties: {
    firstName: {
      type: "string",
      title: "First name"
    },
    lastName: {
      type: "string",
      title: "Last name"
    },
    age: {
      type: "integer",
      title: "Age",
    },
    bio: {
      type: "string",
      title: "Bio",
    },
    country: {
      type: "string",
      title: "Country" 
    },
    state: {
      type: "string",
      title: "State" 
    },
    zip: {
      type: "string",
      title: "ZIP" 
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 3
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10
    },
    work: { "$ref": "#/definitions/hobby" },
    hobbies: {
        type: "array",
        items: { "$ref": "#/definitions/hobby" }
    }
  }
}
```
Assuming action part is taken from [react-jsonschema-form-conditionals](https://github.com/RxNT/react-jsonschema-form-conditionals)

### Single line conditionals

Let's say we want to `remove` `password` , when `firstName` is missing, we can expressed it like this:

```js
let rules = [{
    conditions: {
      firstName: "empty"
    },
    event: {
      type: "remove",
      params: {
        field: "password"
      }
    }
}]
```

This translates into -
when `firstName` is `empty`, trigger `remove` `event`. 

`Empty` keyword is [equal in predicate library](https://landau.github.io/predicate/#equal) and required 
event will be performed only when `predicate.empty(registration.firstName)` is `true`. 

### Conditionals with arguments

Let's say we need to `require` `zip`, when `age` is `less` than `16`,
because the service we are using is legal only after `16` in some countries   

```js
let rules = [{
    conditions: {
      age: { less : 16 }
    },
    event: {
      type: "require",
      params: {
        field: "zip"
      }
    }
}]
```

This translates into -  when `age` is `less` than `16`, `require` zip.

[Less](https://landau.github.io/predicate/#less) keyword is [less in predicate](https://landau.github.io/predicate/#less) and required 
event will be returned only when `predicate.empty(registration.age, 5)` is `true`. 

### Boolean operations on a single field

#### AND

For the field AND is a default behavior.

Looking at previous rule, we decide that we want to change the rule and `require` `zip`, 
when `age` is between `16` and `70`, so it would be available
only to people older, than `16` and younger than `70`.

```js
let rules = [{
    conditions: {
        age: {
          greater: 16,
          less : 70,
        }
    },
    event: {
      type: "require",
      params: {
        field: "zip"
      }
    }
}]
```

By default action will be applied only when both field conditions are true.
In this case, when age is `greater` than `16` and `less` than `70`.
 
#### NOT

Let's say we want to change the logic to opposite, and trigger event only when 
`age` is `less`er then `16` or `greater` than `70`, 
 
```js
let rules = [{
  conditions: {
    age: {
      not: {
          greater: 16,
          less : 70,
      }
    }
  },
  event: {
    type: "require",
    params: {
      field: "zip"
    }
  }
}]
```

This does it, since the final result will be opposite of the previous condition.
 
#### OR

The previous example works, but it's a bit hard to understand, luckily we can express it differently
with `or` conditional.

```js
let rules = [{
  conditions: { age: { 
      or: [
        { lessEq : 5 },
        { greaterEq: 70 }
      ]
    }
  },
  event: {
    type: "require",
    params: {
      field: "zip"
    }
  }
}]
```

The result is the same as `NOT`, but easier to grasp.

### Boolean operations on multi fields

To support cases, when action depends on more, than one field meeting criteria we introduced
multi fields boolean operations.

#### Default AND operation

Let's say, when `age` is less than 70 and `country` is `USA` we want to `require` `bio`.

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

Rules engine supports querying inside nested objects, with [selectn](https://github.com/wilmoore/selectn.js),
any data query that works in [selectn](https://github.com/wilmoore/selectn.js), will work in here

Let's say we need to require `state`, when `work` has a `name` `congressman`, this is how we can do this:

```js
let rules = [{
    conditions: {
      "work.name": { is: "congressman" }
    },
    event: { 
      type: "require",
      params: { fields: [ "state" ]}
    }
}]
```

### Nested arrays object queries

Sometimes we need to make changes to the form if some nested condition is true. 

For example if one of the `hobbies` is `baseball`, we need to make `state` `required`.
This can be expressed like this:

```js
let rules = [{
    conditions: {
      hobbies: {
        name: { is: "baseball" },
      }
    },
    event: { 
      type: "require",
      params: { fields: [ "state" ]}
    }
}]
``` 

Rules engine will go through all the elements in the array and trigger `require` if `any` of the elements meet the criteria.

## License

The project is licensed under the Apache Licence 2.0.