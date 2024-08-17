import { SELECT_TYPES, TABLE_DISPLAY_TYPES } from '../lib/display';
import { cloudscapeDateToCorrectDateValue } from './date';
import { toOptions, toUniqueStoreName } from './misc';

export const getInitialDataFormat = (columns, defaultData) =>
  columns.reduce(
    (acc, curr) => {
      let value;
      const DEFAULT_VALUES = {
        [TABLE_DISPLAY_TYPES.DATE]: cloudscapeDateToCorrectDateValue(),
        [TABLE_DISPLAY_TYPES.BADGE]:
          curr.selectType === SELECT_TYPES.MULTIPLE ? [] : '',
        [TABLE_DISPLAY_TYPES.DOLLAR]: '',
        [TABLE_DISPLAY_TYPES.TEXT]: '',
        [TABLE_DISPLAY_TYPES.ID]: crypto.randomUUID(),
        [TABLE_DISPLAY_TYPES.FILE]: [],
      };
      const returnData = (column, data, displayType) =>
        data && data[column.id] ? data[column.id] : DEFAULT_VALUES[displayType];
      switch (curr.type) {
        case TABLE_DISPLAY_TYPES.DATE:
          value = returnData(curr, defaultData, TABLE_DISPLAY_TYPES.DATE);
          break;
        case TABLE_DISPLAY_TYPES.BADGE:
          const badgeValue = returnData(
            curr,
            defaultData,
            TABLE_DISPLAY_TYPES.BADGE,
          );
          if ((Array.isArray(badgeValue) && badgeValue.length) || badgeValue) {
            value = toOptions(badgeValue);
          }
          break;
        case TABLE_DISPLAY_TYPES.ID:
          value = returnData(curr, defaultData, TABLE_DISPLAY_TYPES.ID);
          break;
        case TABLE_DISPLAY_TYPES.FILE:
          value = returnData(curr, defaultData, TABLE_DISPLAY_TYPES.FILE);
          break;
        case TABLE_DISPLAY_TYPES.DOLLAR:
        case TABLE_DISPLAY_TYPES.TEXT:
        default:
          value = returnData(curr, defaultData, TABLE_DISPLAY_TYPES.TEXT);
      }
      acc[curr.id] = value;
      return acc;
    },
    defaultData && defaultData.id ? { id: defaultData.id } : {},
  );

export const getAutoSuggestDataFromColumn = (storeValue, column) =>
  storeValue.map((el) => {
    const result = {
      value: el[column.storeField ? column.storeField : column.id],
    };
    if (column.autoSuggestFieldIds) {
      result.value = el[column.id];
      result.tags = column.autoSuggestFieldIds.map((field) => {
        if (Array.isArray(el[field])) {
          if (el[field].length > 1) {
            return el[field].join(', ');
          }
          return `${el[field]}, `;
        }
        return el[field];
      });
      result.filteringTags = column.autoSuggestFieldIds;
    }
    return result;
  });

export const getStoreValueFromConfig = (storeValues, config, column) => {
  if (column.overrideStore) {
    return storeValues[toUniqueStoreName(column.overrideStore)];
  }
  if (column.store) {
    return storeValues[column.store];
  }
  return storeValues[config.collection];
};
