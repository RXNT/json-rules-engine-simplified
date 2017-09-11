import Engine from "../../src";

test("simple relevant rules work", () => {
  let rules = [
    {
      conditions: {
        a: { less: "$b" },
      },
      event: {
        type: "match",
      },
    },
  ];
  let engine = new Engine(rules);
  return engine.run({ a: 10, b: 11 }).then(events => {
    expect(events.length).toEqual(1);
    expect(events[0]).toEqual({ type: "match" });
  });
});

test("complicated rules work", () => {
  let rules = [
    {
      conditions: {
        a: { or: [{ less: "$b" }] },
      },
      event: {
        type: "match",
      },
    },
  ];
  let engine = new Engine(rules);
  return engine.run({ a: 10, b: 11 }).then(events => {
    expect(events.length).toEqual(1);
    expect(events[0]).toEqual({ type: "match" });
  });
});

test("validation rel fields work", () => {
  let rules = [
    {
      conditions: {
        a: { less: "$b" },
      },
      event: "some",
    },
  ];

  let invSchema = {
    type: "object",
    properties: {
      a: { type: "object" },
    },
  };

  expect(() => new Engine(rules, invSchema)).toThrow();

  let valSchema = {
    type: "object",
    properties: {
      a: { type: "object" },
      b: { type: "number" },
    },
  };

  expect(() => new Engine(rules, valSchema)).not.toBeUndefined();
});
