import { COLLECTION_NAMES } from '../collections';
import { SELECT_TYPES, TABLE_DISPLAY_TYPES } from '../display';

export const CONFIG_INVENTORY_ENTRY = {
  label: 'inventory entry',
  collection: COLLECTION_NAMES.INVENTORY_ENTRY,
  sort: '-date',
  columns: [
    {
      id: 'item',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'item',
      expandPath: 'expand.item.name',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.INVENTORY_ITEM,
      storeField: 'name',
      required: true,
    },
    {
      id: 'quantity',
      type: TABLE_DISPLAY_TYPES.NUMBER,
      required: true,
    },
    {
      id: 'unit',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'unit',
      expandPath: 'expand.unit.name',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.INVENTORY_UNIT,
      storeField: 'name',
      required: true,
    },
    {
      id: 'location',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'location',
      expandPath: 'expand.location.name',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.INVENTORY_LOCATION,
      storeField: 'name',
    },
    {
      id: 'expiration_date',
      type: TABLE_DISPLAY_TYPES.DATE,
    },
    {
      id: 'notes',
      type: TABLE_DISPLAY_TYPES.TEXT,
    },
  ],
};

export const CONFIG_INVENTORY_ITEM = {
  label: 'inventory item',
  collection: COLLECTION_NAMES.INVENTORY_ITEM,
  sort: 'name',
  columns: [
    {
      id: 'name',
      type: TABLE_DISPLAY_TYPES.TEXT,
      required: true,
    },
    {
      id: 'description',
      type: TABLE_DISPLAY_TYPES.TEXT,
    },
    {
      id: 'category',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'category',
      expandPath: 'expand.category.name',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.INVENTORY_CATEGORY,
      storeField: 'name',
      required: true,
    },
    {
      id: 'default_location',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'default_location',
      expandPath: 'expand.default_location.name',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.INVENTORY_LOCATION,
      storeField: 'name',
    },
    {
      id: 'default_unit',
      type: TABLE_DISPLAY_TYPES.BADGE,
      expandFields: 'default_unit',
      expandPath: 'expand.default_unit.name',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.INVENTORY_UNIT,
      storeField: 'name',
      required: true,
    },
    {
      id: 'minimum_stock',
      type: TABLE_DISPLAY_TYPES.NUMBER,
      required: true,
    },
  ],
};

export const CONFIG_INVENTORY_CATEGORY = {
  label: 'inventory category',
  collection: COLLECTION_NAMES.INVENTORY_CATEGORY,
  sort: 'name',
  columns: [
    {
      id: 'name',
      type: TABLE_DISPLAY_TYPES.TEXT,
      required: true,
    },
    {
      id: 'description',
      type: TABLE_DISPLAY_TYPES.TEXT,
    },
  ],
};

export const CONFIG_INVENTORY_UNIT = {
  label: 'inventory unit',
  collection: COLLECTION_NAMES.INVENTORY_UNIT,
  sort: 'name',
  columns: [
    {
      id: 'name',
      type: TABLE_DISPLAY_TYPES.TEXT,
      required: true,
    },
    {
      id: 'abbreviation',
      type: TABLE_DISPLAY_TYPES.TEXT,
      required: true,
    },
  ],
};

export const CONFIG_INVENTORY_LOCATION = {
  label: 'inventory location',
  collection: COLLECTION_NAMES.INVENTORY_LOCATION,
  sort: 'name',
  columns: [
    {
      id: 'name',
      type: TABLE_DISPLAY_TYPES.TEXT,
      required: true,
    },
    {
      id: 'description',
      type: TABLE_DISPLAY_TYPES.TEXT,
    },
  ],
};
