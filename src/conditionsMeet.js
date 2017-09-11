import { isObject, toError } from "./utils";
import checkField from "./checkField";
import { OR, AND, NOT } from "./constants";
import selectn from "selectn";

export function toRelCondition(refCondition, formData) {
  if (Array.isArray(refCondition)) {
    return refCondition.map(cond => toRelCondition(cond, formData));
  } else if (isObject(refCondition)) {
    return Object.keys(refCondition).reduce((agg, field) => {
      agg[field] = toRelCondition(refCondition[field], formData);
      return agg;
    }, {});
  } else if (typeof refCondition === "string" && refCondition.startsWith("$")) {
    return selectn(refCondition.substr(1), formData);
  } else {
    return refCondition;
  }
}

export default function conditionsMeet(condition, formData) {
  if (!isObject(condition) || !isObject(formData)) {
    toError(
      `Rule ${JSON.stringify(condition)} with ${formData} can't be processed`
    );
    return false;
  }
  return Object.keys(condition).every(ref => {
    let refCondition = condition[ref];
    if (ref === OR) {
      return refCondition.some(rule => conditionsMeet(rule, formData));
    } else if (ref === AND) {
      return refCondition.every(rule => conditionsMeet(rule, formData));
    } else if (ref === NOT) {
      return !conditionsMeet(refCondition, formData);
    } else {
      let refVal = selectn(ref, formData);
      if (Array.isArray(refVal)) {
        let condMeatOnce = refVal.some(val =>
          conditionsMeet(refCondition, val)
        );
        return (
          condMeatOnce ||
          checkField(refVal, toRelCondition(refCondition, formData))
        );
      } else {
        return checkField(refVal, toRelCondition(refCondition, formData));
      }
    }
  });
}
