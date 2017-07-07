const predicate = require("predicate");

test("equal work with same strings", function() {
  expect(predicate.eq("Will", "Will")).toBeTruthy();
  expect(predicate.eq("Will", "1Will")).toBeFalsy();
});

test("work with empty", function() {
  expect(predicate.empty("")).toBeTruthy();
  expect(predicate.empty(undefined)).toBeTruthy();
  expect(predicate.empty(null)).toBeTruthy();
});

test("and is not predicate", () => {
  expect(predicate.and).toBeUndefined();
});
