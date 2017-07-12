export function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

export function toError(message) {
  if (isDevelopment()) {
    throw new ReferenceError(message);
  } else {
    console.error(message);
  }
}

export function isRefArray(field, schema) {
  return (
    schema.properties[field] &&
    schema.properties[field].type === "array" &&
    schema.properties[field].items &&
    schema.properties[field].items["$ref"]
  );
}

function fetchSchema(ref, schema) {
  let relevantSchema = ref.split("/");
  return relevantSchema
    .filter(ref => ref !== "#")
    .reduce((schema, field) => schema[field], schema);
}

export function extractRefSchema(field, schema) {
  if (isRefArray(field, schema)) {
    return fetchSchema(schema.properties[field].items["$ref"], schema);
  } else if (schema.properties[field] && schema.properties[field]["$ref"]) {
    return fetchSchema(schema.properties[field]["$ref"], schema);
  } else {
    return undefined;
  }
}

const concat = (x, y) => x.concat(y);
export const flatMap = (xs, f) => xs.map(f).reduce(concat, []);
