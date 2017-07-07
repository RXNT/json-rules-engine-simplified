import { flatMap } from "./utils";
import conditionsMeet from "./conditionsMeet";

export default function applicableActions(rules, formData) {
  return flatMap(rules, ({ conditions, event }) => {
    if (conditionsMeet(conditions, formData)) {
      return [event];
    } else {
      return [];
    }
  });
}
