import predicate from "predicate";
import {
  flatMap,
  isObject,
  toError,
  isRefArray,
  extractRefSchema,
  normRef,
} from "./utils";
import { OR, AND, NOT } from "./constants";

const UNSUPPORTED_PREDICATES = [
  "and",
  "or",
  "ternary",
  "every",
  "some",
  "curry",
  "partial",
  "complement",
  "mod",
];

export function predicatesFromRule(rule, schema) {
  if (isObject(rule)) {
    return flatMap(Object.keys(rule), p => {
      let comparable = rule[p];
      if (isObject(comparable) || p === NOT) {
        if (p === OR || p === AND) {
          if (Array.isArray(comparable)) {
            return flatMap(comparable, condition =>
              predicatesFromRule(condition, schema)
            );
          } else {
            toError(`"${p}" must be an array`);
            return [];
          }
        } else {
          let predicates = predicatesFromRule(comparable, schema);
          predicates.push(p);
          return predicates;
        }
      } else {
        return predicatesFromRule(p, schema);
      }
    });
  } else {
    return [rule];
  }
}

export function predicatesFromCondition(condition, schema) {
  return flatMap(Object.keys(condition), ref => {
    let refVal = condition[ref];
    ref = normRef(ref);
    if (ref === OR || ref === AND) {
      if (Array.isArray(refVal)) {
        return flatMap(refVal, c => predicatesFromCondition(c, schema));
      } else {
        toError(`${ref} with ${JSON.stringify(refVal)} must be an Array`);
        return [];
      }
    } else if (ref === NOT) {
      return predicatesFromCondition(refVal, schema);
    } else if (ref.indexOf(".") !== -1) {
      let separator = ref.indexOf(".");
      let schemaField = ref.substr(0, separator);
      let subSchema = extractRefSchema(schemaField, schema);

      if (subSchema) {
        let subSchemaField = ref.substr(separator + 1);
        let newCondition = { [subSchemaField]: refVal };
        return predicatesFromCondition(newCondition, subSchema);
      } else {
        toError(`Can't find schema for ${schemaField}`);
        return [];
      }
    } else if (isRefArray(ref, schema)) {
      let refSchema = extractRefSchema(ref, schema);
      return refSchema ? predicatesFromCondition(refVal, refSchema) : [];
    } else if (schema.properties[ref]) {
      return predicatesFromRule(refVal, schema);
    } else {
      toError(`Can't validate ${ref}`);
      return [];
    }
  });
}

export function listAllPredicates(conditions, schema) {
  let allPredicates = flatMap(conditions, condition =>
    predicatesFromCondition(condition, schema)
  );
  return allPredicates.filter((v, i, a) => allPredicates.indexOf(v) === i);
}

export function listInvalidPredicates(conditions, schema) {
  let refPredicates = listAllPredicates(conditions, schema);
  return refPredicates.filter(
    p => UNSUPPORTED_PREDICATES.includes(p) || predicate[p] === undefined
  );
}

export function validatePredicates(conditions, schema) {
  let invalidPredicates = listInvalidPredicates(conditions, schema);
  if (invalidPredicates.length !== 0) {
    toError(`Rule contains invalid predicates ${invalidPredicates}`);
  }
}

export function fieldsFromPredicates(predicate) {
  if (Array.isArray(predicate)) {
    return flatMap(predicate, fieldsFromPredicates);
  } else if (isObject(predicate)) {
    return flatMap(Object.keys(predicate), field => {
      let predicateValue = predicate[field];
      return fieldsFromPredicates(predicateValue);
    });
  } else if (typeof predicate === "string" && predicate.startsWith("$")) {
    return [predicate.substr(1)];
  } else {
    return [];
  }
}

export function fieldsFromCondition(condition) {
  return flatMap(Object.keys(condition), ref => {
    let refCondition = condition[ref];
    if (ref === OR || ref === AND) {
      return flatMap(refCondition, fieldsFromCondition);
    } else if (ref === NOT) {
      return fieldsFromCondition(refCondition);
    } else {
      return [normRef(ref)].concat(fieldsFromPredicates(refCondition));
    }
  });
}

export function listAllFields(conditions) {
  let allFields = flatMap(conditions, fieldsFromCondition);
  return allFields
    .filter(field => field.indexOf(".") === -1)
    .filter((v, i, a) => allFields.indexOf(v) === i);
}

export function listInvalidFields(conditions, schema) {
  let allFields = listAllFields(conditions);
  return allFields.filter(field => schema.properties[field] === undefined);
}

export function validateConditionFields(conditions, schema) {
  let invalidFields = listInvalidFields(conditions, schema);
  if (invalidFields.length !== 0) {
    toError(`Rule contains invalid fields ${invalidFields}`);
  }
}
