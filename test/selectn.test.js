import selectn from "selectn";

test("selectn on array", function() {
  let a = {
    medications: {
      type: "A",
    },
  };

  expect(selectn("medications.type", a)).toEqual("A");

  // let obj = {
  //   medications: [
  //     { type: "A" },
  //     { type: "B" },
  //     { type: "C" }
  //   ]
  // };
  //expect(selectn("medications.type", obj)).toEqual(["A", "B", "C"]);
});
