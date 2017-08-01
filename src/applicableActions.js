import { flatMap, toArray } from "./utils";
import conditionsMeet from "./conditionsMeet";

export default function applicableActions(rules, formData) {
  return flatMap(rules, ({ conditions, event }) => {
    if (conditionsMeet(conditions, formData)) {
      return toArray(event);
    } else {
      return [];
    }
  });
}
