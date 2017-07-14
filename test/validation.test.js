import {
  listAllFields,
  listAllPredicates,
  listInvalidFields,
  listInvalidPredicates,
  predicatesFromCondition,
  predicatesFromRule,
  validatePredicates,
  validateConditionFields,
} from "../src/validation";
import { testInProd } from "./utils";

function conditionsFrom(rules) {
  return rules.map(({ conditions }) => conditions);
}

let defSchema = {
  properties: {
    firstName: { type: "string" },
    password: { type: "string" },
    age: { type: "integer" },
  },
};

test("Check predicates", () => {
  const conditions = conditionsFrom([
    { conditions: { firstName: "epty" } },
    { conditions: { age: { greater: 10 } } },
    { conditions: { age: { less: 20 } } },
  ]);

  expect(listAllPredicates(conditions, defSchema)).toEqual([
    "epty",
    "greater",
    "less",
  ]);
  expect(listInvalidPredicates(conditions, defSchema)).toEqual(["epty"]);
});

test("Two field rule ", () => {
  const conditions = conditionsFrom([
    {
      conditions: { firstName: "empty" },
      event: { type: "remove" },
    },
    {
      conditions: { age: { greater: 10 } },
      event: { type: "require" },
    },
    {
      conditions: { age: { less: 20 } },
      event: { type: "hide" },
    },
  ]);

  let predicates = listAllPredicates(conditions, defSchema);
  expect(predicates).toEqual(["empty", "greater", "less"]);

  let fields = listAllFields(conditions);
  expect(fields).toEqual(["firstName", "age"]);
});

test("3 field rule ", () => {
  const conditions = conditionsFrom([
    {
      conditions: { firstName: "empty" },
      event: { type: "remove" },
    },
    {
      conditions: { age: { greater: 10 } },
      event: { type: "require" },
    },
    { conditions: { age: { less: 20 } } },
    {
      conditions: { firstName: "empty" },
      event: { type: "hide" },
    },
  ]);

  let predicates = listAllPredicates(conditions, defSchema);
  expect(predicates).toEqual(["empty", "greater", "less"]);

  let fields = listAllFields(conditions);
  expect(fields).toEqual(["firstName", "age"]);
});

test("invalidate predicates", () => {
  let invalidConditions = conditionsFrom([
    {
      event: { type: "remove" },
      conditions: {
        age: {
          wtf: {
            greater: 5,
            less: 70,
          },
        },
      },
    },
  ]);

  expect(listAllPredicates(invalidConditions, defSchema)).toEqual([
    "greater",
    "less",
    "wtf",
  ]);
  expect(listInvalidPredicates(invalidConditions, defSchema)).toEqual(["wtf"]);
  expect(() => validatePredicates(invalidConditions, defSchema)).toThrow();
  expect(() =>
    testInProd(validatePredicates(invalidConditions, defSchema))
  ).not.toBeUndefined();
});

test("invalid field", () => {
  let invalidFieldConditions = conditionsFrom([
    {
      conditions: { lastName: "empty" },
      event: {
        type: "remove",
      },
    },
    {
      conditions: {
        or: [{ lastName: "empty" }, { firstName: "empty" }],
      },
    },
  ]);

  expect(listAllFields(invalidFieldConditions)).toEqual([
    "lastName",
    "firstName",
  ]);
  expect(listInvalidFields(invalidFieldConditions, defSchema)).toEqual([
    "lastName",
  ]);
  expect(() =>
    validateConditionFields(invalidFieldConditions, defSchema)
  ).toThrow();
});

test("invalid OR", () => {
  let invalidOrConditions = conditionsFrom([
    {
      conditions: {
        or: { firstName: "empty" },
      },
      event: { type: "remove" },
    },
  ]);

  expect(() => validatePredicates(invalidOrConditions, defSchema)).toThrow();
});

test("invalid field or", () => {
  let invalidFieldOr = conditionsFrom([
    {
      conditions: {
        firstName: {
          or: {
            is: 10,
            some: 25,
          },
        },
      },
      event: { type: "remove" },
    },
  ]);

  expect(() => predicatesFromRule(invalidFieldOr[0].firstName)).toThrow();
  expect(
    testInProd(() => predicatesFromRule(invalidFieldOr[0].firstName))
  ).toEqual([]);
  expect(() => validatePredicates(invalidFieldOr, defSchema)).toThrow();
});

test("invalid field NOT or", () => {
  let invalidFieldNotWithOr = conditionsFrom([
    {
      conditions: {
        not: {
          firstName: "or",
        },
      },
      event: { type: "remove" },
    },
  ]);

  expect(() => validatePredicates(invalidFieldNotWithOr, defSchema)).toThrow();
});

test("invalid fields 1", () => {
  let inValidField = conditionsFrom([
    {
      conditions: {
        lastName: "empty",
      },
      event: {
        type: "remove",
      },
    },
  ]);

  expect(listAllFields(inValidField)).toEqual(["lastName"]);
  expect(() => validateConditionFields(inValidField, defSchema)).toThrow();
});

test("valid field or", () => {
  let validFieldOr = conditionsFrom([
    {
      conditions: {
        firstName: {
          or: [{ is: 10 }, { is: 25 }],
        },
      },
      event: {
        type: "remove",
      },
    },
  ]);

  expect(predicatesFromCondition(validFieldOr[0], defSchema)).toEqual([
    "is",
    "is",
  ]);
  expect(validateConditionFields(validFieldOr, defSchema)).toBeUndefined();
});

test("extract predicates from rule when with or & and", () => {
  expect(predicatesFromRule({ or: [{ is: 1 }, { less: 10 }] })).toEqual([
    "is",
    "less",
  ]);
  expect(predicatesFromRule({ and: [{ is: 1 }, { less: 10 }] })).toEqual([
    "is",
    "less",
  ]);
});

test("extract predicates from condition when with or & and", () => {
  let schema = {
    properties: {
      age: { type: "integer" },
      grade: { type: "integer" },
    },
  };

  expect(
    predicatesFromCondition(
      { or: [{ age: { is: 1 } }, { grade: { less: 10 } }] },
      schema
    )
  ).toEqual(["is", "less"]);
  expect(
    predicatesFromCondition(
      { and: [{ age: { is: 1 } }, { grade: { less: 10 } }] },
      schema
    )
  ).toEqual(["is", "less"]);
});
