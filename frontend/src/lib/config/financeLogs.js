import { COLLECTION_NAMES } from '../collections';
import { SELECT_TYPES, TABLE_DISPLAY_TYPES } from '../display';
import { LAYOUT_PIECES } from '../layout';
import {
  SUMMARY_ANALYSIS,
  SUMMARY_ANALYSIS_DISPLAY,
  SUMMARY_ANALYSIS_DISPLAY_FIELDS,
  SUMMARY_FILTERS,
  SUMMARY_PIECES,
  TIME_FILTERS,
} from '../summary';

export const CONFIG_FINANCES_LOG = {
  label: 'finance log',
  collection: COLLECTION_NAMES.FINANCES_LOG,
  sort: '-date',
  columns: [
    { id: 'date', type: TABLE_DISPLAY_TYPES.DATE, required: true },
    { id: 'amount', type: TABLE_DISPLAY_TYPES.DOLLAR, required: true },
    {
      id: 'description',
      type: TABLE_DISPLAY_TYPES.TEXT,
      overrideStore: COLLECTION_NAMES.FINANCES_LOG,
      autoSuggestFieldIds: ['category', 'tags'],
    },
    {
      id: 'category',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'category',
      expandPath: 'expand.category.category',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.FINANCES_CATEGORY,
      storeField: 'category',
      required: true,
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
  columns: [{ id: 'category', type: TABLE_DISPLAY_TYPES.TEXT, required: true }],
};

export const CONFIG_FINANCES_TAG = {
  collection: COLLECTION_NAMES.FINANCES_TAG,
  sort: 'tag',
  columns: [{ id: 'tag', type: TABLE_DISPLAY_TYPES.TEXT, required: true }],
};

export const CONFIG_FINANCES_FILES = {
  collection: COLLECTION_NAMES.FINANCES_FILES,
  sort: '-date_uploaded',
  columns: [
    {
      id: 'date_uploaded',
      type: TABLE_DISPLAY_TYPES.DATE,
    },
    {
      id: 'attachments',
      type: TABLE_DISPLAY_TYPES.FILE,
      selectType: SELECT_TYPES.MULTIPLE,
      fileTypes: ['all'],
      required: true,
    },
  ],
};

export const CONFIG_CUSTOM_FINANCE_SUMMARY = {
  label: 'finance logs',
  collection: COLLECTION_NAMES.FINANCES_LOG,
  columns: [
    { id: 'category', type: TABLE_DISPLAY_TYPES.TEXT },
    { id: 'amount', type: TABLE_DISPLAY_TYPES.DOLLAR },
  ],
  filters: [
    {
      filter: SUMMARY_FILTERS.TIME_FILTER,
      exclude: [TIME_FILTERS.WEEK],
    },
    {
      filter: SUMMARY_FILTERS.SELECTION_MULTIPLE,
      store: COLLECTION_NAMES.FINANCES_CATEGORY,
      label: 'Select category',
      optionField: 'category',
      id: 'category',
    },
    {
      filter: SUMMARY_FILTERS.SELECTION_MULTIPLE,
      store: COLLECTION_NAMES.FINANCES_TAG,
      label: 'Select tag',
      optionField: 'tag',
      id: 'tags',
    },
  ],
  components: [
    {
      layout: LAYOUT_PIECES.COLUMNS,
      columns: 2,
      variant: 'text-grid',
      pieces: [
        {
          piece: SUMMARY_PIECES.SUMMARY_TABLE,
          label: 'Category sums',
          analysis: [SUMMARY_ANALYSIS.SUM],
          sumField: 'amount',
          groupFields: ['category'],
          analysisDisplay: SUMMARY_ANALYSIS_DISPLAY.POSITIVE_NEGATIVE_TOTAL,
          analysisDisplayFields: [
            {
              type: SUMMARY_ANALYSIS_DISPLAY_FIELDS.POSITIVE,
              label: 'Income + Cash: ',
            },
            {
              type: SUMMARY_ANALYSIS_DISPLAY_FIELDS.NEGATIVE,
              label: 'Spend: ',
            },
            { type: SUMMARY_ANALYSIS_DISPLAY_FIELDS.TOTAL, label: 'Total: ' },
          ],
        },
        {
          piece: SUMMARY_PIECES.SINGLE_BAR_CHART,
          xTitle: 'Month',
          yTitle: 'Amount',
          ariaLabel: 'Summary of category chart',
          popoverTitleField: 'category',
          popoverValueField: 'amount',
          analysis: [SUMMARY_ANALYSIS.SUM],
          sumField: 'amount',
          groupFields: ['category'],
        },
      ],
    },
    { layout: LAYOUT_PIECES.HORIZONTAL_LINE },
    {
      piece: SUMMARY_PIECES.FULL_TABLE,
      config: CONFIG_FINANCES_LOG,
      label: 'Finance Logs - filtered',
    },
  ],
};
