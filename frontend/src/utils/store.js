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
