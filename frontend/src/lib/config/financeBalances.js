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

export const CONFIG_FINANCES_BALANCE = {
  label: 'finance balance',
  collection: COLLECTION_NAMES.FINANCES_BALANCE,
  sort: '-date',
  columns: [
    { id: 'date', type: TABLE_DISPLAY_TYPES.DATE, required: true },
    { id: 'amount', type: TABLE_DISPLAY_TYPES.DOLLAR, required: true },
    {
      id: 'account_name',
      type: TABLE_DISPLAY_TYPES.TEXT,
      expandFields: 'account_name',
      expandPath: 'expand.account_name.name',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.FINANCES_BALANCE_ACCOUNT_NAME,
      storeField: 'name',
      overrideStore: COLLECTION_NAMES.FINANCES_BALANCE,
      autoSuggestFieldIds: ['account_type', 'account_owner'],
    },
    {
      id: 'account_type',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'type',
      expandPath: 'expand.type.account_type',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.FINANCES_BALANCE_TYPE,
      storeField: 'account_type',
      required: true,
    },
    {
      id: 'account_owner',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'owner',
      expandPath: 'expand.owner.name',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.FINANCES_BALANCE_OWNER,
      storeField: 'name',
    },
  ],
};

export const CONFIG_FINANCES_BALANCE_ACCOUNT_NAME = {
  collection: COLLECTION_NAMES.FINANCES_BALANCE_ACCOUNT_NAME,
  sort: 'name',
  columns: [{ id: 'name', type: TABLE_DISPLAY_TYPES.TEXT, required: true }],
};

export const CONFIG_FINANCES_BALANCE_OWNER = {
  collection: COLLECTION_NAMES.FINANCES_BALANCE_OWNER,
  sort: 'name',
  columns: [{ id: 'name', type: TABLE_DISPLAY_TYPES.TEXT, required: true }],
};

export const CONFIG_FINANCES_BALANCE_TYPE = {
  collection: COLLECTION_NAMES.FINANCES_BALANCE_TYPE,
  sort: 'account_type',
  columns: [
    {
      id: 'account_type',
      type: TABLE_DISPLAY_TYPES.TEXT,
      autoSuggestFieldIds: ['category'],
      required: true,
    },
    {
      id: 'category',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'category',
      expandPath: 'expand.category.category',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.FINANCES_CATEGORY,
      storeField: 'category',
    },
  ],
};

export const CONFIG_CUSTOM_FINANCE_BALANCE_SUMMARY = {
  label: 'finance balances',
  collection: COLLECTION_NAMES.FINANCES_BALANCE,
  columns: [
    { id: 'amount', type: TABLE_DISPLAY_TYPES.DOLLAR },
    {
      id: 'account_type',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'type',
      expandPath: 'expand.type.account_type',
    },
    {
      id: 'account_owner',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'owner',
      expandPath: 'expand.owner.name',
    },
  ],
  filters: [
    {
      filter: SUMMARY_FILTERS.TIME_FILTER,
      exclude: [TIME_FILTERS.WEEK],
    },
    {
      filter: SUMMARY_FILTERS.SELECTION_MULTIPLE,
      store: COLLECTION_NAMES.FINANCES_BALANCE_TYPE,
      label: 'Select account type',
      optionField: 'account_type',
      id: 'account_type',
    },
    {
      filter: SUMMARY_FILTERS.SELECTION_MULTIPLE,
      store: COLLECTION_NAMES.FINANCES_BALANCE_OWNER,
      label: 'Select account owner',
      optionField: 'name',
      id: 'account_owner',
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
          label: 'Account type sums',
          analysis: [SUMMARY_ANALYSIS.SUM, SUMMARY_ANALYSIS.LATEST],
          sumField: 'amount',
          groupFields: ['account_type', 'account_owner'],
          latestFields: ['account_name', 'account_type', 'account_owner'],
          analysisDisplay: SUMMARY_ANALYSIS_DISPLAY.POSITIVE_NEGATIVE_TOTAL,
          analysisDisplayFields: [
            {
              type: SUMMARY_ANALYSIS_DISPLAY_FIELDS.POSITIVE,
              label: 'Assets: ',
            },
            {
              type: SUMMARY_ANALYSIS_DISPLAY_FIELDS.NEGATIVE,
              label: 'Liabilities: ',
            },
            {
              type: SUMMARY_ANALYSIS_DISPLAY_FIELDS.TOTAL,
              label: 'Net worth: ',
            },
          ],
        },
        {
          piece: SUMMARY_PIECES.SINGLE_BAR_CHART,
          xTitle: 'Month',
          yTitle: 'Amount',
          ariaLabel: 'Summary of account type chart',
          popoverTitleField: 'account_type',
          popoverValueField: 'amount',
          analysis: [SUMMARY_ANALYSIS.SUM, SUMMARY_ANALYSIS.LATEST],
          sumField: 'amount',
          groupFields: ['account_type', 'account_owner'],
          latestFields: ['account_name', 'account_type', 'account_owner'],
        },
      ],
    },
    {
      piece: SUMMARY_PIECES.FULL_TABLE,
      config: CONFIG_FINANCES_BALANCE,
      label: 'Finance Balances - filtered',
      analysis: [SUMMARY_ANALYSIS.LATEST],
      latestFields: ['account_name', 'account_type', 'account_owner'],
    },
  ],
};
