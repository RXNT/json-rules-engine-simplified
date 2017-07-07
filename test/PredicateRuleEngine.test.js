import PredicatesRuleEngine from "../src/PredicatesRuleEngine";

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

let engine = PredicatesRuleEngine;

test("age greater 5", () => {
  return engine
    .run({ age: 10 }, rules, schema)
    .then(actions =>
      expect(actions).toEqual([
        { type: "remove", params: { fields: ["telephone"] } },
      ])
    );
});

test("age less 5", () => {
  return engine
    .run({ age: 4 }, rules, schema)
    .then(actions => expect(actions).toEqual([]));
});

test("age less 70 ", () => {
  return engine
    .run({ age: 69 }, rules, schema)
    .then(actions =>
      expect(actions).toEqual([
        { type: "remove", params: { fields: ["telephone"] } },
      ])
    );
});

test("age greater 70 ", () => {
  return engine
    .run({ age: 71 }, rules, schema)
    .then(actions => expect(actions).toEqual([]));
});
