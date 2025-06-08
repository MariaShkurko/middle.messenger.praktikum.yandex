export default function deepClone<T>(value: T, hash = new WeakMap<object, any>()): T {
  // Примитивы и функции возвращаем как есть
  if (Object(value) !== value || typeof value === 'function') {
    return value;
  }

  // Защита от циклических ссылок
  if (hash.has(value as object)) {
    return hash.get(value as object);
  }

  // Дата
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  // Регулярные выражения
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  // Массив
  if (Array.isArray(value)) {
    const result: unknown[] = [];
    hash.set(value, result);
    value.forEach((item, index) => {
      result[index] = deepClone(item, hash);
    });
    return result as T;
  }

  // Map
  if (value instanceof Map) {
    const result = new Map();
    hash.set(value, result);
    value.forEach((v, k) => {
      result.set(deepClone(k, hash), deepClone(v, hash));
    });
    return result as T;
  }

  // Set
  if (value instanceof Set) {
    const result = new Set();
    hash.set(value, result);
    value.forEach(v => result.add(deepClone(v, hash)));
    return result as T;
  }

  // Обычный объект
  const result: Record<string, unknown> = {};
  hash.set(value as object, result);
  Object.keys(value as object).forEach(key => {
    const val = (value as Record<string, unknown>)[key];
    result[key] = deepClone(val, hash);
  });
  return result as T;
}
