import conditionsMeet from "../src/conditionsMeet";

test("sanity checkField", function() {
  expect(() => conditionsMeet("empty", {})).toThrow();
  expect(() => conditionsMeet({}, 0)).toThrow();
});

test("single line", () => {
  let condition = {
    firstName: "empty",
  };
  expect(conditionsMeet(condition, {})).toBeTruthy();
  expect(conditionsMeet(condition, { firstName: "some" })).toBeFalsy();
  expect(conditionsMeet(condition, { firstName: "" })).toBeTruthy();
  expect(conditionsMeet(condition, { firstName: undefined })).toBeTruthy();
});

test("default use and", () => {
  let condition = {
    firstName: {
      equal: "Will",
    },
    lastName: {
      equal: "Smith",
    },
  };
  expect(conditionsMeet(condition, { firstName: "Will" })).toBeFalsy();
  expect(conditionsMeet(condition, { lastName: "Smith" })).toBeFalsy();
  expect(
    conditionsMeet(condition, { firstName: "Will", lastName: "Smith" })
  ).toBeTruthy();
});

test("NOT condition", () => {
  let condition = {
    not: {
      firstName: {
        equal: "Will",
      },
    },
  };
  expect(conditionsMeet(condition, { firstName: "Will" })).toBeFalsy();
  expect(conditionsMeet(condition, { firstName: "Smith" })).toBeTruthy();
  expect(
    conditionsMeet(condition, { firstName: "Will", lastName: "Smith" })
  ).toBeFalsy();
});
