import applicableActions from "../src/applicableActions";

const REMOVE_PASSWORD = {
  type: "remove",
  params: { fields: ["password"] },
};

const NO_ACTION = [];

let OR = [
  {
    conditions: { or: [{ firstName: "empty" }, { nickName: { is: "admin" } }] },
    event: REMOVE_PASSWORD,
  },
];

test("OR works", () => {
  expect(applicableActions(OR, {})).toEqual([REMOVE_PASSWORD]);
  expect(
    applicableActions(OR, { firstName: "Steve", nickName: "admin" })
  ).toEqual([REMOVE_PASSWORD]);
  expect(applicableActions(OR, { firstName: "some" })).toEqual(NO_ACTION);
  expect(
    applicableActions(OR, { firstName: "Steve", nickName: "Wonder" })
  ).toEqual(NO_ACTION);
});

let AND = [
  {
    conditions: {
      and: [
        { or: [{ firstName: "empty" }, { nickName: { is: "admin" } }] },
        { age: { is: 21 } },
      ],
    },
    event: REMOVE_PASSWORD,
  },
];

test("AND works", () => {
  expect(applicableActions(AND, {})).toEqual(NO_ACTION);
  expect(applicableActions(AND, { age: 21 })).toEqual([REMOVE_PASSWORD]);
  expect(applicableActions(AND, { firstName: "some" })).toEqual(NO_ACTION);
  expect(
    applicableActions(AND, { firstName: "Steve", nickName: "Wonder" })
  ).toEqual(NO_ACTION);
  expect(
    applicableActions(AND, { firstName: "Steve", nickName: "admin" })
  ).toEqual(NO_ACTION);
  expect(
    applicableActions(AND, { firstName: "Steve", nickName: "admin", age: 21 })
  ).toEqual([REMOVE_PASSWORD]);
});
