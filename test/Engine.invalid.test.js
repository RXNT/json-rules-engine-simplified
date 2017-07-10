import Engine from "../src/Engine";
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

test("ignore invalid rules if no schema provided", () => {
  expect(() => new Engine(invalidRules)).not.toThrow();
});

test("ignore empty rules with invalid schema", () => {
  expect(() => new Engine(invalidRules, [])).toThrow();
  expect(() => new Engine(invalidRules, "schema")).toThrow();
});

test("initialize with invalid rules", () => {
  expect(() => new Engine(invalidRules, schema)).toThrow();
  expect(
    testInProd(() => new Engine(invalidRules, schema))
  ).not.toBeUndefined();
});
