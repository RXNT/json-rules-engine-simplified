import Engine from "../src/Engine";

let EVENT = {
  type: "remove",
  params: {
    field: "password",
  },
};

let schema = {
  definitions: {
    hobby: {
      type: "object",
      properties: {
        name: { type: "string" },
        durationInMonth: { type: "integer" },
      },
    },
  },
  title: "A registration form",
  description: "A simple form example.",
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
      title: "First name",
    },
    lastName: {
      type: "string",
      title: "Last name",
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
      title: "Country",
    },
    state: {
      type: "string",
      title: "State",
    },
    zip: {
      type: "string",
      title: "ZIP",
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 3,
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10,
    },
    work: { $ref: "#/definitions/hobby" },
    hobbies: {
      type: "array",
      items: { $ref: "#/definitions/hobby" },
    },
  },
};

test("first example", () => {
  let rules = [
    {
      conditions: {
        firstName: "empty",
      },
      event: EVENT,
    },
  ];

  let engine = new Engine(rules, schema);
  expect.assertions(5);

  return Promise.all([
    engine.run({}).then(res => expect(res).toEqual([EVENT])),
    engine.run({ firstName: null }).then(res => expect(res).toEqual([EVENT])),
    engine.run({ firstName: "" }).then(res => expect(res).toEqual([EVENT])),
    engine.run({ firstName: "  " }).then(res => expect(res).toEqual([])),
    engine.run({ firstName: "some" }).then(res => expect(res).toEqual([])),
  ]);
});

test("Conditionals with arguments", () => {
  let rules = [
    {
      conditions: {
        age: { less: 16 },
      },
      event: EVENT,
    },
  ];

  let engine = new Engine(rules, schema);
  expect.assertions(5);

  return Promise.all([
    engine.run({}).then(res => expect(res).toEqual([])),
    engine.run({ age: null }).then(res => expect(res).toEqual([EVENT])),
    engine.run({ age: 15 }).then(res => expect(res).toEqual([EVENT])),
    engine.run({ age: 16 }).then(res => expect(res).toEqual([])),
    engine.run({ age: 21 }).then(res => expect(res).toEqual([])),
  ]);
});

test("AND", () => {
  let rules = [
    {
      conditions: {
        age: {
          greater: 16,
          less: 70,
        },
      },
      event: EVENT,
    },
  ];

  let engine = new Engine(rules, schema);
  expect.assertions(4);

  return Promise.all([
    engine.run({ age: 16 }).then(res => expect(res).toEqual([])),
    engine.run({ age: 17 }).then(res => expect(res).toEqual([EVENT])),
    engine.run({ age: 69 }).then(res => expect(res).toEqual([EVENT])),
    engine.run({ age: 70 }).then(res => expect(res).toEqual([])),
  ]);
});

test("NOT", () => {
  let rules = [
    {
      conditions: {
        age: {
          not: {
            greater: 16,
            less: 70,
          },
        },
      },
      event: EVENT,
    },
  ];

  let engine = new Engine(rules, schema);
  expect.assertions(4);

  return Promise.all([
    engine.run({ age: 16 }).then(res => expect(res).toEqual([EVENT])),
    engine.run({ age: 17 }).then(res => expect(res).toEqual([])),
    engine.run({ age: 69 }).then(res => expect(res).toEqual([])),
    engine.run({ age: 70 }).then(res => expect(res).toEqual([EVENT])),
  ]);
});

test("OR", () => {
  let rules = [
    {
      conditions: {
        age: {
          or: [{ lessEq: 16 }, { greaterEq: 70 }],
        },
      },
      event: EVENT,
    },
  ];

  let engine = new Engine(rules, schema);
  expect.assertions(4);

  return Promise.all([
    engine.run({ age: 16 }).then(res => expect(res).toEqual([EVENT])),
    engine.run({ age: 17 }).then(res => expect(res).toEqual([])),
    engine.run({ age: 69 }).then(res => expect(res).toEqual([])),
    engine.run({ age: 70 }).then(res => expect(res).toEqual([EVENT])),
  ]);
});

/**
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
    "work.name": {
      name: { equals: "congressman" },
    }
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
      name: { equals: "baseball" },
    }
  },
  event: {
    type: "require",
    params: { fields: [ "state" ]}
  }
}]
  ``` 

Rules engine will go through all the elements in the array and trigger `require` if `any` of the elements meet the criteria 

## Support

If you are having issues, please let us know.
We have a mailing list located at: ...

## License

The project is licensed under the Apache Licence 2.0.
 **/
