import predicate from "predicate";
import Engine from "../src/Engine";

test("equal work with same strings", function() {
  expect(predicate.eq("Will", "Will")).toBeTruthy();
  expect(predicate.eq("Will", "1Will")).toBeFalsy();
});

test("work with empty", function() {
  expect(predicate.empty("")).toBeTruthy();
  expect(predicate.empty(undefined)).toBeTruthy();
  expect(predicate.empty(null)).toBeTruthy();
});

predicate.range = predicate.curry((val, range) => {
  return (
    predicate.num(val) &&
    predicate.array(range) &&
    predicate.equal(range.length, 2) &&
    predicate.greaterEq(val, range[0]) &&
    predicate.lessEq(val, range[1])
  );
});

let engine = new Engine([
  {
    conditions: { age: { range: [20, 40] } },
    event: "hit",
  },
]);

test("not in range left", () => {
  return engine.run({ age: 10 }).then(events => expect(events).toEqual([]));
});

test("in range", () => {
  return engine
    .run({ age: 30 })
    .then(events => expect(events).toEqual(["hit"]));
});

test("not in range right", () => {
  return engine.run({ age: 50 }).then(events => expect(events).toEqual([]));
});
