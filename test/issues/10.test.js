import {
  listInvalidPredicates,
  validateConditionFields,
  validatePredicates,
} from "../../src/validation";

let rules = [
  {
    title: "Rule #2",
    description:
      "This hides Address, Email, Gender and the Password fields until First Name and Last Name have a value",
    conditions: {
      and: [
        {
          or: [
            { "registration.firstName": "empty" },
            { "registration.lastName": "empty" },
          ],
        },
      ],
    },
    event: {
      type: "remove",
      params: {
        field: [
          "address",
          "registration.gender",
          "registration.email",
          "registration.password",
          "registration.confirmPassword",
        ],
      },
    },
  },
];

let schema = {
  type: "object",
  properties: {
    registration: {
      type: "object",
      properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        gender: {
          type: "string",
          enum: ["Male", "Female"],
        },
        dob: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        confirmPassword: { type: "string" },
      },
      required: [
        "firstName",
        "lastName",
        "email",
        "password",
        "confirmPassword",
      ],
    },
    address: {
      type: "object",
      properties: {
        streetNo: { type: "string" },
        street: { type: "string" },
        suburb: { type: "string" },
        postCode: { type: "string" },
        state: {
          type: "string",
          enum: ["SA", "WA", "NSW", "VIC", "TAS", "ACT", "QLD", "NT"],
        },
        country: {
          type: "string",
          enum: [],
        },
        propertyDescription: {
          type: "string",
        },
      },
    },
  },
};

test("#10 validation of predicates", () => {
  let conditions = rules.map(({ conditions }) => conditions);
  expect(listInvalidPredicates(conditions, schema)).toEqual([]);
  expect(validatePredicates(conditions, schema)).toBeUndefined();
  expect(validateConditionFields(conditions, schema)).toBeUndefined();
});
