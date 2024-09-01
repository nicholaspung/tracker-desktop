import { COLLECTION_NAMES } from '../collections';
import { SELECT_TYPES, TABLE_DISPLAY_TYPES } from '../display';

export const CONFIG_HEALTH_WEIGHT_LOGS = {
  label: 'Weight logs',
  collection: COLLECTION_NAMES.HEALTH_WEIGHT_LOGS,
  sort: '-date',
  columns: [
    { id: 'date', type: TABLE_DISPLAY_TYPES.DATE, required: true },
    { id: 'weight', type: TABLE_DISPLAY_TYPES.NUMBER, required: true },
    {
      id: 'unit',
      type: TABLE_DISPLAY_TYPES.BADGE,
      required: true,
      expandFields: 'unit',
      expandPath: 'expand.unit.type',
      selectType: SELECT_TYPES.SINGLE,
      store: COLLECTION_NAMES.HEALTH_MEASUREMENT_TYPE,
      storeField: 'type',
    },
    { id: 'fat_mass', type: TABLE_DISPLAY_TYPES.NUMBER },
    { id: 'bone_mass', type: TABLE_DISPLAY_TYPES.NUMBER },
    { id: 'muscle_mass', type: TABLE_DISPLAY_TYPES.NUMBER },
    { id: 'fat_mass_percentage', type: TABLE_DISPLAY_TYPES.PERCENTAGE },
    { id: 'bone_mass_percentage', type: TABLE_DISPLAY_TYPES.PERCENTAGE },
    { id: 'muscle_mass_percentage', type: TABLE_DISPLAY_TYPES.PERCENTAGE },
    { id: 'hydration', type: TABLE_DISPLAY_TYPES.NUMBER },
    { id: 'comments', type: TABLE_DISPLAY_TYPES.TEXT },
  ],
};

export const CONFIG_MEASUREMENT_TYPE = {
  label: 'Measurement type',
  collection: COLLECTION_NAMES.HEALTH_MEASUREMENT_TYPE,
  sort: 'type',
  columns: [{ id: 'type', type: TABLE_DISPLAY_TYPES.AUTOSUGGEST }],
};

export const CONFIG_HEALTH_FILES = {
  collection: COLLECTION_NAMES.HEALTH_FILES,
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
