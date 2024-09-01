import { itemExists } from './misc';

/**
 * Converts a string from snake_case to Title Case.
 *
 * @param {string} str - The input string in snake_case format.
 * @returns {string} The converted string in Title Case format.
 *
 * @example
 * convertToTitleCase('account_name');
 * // Returns: 'Account Name'
 *
 * @example
 * convertToTitleCase('user_profile');
 * // Returns: 'User Profile'
 */
export function convertToTitleCase(str) {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function convertToDollar(str) {
  let newStr = str;
  if (!itemExists(str)) {
    newStr = 0;
  }
  if (typeof newStr === 'string') {
    newStr = Number(newStr);
  }
  return newStr.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

export function decimalToPercentage(decimal) {
  return `${(decimal * 100).toFixed(2)}%`;
}
