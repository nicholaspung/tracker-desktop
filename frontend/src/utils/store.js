import { toUniqueStoreName } from './misc';
import { removeDuplicatesAccordingToFields } from './table';

export const getStoreNamesFromConfigColumns = (config) => {
  /**
   * [collectionName, ...]
   */
  const storeNames = [];
  // Grab store names
  config.columns.forEach((column) => {
    if (column.store) {
      storeNames.push(column.store);
    }
  });

  return storeNames;
};

export const getStoreNamesFromConfigFilters = (config) => {
  const storeNames = [];
  config.filters.forEach((filter) => {
    if (filter.store) {
      storeNames.push(filter.store);
    }
  });
  return storeNames;
};

export const getStoreValuesFromConfig = (state, config) => {
  const result = {};
  config.columns.forEach((column) => {
    if (column.store) {
      result[column.store] = state[column.store];
    }
    if (column.overrideStore) {
      result[column.overrideStore] = state[column.store];
    }
    if (column.store && column.storeField && !column.autoSuggestFieldIds) {
      result[toUniqueStoreName(column.store)] =
        removeDuplicatesAccordingToFields(
          state[column.store],
          column.autoSuggestFieldIds
            ? [column.storeField, ...column.autoSuggestFieldIds]
            : [column.storeField],
        );
    }
    if (column.overrideStore && column.autoSuggestFieldIds) {
      result[toUniqueStoreName(column.overrideStore)] =
        removeDuplicatesAccordingToFields(state[column.overrideStore], [
          column.id,
          ...column.autoSuggestFieldIds,
        ]);
    }
  });
  return result;
};
