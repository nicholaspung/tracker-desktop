import { COLLECTION_NAMES } from './collections';
import { SELECT_TYPES, TABLE_DISPLAY_TYPES } from './display';

/**
 * COLUMN KEY USAGE:
 * - id: collection field name
 * - type: display for table/forms
 * - expandFields: to expand the collection field when fetching data
 * - expandPath: to replace the value when parsing fetched data for client
 *    - must be used with expandFields
 * - selectType: display for forms, recommended use with TABLE_DISPLAY_TYPES.BADGE
 */

export const CONFIG_FINANCES_LOG = {
  collection: COLLECTION_NAMES.FINANCES_LOG,
  columns: [
    { id: 'date', type: TABLE_DISPLAY_TYPES.DATE },
    { id: 'amount', type: TABLE_DISPLAY_TYPES.DOLLAR },
    { id: 'description', type: TABLE_DISPLAY_TYPES.TEXT },
    {
      id: 'category',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'category',
      expandPath: 'expand.category.category',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.FINANCES_CATEGORY,
      storeField: 'category',
    },
    {
      id: 'tags',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'tags',
      expandPath: 'expand.tags[].tag',
      selectType: SELECT_TYPES.MULTIPLE,
      store: COLLECTION_NAMES.FINANCES_TAG,
      storeField: 'tag',
    },
  ],
};

export const CONFIG_FINANCES_CATEGORY = {
  collection: COLLECTION_NAMES.FINANCES_CATEGORY,
  columns: [{ id: 'category', type: TABLE_DISPLAY_TYPES.TEXT }],
};

export const CONFIG_FINANCES_TAG = {
  collection: COLLECTION_NAMES.FINANCES_TAG,
  columns: [{ id: 'tag', type: TABLE_DISPLAY_TYPES.TEXT }],
};

export const CONFIG_CUSTOM_FINANCE_SUMMARY = {
  columns: [
    { id: 'category', type: TABLE_DISPLAY_TYPES.TEXT },
    { id: 'amount', type: TABLE_DISPLAY_TYPES.DOLLAR },
  ],
};
