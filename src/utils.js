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

export function isArray(field, schema) {
  return schema.properties[field] && schema.properties[field].type === "array";
}

export function extractRefSchema(field, schema) {
  if (isArray(field, schema)) {
    let relevantSchema =
      schema.properties[field].items && schema.properties[field].items["$ref"]
        ? schema.properties[field].items["$ref"].split("/")
        : [];
    return relevantSchema
      .filter(ref => ref !== "#")
      .reduce((schema, field) => schema[field], schema);
  }
  return undefined;
}

const concat = (x, y) => x.concat(y);
export const flatMap = (xs, f) => xs.map(f).reduce(concat, []);
