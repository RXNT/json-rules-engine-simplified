import predicate from "predicate";
import { flatMap, isObject, toError } from "./utils";

import { NOT, AND, OR } from './checkField';

export function predicatesFromRule(rule) {
  if (isObject(rule)) {
    return flatMap(Object.keys(rule), p => {
      let comparable = rule[p];
      if (isObject(comparable) || p === NOT) {
        if (p === OR || p === AND) {
          if (Array.isArray(comparable)) {
            return flatMap(comparable, condition => predicatesFromRule(condition));
          } else {
            toError(`"${p}" must be an array`);
            return [];
          }
        } else {
          let predicates = predicatesFromRule(comparable);
          predicates.push(p);
          return predicates;
        }
      } else {
        return predicatesFromRule(p);
      }
    });
  } else {
    return [rule];
  }
}

export function predicatesFromCondition(condition) {
  return flatMap(Object.keys(condition), ref => {
    if (ref === OR || ref === AND) {
      return flatMap(condition[ref], w => predicatesFromRule(w));
    } else {
      return predicatesFromRule(condition[ref]);
    }
  });
}

export function listAllPredicates(conditions) {
  let allPredicates = flatMap(conditions, condition =>
    predicatesFromCondition(condition)
  );
  return new Set(allPredicates);
}

export function listInvalidPredicates(rules) {
  let rulePredicates = listAllPredicates(rules);
  Object.keys(predicate).forEach(p => rulePredicates.delete(p));
  return Array.from(rulePredicates);
}

export function fieldsFromCondition(condition) {
  return flatMap(Object.keys(condition), ref => {
    if (ref === OR || ref === AND) {
      return flatMap(condition[ref], w => fieldsFromCondition(w));
    } else {
      return [ref];
    }
  });
}

export function listAllFields(conditions) {
  let allFields = flatMap(conditions, condition =>
    fieldsFromCondition(condition)
  );
  return new Set(allFields);
}

export function listInvalidFields(conditions, schema) {
  let ruleFields = listAllFields(conditions);
  Object.keys(schema.properties).forEach(f => ruleFields.delete(f));
  return Array.from(ruleFields);
}

export function validateConditionFields(conditions, schema) {
  let invalidFields = listInvalidFields(conditions, schema);
  if (invalidFields.length !== 0) {
    toError(`Rule contains invalid fields ${invalidFields}`);
  }
}

export function validatePredicates(conditions) {
  let invalidPredicates = listInvalidPredicates(conditions);
  if (invalidPredicates.length !== 0) {
    toError(`Rule contains invalid predicates ${invalidPredicates}`);
  }
}