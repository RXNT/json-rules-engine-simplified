import Engine from "../../src/Engine";

const ADDRESS_SCHEMA = {
  type: "object",
  properties: {
    zip: { type: "string" },
    city: { type: "string" },
    street: { type: "string" },
    flat: { type: "string" },
  },
};

const SCHEMA = {
  definitions: {
    address: ADDRESS_SCHEMA,
  },
  type: "object",
  properties: {
    homeAddress: {
      $ref: "#/definitions/address",
    },
    workAddress: ADDRESS_SCHEMA,
    favFoodLocations: {
      type: "array",
      items: {
        $ref: "#/definitions/address",
      },
    },
    favoritePlaces: {
      type: "array",
      items: ADDRESS_SCHEMA,
    },
  },
};

let engine = new Engine([], SCHEMA);

test("invalidates ref object", () => {
  expect(() =>
    engine.addRule({
      conditions: {
        "homeAddress.home": { is: "true" },
      },
    })
  ).toThrow();
});

test("invalidates embedded object", () => {
  expect(() =>
    engine.addRule({
      conditions: {
        "workAddress.home": { is: "true" },
      },
    })
  ).toThrow();
});

test("invalidates array object", () => {
  expect(() =>
    engine.addRule({
      conditions: {
        "favFoodLocations.home": { is: "true" },
      },
    })
  ).toThrow();
});

test("invalidates array with $ref object", () => {
  expect(() =>
    engine.addRule({
      conditions: {
        "favoritePlaces.home": { is: "true" },
      },
    })
  ).toThrow();
});

test("Validates ref object", () => {
  expect(
    engine.addRule({
      conditions: {
        "homeAddress.zip": { is: "true" },
      },
    })
  ).toBeUndefined();
});

test("Validates embedded object", () => {
  expect(
    engine.addRule({
      conditions: {
        "workAddress.zip": { is: "true" },
      },
    })
  ).toBeUndefined();
});

test("Validates array object", () => {
  expect(
    engine.addRule({
      conditions: {
        "favFoodLocations.zip": { is: "true" },
      },
    })
  ).toBeUndefined();
});

test("Validates array with $ref object", () => {
  expect(
    engine.addRule({
      conditions: {
        "favoritePlaces.zip": { is: "true" },
      },
    })
  ).toBeUndefined();
});
