import { isObject, toError } from "./utils";
import checkField from "./checkField";
import { OR, AND, NOT } from "./constants";
import selectn from "selectn";

export default function conditionsMeet(conditions, formData) {
  if (!isObject(conditions) || !isObject(formData)) {
    toError(`Rule ${conditions} with ${formData} can't be processed`);
  }
  return Object.keys(conditions).every(ref => {
    let refRule = conditions[ref];
    if (ref === OR) {
      return refRule.some(rule => conditionsMeet(rule, formData));
    } else if (ref === AND) {
      return refRule.every(rule => conditionsMeet(rule, formData));
    } else if (ref === NOT) {
      return !conditionsMeet(refRule, formData);
    } else {
      let refVal = selectn(ref, formData);
      if (Array.isArray(refVal)) {
        return refVal.some(val => conditionsMeet(refRule, val));
      } else {
        return checkField(refVal, refRule);
      }
    }
  });
}
