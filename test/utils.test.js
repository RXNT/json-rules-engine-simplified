import { flatMap, isObject, isDevelopment, toError } from "../src/utils";

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
