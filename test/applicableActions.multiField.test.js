import applicableActions from "../src/applicableActions";

const ACTION = {
  type: "remove",
  params: { fields: ["password"] },
};

const NO_ACTION = [];


test("OR works", () => {
  let orRules = [
    {
      conditions: { or: [{ firstName: "empty" }, { nickName: { is: "admin" } }] },
      event: ACTION,
    },
  ];

  expect(applicableActions(orRules, {})).toEqual([ACTION]);
  expect(applicableActions(orRules, { firstName: "Steve", nickName: "admin" })).toEqual([ACTION]);
  expect(applicableActions(orRules, { firstName: "some" })).toEqual(NO_ACTION);
  expect(applicableActions(orRules, { firstName: "Steve", nickName: "Wonder" })).toEqual(NO_ACTION);
});


test("AND works", () => {
  let andRules = [
    {
      conditions: {
        and: [
          { or: [{ firstName: "empty" }, { nickName: { is: "admin" } }] },
          { age: { is: 21 } },
        ],
      },
      event: ACTION,
    },
  ];

  expect(applicableActions(andRules, {})).toEqual(NO_ACTION);
  expect(applicableActions(andRules, { age: 21 })).toEqual([ACTION]);
  expect(applicableActions(andRules, { firstName: "some" })).toEqual(NO_ACTION);
  expect(
    applicableActions(andRules, { firstName: "Steve", nickName: "Wonder" })
  ).toEqual(NO_ACTION);
  expect(
    applicableActions(andRules, { firstName: "Steve", nickName: "admin" })
  ).toEqual(NO_ACTION);
  expect(
    applicableActions(andRules, { firstName: "Steve", nickName: "admin", age: 21 })
  ).toEqual([ACTION]);
});
