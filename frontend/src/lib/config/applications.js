import { COLLECTION_NAMES } from '../collections';
import { TABLE_DISPLAY_TYPES } from '../display';

export const CONFIG_APPLICATIONS = {
  collection: COLLECTION_NAMES.APPLICATIONS,
  sort: 'name',
  columns: [
    { id: 'name', type: TABLE_DISPLAY_TYPES.TEXT },
    { id: 'description', type: TABLE_DISPLAY_TYPES.TEXT },
    { id: 'collectionNames', type: TABLE_DISPLAY_TYPES.TEXT },
    { id: 'selected', type: TABLE_DISPLAY_TYPES.CHECKBOX },
  ],
};
