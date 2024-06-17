import { COLLECTION_NAMES } from '../collections';
import { SELECT_TYPES, TABLE_DISPLAY_TYPES } from '../display';

export const CONFIG_FINANCES_BALANCE = {
  collection: COLLECTION_NAMES.FINANCES_BALANCE,
  sort: '-date',
  columns: [
    { id: 'date', type: TABLE_DISPLAY_TYPES.DATE },
    { id: 'amount', type: TABLE_DISPLAY_TYPES.DOLLAR },
    {
      id: 'account_name',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'account_name',
      expandPath: 'expand.account_name.name',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.FINANCES_BALANCE_ACCOUNT_NAME,
      storeField: 'name',
    },
    {
      id: 'account_type',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'type',
      expandPath: 'expand.type.account_type',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.FINANCES_BALANCE_OWNER,
      storeField: 'account_type',
    },
    {
      id: 'account_owner',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'owner',
      expandPath: 'expand.owner.name',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.FINANCES_BALANCE_TYPE,
      storeField: 'name',
    },
  ],
};

export const CONFIG_FINANCES_BALANCE_ACCOUNT_NAME = {
  collection: COLLECTION_NAMES.FINANCES_BALANCE_ACCOUNT_NAME,
  sort: 'name',
  columns: [{ id: 'name', type: TABLE_DISPLAY_TYPES.TEXT }],
};

export const CONFIG_FINANCES_BALANCE_OWNER = {
  collection: COLLECTION_NAMES.FINANCES_BALANCE_OWNER,
  sort: 'name',
  columns: [{ id: 'name', type: TABLE_DISPLAY_TYPES.TEXT }],
};

export const CONFIG_FINANCES_BALANCE_TYPE = {
  collection: COLLECTION_NAMES.FINANCES_BALANCE_TYPE,
  sort: 'account_type',
  columns: [
    { id: 'account_type', type: TABLE_DISPLAY_TYPES.TEXT },
    {
      id: 'category',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'category',
      expandPath: 'expand.category.category',
      store: COLLECTION_NAMES.FINANCES_CATEGORY,
      storeField: 'category',
    },
  ],
};
