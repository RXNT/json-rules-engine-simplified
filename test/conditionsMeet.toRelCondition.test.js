import { toRelCondition } from "../src/conditionsMeet";

test("rel simple condition", () => {
  expect(toRelCondition({ less: "$b" }, { b: 11 })).toEqual({ less: 11 });
});

test("rel complicated condition", () => {
  let condition = {
    decreasedByMoreThanPercent: {
      average: "$averages_monthly.cost",
      target: 20,
    },
  };

  let formData = {
    averages_monthly: { cost: 100 },
  };

  let expCondition = {
    decreasedByMoreThanPercent: {
      average: 100,
      target: 20,
    },
  };

  expect(toRelCondition(condition, formData)).toEqual(expCondition);
});

test("work with OR condition", () => {
  let cond = { or: [{ lessEq: "$b" }, { greaterEq: "$c" }] };
  let formData = { b: 16, c: 70 };
  let expCond = { or: [{ lessEq: 16 }, { greaterEq: 70 }] };
  expect(toRelCondition(cond, formData)).toEqual(expCond);
});

test("keep non relevant", () => {
  expect(toRelCondition({ range: [20, 40] }, {})).toEqual({ range: [20, 40] });
});
