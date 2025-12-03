type PlainObject<T = unknown> = {
  [k: string]: T;
};
type Primitive = string | number | boolean | null | undefined | symbol | bigint;
type DeepComparable = PlainObject | unknown[] | Primitive;

function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === "object" &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is unknown[] | PlainObject {
  return isPlainObject(value) || isArray(value);
}

function isEqual(lhs: DeepComparable, rhs: DeepComparable): boolean {
  // сравнение примитивов
  if (!isArrayOrObject(lhs) && !isArrayOrObject(rhs)) {
    if (typeof lhs !== typeof rhs) {
      return false;
    }
    return lhs === rhs;
  }

  // сравнение массивов
  if (isArray(lhs) && isArray(rhs)) {
    if (lhs.length !== rhs.length) return false;
    for (let i = 0; i < lhs.length; i++) {
      if (!isEqual(lhs[i] as DeepComparable, rhs[i] as DeepComparable)) return false;
    }
    return true;
  }

  if (isPlainObject(lhs) && isPlainObject(rhs)) {
    const lhsKeys = Object.keys(lhs);
    const rhsKeys = Object.keys(rhs);
    if (lhsKeys.length !== rhsKeys.length) return false;

    for (const key of lhsKeys) {
      if (!(key in rhs)) return false;
      if (!isEqual(lhs[key] as DeepComparable, rhs[key] as DeepComparable)) return false;
    }
    return true;
  }

  return false;
}

export default isEqual;
