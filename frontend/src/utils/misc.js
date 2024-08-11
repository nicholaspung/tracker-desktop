export const ALL_OPTION = { label: 'all', value: 'all' };

export const toOptions = (data, field) => {
  if (Array.isArray(data) && field) {
    return data.map((el) => ({ label: el[field], value: el[field] }));
  }
  if (Array.isArray(data)) {
    return data.map((el) => ({ label: el, value: el }));
  }
  if (field) {
    return { label: data[field], value: data[field] };
  }
  return { label: data, value: data };
};

/**
 * Determines if a given item exists or has content.
 * For arrays, it checks if the array has at least one element.
 * For objects, it checks if the object has at least one key.
 * For other types, it checks if the item is truthy.
 *
 * @function itemExists
 * @param {Array|Object|*} item - The input item to check for existence or content.
 * @returns {boolean} - Returns `true` if the item exists or has content, `false` otherwise.
 * @example
 * const array = [1, 2, 3];
 * console.log(itemExists(array)); // true
 *
 * const object = { key: 'value' };
 * console.log(itemExists(object)); // true
 *
 * const string = 'Hello';
 * console.log(itemExists(string)); // true
 *
 * const emptyArray = [];
 * console.log(itemExists(emptyArray)); // false
 *
 * const emptyObject = {};
 * console.log(itemExists(emptyObject)); // false
 *
 * const emptyString = '';
 * console.log(itemExists(emptyString)); // false
 */
export const itemExists = (item) => {
  if (item === null || item === undefined) {
    return false;
  }
  if (Array.isArray(item)) {
    return Boolean(item.length > 0);
  }
  if (typeof item === 'object') {
    return Boolean(Object.keys(item).length > 0);
  }
  return Boolean(item);
};

export const toUniqueStoreName = (store) => `unique-${store}`;
