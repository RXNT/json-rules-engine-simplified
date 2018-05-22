import Engine from "../../../src/index";

let rulesA = [
  {
    conditions: {
      hasBenefitsReference: { is: true },
    },
    event: [
      {
        type: "require",
        params: {
          field: "hasBD2Reference",
        },
      },
      {
        type: "require",
        params: {
          field: "BD2Reference",
        },
      },
    ],
  },
];

let rulesB = [
  {
    conditions: {
      hasBenefitsReference: { is: true },
    },
    event: [
      {
        type: "require",
        params: {
          field: ["hasBD2Reference", "BD2Reference"],
        },
      },
    ],
  },
];

const schema = {
  type: "object",
  properties: {
    hasBenefitsReference: {
      title: "Do you have a Benefits Reference Number?",
      type: "boolean",
    },
    benefitsReference: {
      title: "Benefits Reference Number",
      type: "string",
    },
    hasBD2Reference: {
      title: "Do you have a BD2 Number?",
      type: "boolean",
    },
    BD2Reference: {
      title: "BD2 Number",
      type: "string",
    },
  },
};

test("creation with multi rules A", () => {
  let engine = new Engine(rulesA, schema);

  return engine.run({ hasBenefitsReference: true }).then(events => {
    expect(events.length).toEqual(2);
    expect(events).toEqual(rulesA[0].event);
  });
});

test("creation with no problems B", () => {
  let engine = new Engine(rulesB, schema);

  return engine.run({ hasBenefitsReference: true }).then(events => {
    expect(events.length).toEqual(1);
    expect(events).toEqual(rulesB[0].event);
  });
});
