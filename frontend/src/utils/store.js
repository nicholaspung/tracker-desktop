export const getStoreNamesFromConfig = (config) => {
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
