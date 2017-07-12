import {
  flatMap,
  isObject,
  isDevelopment,
  toError,
  extractRefSchema,
  isArray,
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
        $ref: "#/definitions/medications",
      },
    },
  };

  expect(isArray("medications", schema)).toBeTruthy();
  expect(extractRefSchema("medications", schema)).toEqual(
    schema.definitions.medication
  );
});
