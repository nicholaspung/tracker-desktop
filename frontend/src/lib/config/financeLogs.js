import { COLLECTION_NAMES } from '../collections';
import { SELECT_TYPES, TABLE_DISPLAY_TYPES } from '../display';
// import { SUMMARY_FILTERS, TIME_FILTERS } from '../summary';

export const CONFIG_FINANCES_LOG = {
  collection: COLLECTION_NAMES.FINANCES_LOG,
  sort: '-date',
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
  sort: 'category',
  columns: [{ id: 'category', type: TABLE_DISPLAY_TYPES.TEXT }],
};

export const CONFIG_FINANCES_TAG = {
  collection: COLLECTION_NAMES.FINANCES_TAG,
  sort: 'tag',
  columns: [{ id: 'tag', type: TABLE_DISPLAY_TYPES.TEXT }],
};

export const CONFIG_CUSTOM_FINANCE_SUMMARY = {
  collection: COLLECTION_NAMES.FINANCES_LOG,
  columns: [
    { id: 'category', type: TABLE_DISPLAY_TYPES.TEXT },
    { id: 'amount', type: TABLE_DISPLAY_TYPES.DOLLAR },
  ],
  // filters: [
  //   { filter: SUMMARY_FILTERS.TIME_FILTER, exclude: [TIME_FILTERS.WEEK] },
  //   {
  //     filter: SUMMARY_FILTERS.SELECTION_SINGLE,
  //     store: COLLECTION_NAMES.FINANCES_CATEGORY,
  //   },
  //   {
  //     filter: SUMMARY_FILTERS.SELECTION_SINGLE,
  //     store: COLLECTION_NAMES.FINANCES_TAG,
  //   },
  // ],
};
