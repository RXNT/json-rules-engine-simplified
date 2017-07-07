import predicate from "predicate";
import { isObject } from "./utils";

import { OR, AND, NOT } from './constants';

const POSITIVE_PREDICATE = predicate;
const NEGATIVE_PREDICATE = predicate.not;

export default function checkField(
  fieldVal,
  rule,
  predicator = predicate,
) {
  if (Array.isArray(fieldVal)) {
    // Simple rule - like emptyString
    return fieldVal.some(val => checkField(val, rule, predicator));
  } else if (isObject(rule)) {
    // Complicated rule - like { greater then 10 }
    return Object.keys(rule).every(p => {
      let comparable = rule[p];
      if (isObject(comparable) || p === NOT) {
        if (p === OR || p === AND) {
          if (Array.isArray(comparable)) {
            if ( p === OR ) {
              return comparable.some(rule => checkField(fieldVal, rule, predicator));
            } else {
              return comparable.every(rule => checkField(fieldVal, rule, predicator));
            }
          } else {
            return false;
          }
        } else if (p === NOT) {
          let oppositePredicator =
            predicator === NEGATIVE_PREDICATE
              ? POSITIVE_PREDICATE
              : NEGATIVE_PREDICATE;
          return checkField(
            fieldVal,
            comparable,
            oppositePredicator
          );
        } else {
          return false;
        }
      } else {
        return predicator[p](fieldVal, comparable);
      }
    });
  } else {
    return predicator[rule](fieldVal);
  }
}
