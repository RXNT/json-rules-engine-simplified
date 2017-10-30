import selectn from "selectn";

export function selectRef(field, formData) {
  let ref = field.replace(/\$/g, ".");
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
    ref.substr(2).split("/");
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
  if (isRefArray(field, schema)) {
    return fetchSchema(schema.properties[field].items["$ref"], schema);
  } else if (schema.properties[field] && schema.properties[field]["$ref"]) {
    return fetchSchema(schema.properties[field]["$ref"], schema);
  } else if (
    schema.properties[field] &&
    schema.properties[field].type === "object"
  ) {
    return schema.properties[field];
  } else {
    toError(`${field} has no $ref field ref schema extraction is impossible`);
    return undefined;
  }
}

const concat = (x, y) => x.concat(y);
export const flatMap = (xs, f) => xs.map(f).reduce(concat, []);
