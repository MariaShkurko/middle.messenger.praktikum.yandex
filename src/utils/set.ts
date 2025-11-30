import type { TIndexed } from "../types/TIndexed";

function isObject(item: unknown): item is TIndexed {
  return item !== null && typeof item === "object" && !Array.isArray(item);
}

function set(object: TIndexed, path: string, value: unknown): TIndexed {
  if (typeof path !== "string") {
    throw new Error("path must be string");
  }

  if (!isObject(object)) {
    return object;
  }

  const keys = path.split(".");
  let current: TIndexed = object;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      if (!isObject(current[key])) {
        current[key] = {};
      }
      current = current[key] as TIndexed;
    }
  }

  return object;
}

export default set;
