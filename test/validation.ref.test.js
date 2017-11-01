import { predicatesFromCondition } from "../src/validation";
import { testInProd } from "./utils";

let schema = {
  definitions: {
    medication: {
      type: "object",
      properties: {
        type: { type: "string" },
        isLiquid: { type: "boolean" },
      },
    },
  },
  type: "object",
  required: ["medications", "firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    medications: {
      type: "array",
      items: { $ref: "#/definitions/medication" },
    },
    primaryMedication: {
      $ref: "#/definitions/medication",
    },
    externalConfig: {
      $ref: "http://example.com/oneschema.json",
    },
    invalidArrayRef: {
      type: "array",
      items: {
        $ref: "http://example.com/oneschema.json",
      },
    },
  },
};

test("condition with external ref", () => {
  expect(() =>
    predicatesFromCondition({ "externalConfig.name": "empty" }, schema)
  ).toThrow();
  expect(
    testInProd(() =>
      predicatesFromCondition({ "externalConfig.name": "empty" }, schema)
    )
  ).toEqual([]);
});

test("array condition with external ref", () => {
  expect(() =>
    predicatesFromCondition({ "invalidArrayRef.name": "empty" }, schema)
  ).toThrow();
  expect(
    testInProd(() =>
      predicatesFromCondition({ "invalidArrayRef.name": "empty" }, schema)
    )
  ).toEqual([]);
});

test("condition with fake ref field", () => {
  expect(() =>
    predicatesFromCondition({ "fakeRef.name": "empty" }, schema)
  ).toThrow();
  expect(
    testInProd(() =>
      predicatesFromCondition({ "fakeRef.name": "empty" }, schema)
    )
  ).toEqual([]);
});

test("condition with fake field", () => {
  expect(() => predicatesFromCondition({ fakeRef: "empty" }, schema)).toThrow();
  expect(
    testInProd(() => predicatesFromCondition({ fakeRef: "empty" }, schema))
  ).toEqual([]);
});
