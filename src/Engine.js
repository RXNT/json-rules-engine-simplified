import { validatePredicates, validateConditionFields } from "./validation";
import applicableActions from "./applicableActions";
import { isDevelopment, isObject, toError } from "./utils";

class Engine {
  constructor(rules, schema) {
    this.rules = rules;
    if (isDevelopment()) {
      let conditions = rules.map(rule => rule.conditions);
      if (schema !== undefined && schema !== null) {
        if (isObject(schema)) {
          validatePredicates(conditions, schema);
          validateConditionFields(conditions, schema)
        } else {
          toError(`Expected valid schema object, but got - ${schema}`)
        }
      }
    }
  }
  run = (formData) => Promise.resolve(applicableActions(this.rules, formData));
}

export default Engine;
