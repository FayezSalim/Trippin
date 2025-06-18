


export function deepMerge<T extends { [key: string]: any }, K extends keyof T>(currValue: T, update: T) {
  if (typeof update !== 'object' || update === null) return currValue;

  const result = { ...currValue };

  for (const key of Object.keys(update) as K[]) {
    const value = update[key];

    if (value !== undefined && value !== null) {
      if (
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        result[key] = deepMerge(currValue[key], value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}