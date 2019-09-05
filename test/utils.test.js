import {
  flatMap,
  isObject,
  isDevelopment,
  toError,
  extractRefSchema,
  isRefArray,
  toArray,
  selectRef,
} from "../src/utils";
import { testInProd } from "./utils";

test("array flatmap", () => {
  expect(flatMap([[1, 2], [3], [4, 5]], x => x)).toEqual([1, 2, 3, 4, 5]);
});

test("isObject", () => {
  expect(isObject(undefined)).toBeFalsy();
  expect(isObject("")).toBeFalsy();
  expect(isObject(null)).toBeFalsy();
  expect(isObject(1)).toBeFalsy();
  expect(isObject({})).toBeTruthy();
});

test("isProduction", () => {
  expect(isDevelopment()).toBeTruthy();
  expect(testInProd(() => isDevelopment())).toBeFalsy();
});

test("error throws exception", () => {
  expect(() => toError("Yes")).toThrow();
  expect(testInProd(() => toError("Yes"))).toBeUndefined();
});

test("extract referenced schema", () => {
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
      registration: {
        type: "object",
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
        },
      },
    },
  };

  let {
    definitions: { medication },
    properties: { registration },
  } = schema;

  expect(isRefArray("medications", schema)).toBeTruthy();
  expect(extractRefSchema("medications", schema)).toEqual(medication);
  expect(extractRefSchema("primaryMedication", schema)).toEqual(medication);
  expect(extractRefSchema("registration", schema)).toEqual(registration);

  expect(() => extractRefSchema("externalConfig", schema)).toThrow();
  expect(
    testInProd(() => extractRefSchema("externalConfig", schema))
  ).toBeUndefined();

  expect(() => extractRefSchema("lastName", schema)).toThrow();
  expect(
    testInProd(() => extractRefSchema("lastName", schema))
  ).toBeUndefined();
});

test("array transformation", () => {
  expect(toArray("Yes")).toEqual(["Yes"]);
  expect(toArray(["Yes", "No"])).toEqual(["Yes", "No"]);
});

test("select reference", () => {
  expect(selectRef("address.zip", { address: { zip: 1000 } })).toEqual(1000);
  expect(selectRef("address$zip", { address: { zip: 1000 } })).toEqual(1000);
});
