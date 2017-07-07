import validate from "./validation";
import applicableActions from "./applicableActions";
import { isDevelopment } from "./utils";

const engine = {
  validate: (rules, schema) => {
    validate(rules.map(({ conditions }) => conditions), schema);
  },
  run: (formData, rules, schema) => {
    if (isDevelopment()) {
      engine.validate(rules, schema);
    }
    return Promise.resolve(applicableActions(rules, formData));
  },
};

export default engine;
