import predicate from "predicate";
import { isObject } from "./utils";

import { OR, AND, NOT } from "./constants";

const parseObjectRule = (rule, fieldVal) => {
  return Object.keys(rule).every(p => {
    let subRule = rule[p];
    if (p === OR || p === AND) {
      if (Array.isArray(subRule)) {
        if (p === OR) {
          return subRule.some(rule => checkField(fieldVal, rule));
        } else {
          return subRule.every(rule => checkField(fieldVal, rule));
        }
      } else {
        return false;
      }
    } else if (p === NOT) {
      return !checkField(fieldVal, subRule);
    } else if (predicate[p]) {
      return predicate[p](fieldVal, subRule);
    } else {
      return false;
    }
  });
};

export default function checkField(fieldVal, rule) {
  if (Array.isArray(fieldVal)) {
    return isObject(rule)
      ? fieldVal.some(val => checkField(val, rule)) || parseObjectRule(rule)
      : fieldVal.some(val => checkField(val, rule)) ||
        predicate[rule](fieldVal);
  } else if (isObject(rule)) {
    // Complicated rule - like { greater then 10 }
    return parseObjectRule(rule, fieldVal);
  } else {
    return predicate[rule](fieldVal);
  }
}
