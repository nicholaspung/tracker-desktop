import { COLLECTION_NAMES } from './collections';
import { TABLE_DISPLAY_TYPES } from './display';

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
    },
    {
      id: 'tags',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'tags',
      expandPath: 'expand.tags[].tag',
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
