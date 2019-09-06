import selectn from "./selectn";

export function normRef(ref) {
  return ref.replace(/\$/g, ".");
}

export function selectRef(field, formData) {
  let ref = normRef(field);
  return selectn(ref, formData);
}

export function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

export function toArray(event) {
  if (Array.isArray(event)) {
    return event;
  } else {
    return [event];
  }
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
  if (ref.startsWith("#/")) {
    return ref
      .substr(2)
      .split("/")
      .reduce((schema, field) => schema[field], schema);
  } else {
    toError(
      "Only local references supported at this point use json-schema-deref"
    );
    return undefined;
  }
}

export function extractRefSchema(field, schema) {
  let { properties } = schema;
  if (!properties || !properties[field]) {
    toError(`${field} not defined in properties`);
    return undefined;
  } else if (properties[field].type === "array") {
    if (isRefArray(field, schema)) {
      return fetchSchema(properties[field].items["$ref"], schema);
    } else {
      return properties[field].items;
    }
  } else if (properties[field] && properties[field]["$ref"]) {
    return fetchSchema(properties[field]["$ref"], schema);
  } else if (properties[field] && properties[field].type === "object") {
    return properties[field];
  } else {
    toError(`${field} has no $ref field ref schema extraction is impossible`);
    return undefined;
  }
}

const concat = (x, y) => x.concat(y);
export const flatMap = (xs, f) => xs.map(f).reduce(concat, []);
