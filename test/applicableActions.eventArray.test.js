import applicableActions from "../src/applicableActions";

let rules = [
  {
    conditions: {
      address: "empty",
    },
    event: [{ type: "remove" }, { type: "add" }],
  },
];

test("check nested fields work", function() {
  expect(applicableActions(rules, {})).toEqual([
    { type: "remove" },
    { type: "add" },
  ]);
  expect(applicableActions(rules, { address: { line: "some" } })).toEqual([]);
});
