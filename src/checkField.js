import predicate from "predicate";
import { isObject } from "./utils";

const POSITIVE_PREDICATE = predicate;
const NEGATIVE_PREDICATE = predicate.not;

export default function checkField(
  fieldVal,
  rule,
  predicator = predicate,
  condition = Array.prototype.every
) {
  if (isObject(rule)) {
    // Complicated rule - like { greater then 10 }
    return condition.call(Object.keys(rule), p => {
      let comparable = rule[p];
      if (isObject(comparable) || p === "not") {
        if (p === "or") {
          return comparable.some(condition =>
            checkField(fieldVal, condition, predicator, Array.prototype.every)
          );
        } else if (p === "not") {
          let oppositePredicator =
            predicator === NEGATIVE_PREDICATE
              ? POSITIVE_PREDICATE
              : NEGATIVE_PREDICATE;
          return checkField(
            fieldVal,
            comparable,
            oppositePredicator,
            Array.prototype.every
          );
        } else {
          return false;
        }
      } else {
        return predicator[p](fieldVal, comparable);
      }
    });
  } else if (Array.isArray(fieldVal)) {
    // Simple rule - like emptyString
    return fieldVal.some(val => predicator[rule](val));
  } else {
    return predicator[rule](fieldVal);
  }
}
