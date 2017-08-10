import Engine from "../src/index";

let rules = [
  {
    conditions: {
      age: {
        greater: 5,
        less: 70,
      },
    },
    event: {
      type: "remove",
      params: { fields: ["telephone"] },
    },
  },
];

let schema = {
  properties: {
    age: { type: "number" },
    telephone: { type: "string" },
  },
};

let engine = new Engine(rules, schema);

test("age greater 5", () => {
  return engine
    .run({ age: 10 })
    .then(actions =>
      expect(actions).toEqual([
        { type: "remove", params: { fields: ["telephone"] } },
      ])
    );
});

test("age less 5", () => {
  return engine.run({ age: 4 }).then(actions => expect(actions).toEqual([]));
});

test("age less 70 ", () => {
  return engine
    .run({ age: 69 })
    .then(actions =>
      expect(actions).toEqual([
        { type: "remove", params: { fields: ["telephone"] } },
      ])
    );
});

test("age greater 70 ", () => {
  return engine.run({ age: 71 }).then(actions => expect(actions).toEqual([]));
});

test("empty engine creation", () => {
  expect(new Engine()).not.toBeUndefined();
  expect(new Engine(undefined)).not.toBeUndefined();
  expect(new Engine(null)).not.toBeUndefined();
  expect(new Engine([])).not.toBeUndefined();
  expect(new Engine(rules[0])).not.toBeUndefined();
});
