import { validateConditionFields, validatePredicates } from "./validation";
import applicableActions from "./applicableActions";
import { isDevelopment, isObject, toArray, toError } from "./utils";

const validate = schema => {
  let isSchemaDefined = schema !== undefined && schema !== null;
  if (isDevelopment() && isSchemaDefined) {
    if (!isObject(schema)) {
      toError(`Expected valid schema object, but got - ${schema}`);
    }
    return rule => {
      validatePredicates([rule.conditions], schema);
      validateConditionFields([rule.conditions], schema);
    };
  } else {
    return () => {};
  }
};

class Engine {
  constructor(rules, schema) {
    this.rules = [];
    this.validate = validate(schema);

    if (rules) {
      toArray(rules).forEach(rule => this.addRule(rule));
    }
  }
  addRule = rule => {
    this.validate(rule);
    this.rules.push(rule);
  };
  run = formData => Promise.resolve(applicableActions(this.rules, formData));
}

export default Engine;
