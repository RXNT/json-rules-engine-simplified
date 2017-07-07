import { isObject, toError } from "./utils";
import checkField, { OR, AND, NOT} from "./checkField";
import selectn from "selectn";

export default function conditionsMeet(conditions, formData) {
  if (!isObject(conditions) || !isObject(formData)) {
    toError(`Rule ${conditions} with ${formData} can't be processed`);
  }
  return Object.keys(conditions).every(conditionKey => {
    let refFieldRule = conditions[conditionKey];
    if (conditionKey === OR) {
      return refFieldRule.some(sr => conditionsMeet(sr, formData));
    } else if (conditionKey === AND) {
      return refFieldRule.every(sr => conditionsMeet(sr, formData));
    } else if (conditionKey === NOT) {
      return !conditionsMeet(refFieldRule, formData);
    } else {
      let refVal = selectn(conditionKey, formData);
      if (Array.isArray(refVal)) {
        return refVal.some(val => conditionsMeet(refFieldRule, val));
      } else {
        return checkField(refVal, refFieldRule);
      }
    }
  });
}
