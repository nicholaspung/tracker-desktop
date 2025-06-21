import { COLLECTION_NAMES } from '../collections';
import { TABLE_DISPLAY_TYPES } from '../display';

export const CONFIG_HABITS = {
  label: 'habits',
  collection: COLLECTION_NAMES.HABITS,
  sort: 'name',
  columns: [
    { id: 'name', type: TABLE_DISPLAY_TYPES.TEXT, required: true },
    { id: 'description', type: TABLE_DISPLAY_TYPES.TEXT },
    { id: 'repeatSelection', type: TABLE_DISPLAY_TYPES.TEXT },
    { id: 'repeatEveryXDay', type: TABLE_DISPLAY_TYPES.NUMBER },
    { id: 'repeatEveryWeekOnXDays', type: TABLE_DISPLAY_TYPES.TEXT },
    { id: 'repeatEveryXDayOfMonth', type: TABLE_DISPLAY_TYPES.NUMBER },
    { id: 'repeatEveryYearOnXDay', type: TABLE_DISPLAY_TYPES.NUMBER },
    { id: 'repeatEveryYearOnXMonth', type: TABLE_DISPLAY_TYPES.TEXT },
    { id: 'archived', type: TABLE_DISPLAY_TYPES.BOOL },
  ],
};

export const CONFIG_DAILIES = {
  label: 'dailies',
  collection: COLLECTION_NAMES.DAILIES,
  sort: '-date',
  columns: [
    { id: 'date', type: TABLE_DISPLAY_TYPES.DATE, required: true },
    { id: 'completed', type: TABLE_DISPLAY_TYPES.BOOL },
    { 
      id: 'current_relation', 
      type: TABLE_DISPLAY_TYPES.TEXT,
      expandFields: 'current_relation',
      expandPath: 'expand.current_relation.name'
    },
    { id: 'initial_habit', type: TABLE_DISPLAY_TYPES.TEXT },
  ],
};