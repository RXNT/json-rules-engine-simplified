import applicableActions from "../src/applicableActions";

test("check nested fields work", function() {
  let rules = [
    {
      conditions: { address: "empty" },
      event: [{ type: "remove" }, { type: "add" }],
    },
  ];
  expect(applicableActions(rules, {})).toEqual([
    { type: "remove" },
    { type: "add" },
  ]);
  expect(applicableActions(rules, { address: { line: "some" } })).toEqual([]);
});

test("check fields of different types", function() {
  let rules = [
    {
      conditions: { address: "empty" },
      event: ["remove", 1],
    },
  ];
  expect(applicableActions(rules, {})).toEqual(["remove", 1]);
  expect(applicableActions(rules, { address: { line: "some" } })).toEqual([]);
});
