import Engine from "../src/Engine";

let rules = [
  {
    conditions: {
      medications: {
        type: { equal: "D" },
      },
      "primaryMedication.type": { equal: "C" },
    },
    event: {
      type: "remove",
    },
  },
];

let schema = {
  definitions: {
    medications: {
      type: "object",
      properties: {
        type: { type: "string" },
        isLiquid: { type: "boolean" },
      },
    },
  },
  type: "object",
  required: ["medications", "firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    medications: {
      type: "array",
      items: { $ref: "#/definitions/hobby" },
    },
    primaryMedication: {
      $ref: "#/definitions/hobby",
    },
  },
};

test("valid rules", () => {
  expect(new Engine(rules, schema)).not.toBeUndefined();

  let engine = new Engine(rules, schema);
  return engine
    .run({ primaryMedication: { type: "C" }, medications: [{ type: "D" }] })
    .then(event => expect(event.length).toEqual(1));
});
