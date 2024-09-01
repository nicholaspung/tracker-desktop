/**
 * COLUMN KEY USAGE:
 * - id: collection field name
 * - type: display for table/forms
 * - expandFields: to expand the collection field when fetching data
 * - expandPath: to replace the value when parsing fetched data for client
 *    - must be used with expandFields
 * - selectType: display for forms, recommended use with TABLE_DISPLAY_TYPES.BADGE
 */

export * from './config/financeLogs';
export * from './config/financeBalances';
export * from './config/bodyComposition';
