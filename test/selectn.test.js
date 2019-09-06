import selectn from "../src/selectn";

test("selectn", function() {
  let a = {
    medications: {
      type: "A",
      fn: () => "B",
    },
  };

  expect(selectn("medications.type", a)).toEqual("A");
  expect(selectn("medications.fn", a)).toEqual("B");
  expect(selectn("", a)).toEqual(undefined);
});
