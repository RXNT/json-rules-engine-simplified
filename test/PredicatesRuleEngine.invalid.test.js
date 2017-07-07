import PredicatesRuleEngine from "../src/PredicatesRuleEngine";
import { testInProd } from "./utils";

let invalidRules = [
  {
    conditions: {
      age: {
        and: {
          greater: 5,
          less: 70,
        },
      },
    },
    event: {
      type: "remove",
      params: {
        fields: ["telephone"],
      },
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

test("initialize with invalid rules", () => {
  expect(() => engine.run({}, invalidRules, schema)).toThrow();
  expect(
    testInProd(() => engine.run({}, invalidRules, schema))
  ).not.toBeUndefined();
});
