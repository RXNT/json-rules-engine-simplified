import Engine from "../../src";

let rules = [
  {
    conditions: {
      "arr[1].foo": { equal: true },
    },
    event: "some",
  },
  {
    conditions: {
      "arr[0].foo": { equal: true },
    },
    event: "what",
  },
];
let engine = new Engine(rules);

test("support array element reference first true", () => {
  return engine.run({ arr: [{ foo: true }, { foo: false }] }).then(events => {
    expect(events).toEqual(["what"]);
  });
});

test("support array element reference second true", () => {
  return engine.run({ arr: [{ foo: false }, { foo: true }] }).then(events => {
    expect(events).toEqual(["some"]);
  });
});

test("support array element both true", () => {
  return engine.run({ arr: [{ foo: true }, { foo: true }] }).then(events => {
    expect(events).toEqual(["some", "what"]);
  });
});

test("support array element both false", () => {
  return engine.run({ arr: [{ foo: false }, { foo: false }] }).then(events => {
    expect(events).toEqual([]);
  });
});
