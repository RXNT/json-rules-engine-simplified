import checkField from "../src/checkField";

test("single line empty checkField", () => {
  expect(checkField("", "empty")).toBeTruthy();
  expect(checkField(" ", "empty")).toBeFalsy();
});

test("single line NOT empty checkField", () => {
  expect(checkField("", { not: "empty" })).toBeFalsy();
  expect(checkField(" ", { not: "empty" })).toBeTruthy();
});

test("composite with greater", () => {
  expect(checkField(10, { greater: 5 })).toBeTruthy();
  expect(checkField(10, { greater: 15 })).toBeFalsy();
});
test("composite with NOT greater", () => {
  expect(checkField(10, { not: { greater: 5 } })).toBeFalsy();
  expect(checkField(10, { not: { greater: 15 } })).toBeTruthy();
});

test("AND in > 5 && < 12", () => {
  expect(checkField(10, { greater: 5 })).toBeTruthy();
  expect(checkField(10, { less: 12 })).toBeTruthy();
  expect(checkField(10, { greater: 5, less: 12 })).toBeTruthy();
  expect(checkField(15, { greater: 5, less: 12 })).toBeFalsy();
});

test("NOT with AND in ( > 5 && < 12) ", function() {
  expect(checkField(10, { not: { greater: 5 } })).toBeFalsy();
  expect(checkField(10, { not: { less: 12 } })).toBeFalsy();
  expect(checkField(10, { not: { greater: 5, less: 12 } })).toBeFalsy();
  expect(checkField(15, { not: { greater: 5, less: 12 } })).toBeTruthy();
});

test("OR with < 5 || > 12", () => {
  let rule = { or: [{ less: 5 }, { greater: 12 }] };
  expect(checkField(1, rule)).toBeTruthy();
  expect(checkField(8, rule)).toBeFalsy();
  expect(checkField(15, rule)).toBeTruthy();
});

test("or with array", () => {
  let rule = { or: [{ greater: 5, less: 12 }, { greater: 20, less: 30 }] };
  expect(checkField(1, rule)).toBeFalsy();
  expect(checkField(8, rule)).toBeTruthy();
  expect(checkField(15, rule)).toBeFalsy();
  expect(checkField(21, rule)).toBeTruthy();
  expect(checkField(31, rule)).toBeFalsy();
});

test("and with array", () => {
  let rule = { and: [{ greater: 5, less: 12 }, { greater: 10, less: 30 }] };
  expect(checkField(1, rule)).toBeFalsy();
  expect(checkField(8, rule)).toBeFalsy();
  expect(checkField(15, rule)).toBeFalsy();
  expect(checkField(21, rule)).toBeFalsy();
  expect(checkField(31, rule)).toBeFalsy();
  expect(checkField(11, rule)).toBeTruthy();
});

test("NOT empty checkField", () => {
  expect(checkField("", { not: "empty" })).toBeFalsy();
  expect(checkField(" ", { not: "empty" })).toBeTruthy();
});

test("double negation", () => {
  expect(checkField("", { not: { not: "empty" } })).toBeTruthy();
  expect(checkField(" ", { not: { not: "empty" } })).toBeFalsy();
});

test("invalid rule", () => {
  expect(checkField(1, { and: { less: 50, greater: 5 } })).toBeFalsy();
  expect(checkField(10, { and: { less: 50, greater: 5 } })).toBeFalsy();
  expect(checkField(60, { and: { less: 50, greater: 5 } })).toBeFalsy();
  expect(checkField(60, { "&": { less: 50, greater: 5 } })).toBeFalsy();
});

test("check array", () => {
  expect(checkField([1, 2, 3, 4], { less: 50, greater: 5 })).toBeFalsy();
  expect(checkField([1, 2, 3, 4, 5, 6], { less: 50, greater: 5 })).toBeTruthy();

  expect(checkField(["B", "C", "D", "E"], { equal: "A" })).toBeFalsy();
  expect(checkField(["A", "B", "C", "D", "E"], { equal: "A" })).toBeTruthy();
});
