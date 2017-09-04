import { isObject, toError } from "./utils";
import checkField from "./checkField";
import { OR, AND, NOT } from "./constants";
import selectn from "selectn";

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
        return (
          refVal.some(val => conditionsMeet(refCondition, val)) ||
          checkField(refVal, refCondition)
        );
      } else {
        return checkField(refVal, refCondition);
      }
    }
  });
}
