import { isObject, toError } from "./utils";
import checkField from "./checkField";
import selectn from "selectn";

export default function conditionsMeet(conditions, formData) {
  if (!isObject(conditions) || !isObject(formData)) {
    toError(`Rule ${conditions} with ${formData} can't be processed`);
  }
  return Object.keys(conditions).every(conditionKey => {
    if (conditionKey === "or") {
      return conditions[conditionKey].some(sr => conditionsMeet(sr, formData));
    } else if (conditionKey === "and") {
      return conditions[conditionKey].every(sr => conditionsMeet(sr, formData));
    } else {
      let refVal = selectn(conditionKey, formData);
      let refFieldRule = conditions[conditionKey];
      if (Array.isArray(refVal)) {
        return refVal.some(val => conditionsMeet(refFieldRule, val));
      } else {
        return checkField(refVal, refFieldRule);
      }
    }
  });
}
