import conditionsMeet from "../src/conditionsMeet";

test("sanity checkField", function() {
  expect(() => conditionsMeet("empty", {})).toThrow();
  expect(() => conditionsMeet({}, 0)).toThrow();
});

test("single line", () => {
  let singleLine = {
    firstName: "empty",
  };
  expect(conditionsMeet(singleLine, {})).toBeTruthy();
  expect(conditionsMeet(singleLine, { firstName: "some" })).toBeFalsy();
  expect(conditionsMeet(singleLine, { firstName: "" })).toBeTruthy();
  expect(conditionsMeet(singleLine, { firstName: undefined })).toBeTruthy();
});

test("default use and", () => {
  let rule = {
    firstName: {
      equal: "Will",
    },
    lastName: {
      equal: "Smith",
    },
  };
  expect(conditionsMeet(rule, { firstName: "Will" })).toBeFalsy();
  expect(conditionsMeet(rule, { lastName: "Smith" })).toBeFalsy();
  expect(
    conditionsMeet(rule, { firstName: "Will", lastName: "Smith" })
  ).toBeTruthy();
});
