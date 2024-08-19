import { SUMMARY_FILTERS, TIME_FILTERS } from '../lib/summary';
import {
  dateToDatePicker,
  findLatestDate,
  isCurrentMonth,
  isCurrentYear,
  pbDateToDisplay,
} from './date';
import { ALL_OPTION } from './misc';

// data: [{normal pb entry}]
export const sumDataAccordingToFields = (data, sumField, groupFields) => {
  const groupFieldsObj = {};

  data.forEach((el) => {
    const groupFieldsName = groupFields.map((field) => el[field]).join('-');
    const sumValue = el[sumField];

    if (!groupFieldsObj[groupFieldsName]) {
      groupFieldsObj[groupFieldsName] = {
        ...el,
        [sumField]: sumValue,
      };
      groupFields.forEach((field) => {
        groupFieldsObj[groupFieldsName][field] = el[field];
      });
    } else {
      groupFieldsObj[groupFieldsName][sumField] += sumValue;
    }
  });

  return Object.keys(groupFieldsObj).map((el) => groupFieldsObj[el]);
};

export const latestDataAccordingToField = (
  // [{normal pb entry}]
  data,
  latestFields,
  dateField = 'date',
) => {
  if (!latestFields) return data;
  // { identifier: { date: [el, el]}}
  const dataSet = {};

  data.forEach((el) => {
    const date = dateToDatePicker(new Date(el[dateField]));
    const identifier = latestFields.reduce((acc, curr) => {
      const name = el[curr];
      if (!acc) {
        return name;
      }
      return `${acc}-${name}`;
    }, '');

    if (!dataSet[identifier]) {
      dataSet[identifier] = { [date]: [el] };
      // { 'fdas': { date: [{}}}
    } else if (dataSet[identifier]) {
      if (dataSet[identifier][date]) {
        // { 'fdas': { date: [{}, {}]}}
        const prev = [...dataSet[identifier][date]];
        prev.push(el);
        dataSet[identifier][date] = prev;
      } else {
        // { 'fdas': { date: [{}, {}]}, { date2: [{}]}}
        dataSet[identifier][date] = [el];
      }
    }
  });

  const result = [];
  Object.keys(dataSet).forEach((unique) => {
    const latestDate = findLatestDate(Object.keys(dataSet[unique]));
    result.push(dataSet[unique][latestDate]);
  });

  return result.flat();
};

export const barChartDataAccordingToFields = (
  data,
  titleField,
  timeFrame,
  valueField,
  timeFilter,
) => {
  let xDisplay = '';
  if (timeFrame) {
    if (timeFilter.value === TIME_FILTERS.ALL) {
      xDisplay = 'All';
    } else if (timeFilter.value === TIME_FILTERS.MONTH) {
      xDisplay = timeFrame[TIME_FILTERS.MONTH];
    } else if (timeFilter.value === TIME_FILTERS.YEAR) {
      xDisplay = String(timeFrame[TIME_FILTERS.YEAR].value);
    } else {
      const timeFrameValue = timeFrame[TIME_FILTERS.DATE_RANGE];
      if (!timeFrameValue) return [];
      xDisplay = `${timeFrameValue.startDate} to ${timeFrameValue.endDate}`;
    }
  } else {
    xDisplay = 'loading...';
  }
  return data.map((el) => ({
    title: el[titleField],
    type: 'bar',
    data: [{ x: xDisplay, y: el[valueField] }],
  }));
};

const dateFilterFunction = (el, filterOptions, dateField = 'date') => {
  const value = pbDateToDisplay(el[dateField]);
  if (filterOptions.timeFrame) {
    if (filterOptions.timeFilter.value === TIME_FILTERS.ALL) {
      return true;
    }
    if (filterOptions.timeFilter.value === TIME_FILTERS.MONTH) {
      return isCurrentMonth(
        new Date(value),
        new Date(filterOptions.timeFrame[TIME_FILTERS.MONTH]),
      );
    }
    if (filterOptions.timeFilter.value === TIME_FILTERS.YEAR) {
      return isCurrentYear(
        new Date(value),
        new Date(String(filterOptions.timeFrame[TIME_FILTERS.YEAR].value)),
      );
    }
    return (
      new Date(value) >=
        new Date(filterOptions.timeFrame[TIME_FILTERS.DATE_RANGE].startDate) &&
      new Date(value) <=
        new Date(filterOptions.timeFrame[TIME_FILTERS.DATE_RANGE].endDate)
    );
  }
  return false;
};

export const filterDataAccordingtoFilterOptions = (
  data,
  filters,
  filterOptions,
) => {
  if (!data.length) return data;

  const filterOptionsKeys = Object.keys(filterOptions).filter(
    (el) => el !== 'timeFilter' && el !== 'timeFrame',
  );

  return data.filter((el) => {
    let override = false;
    if (!dateFilterFunction(el, filterOptions)) {
      return false;
    }
    for (let i = 0; i < filterOptionsKeys.length; i += 1) {
      const index = filters.findIndex((ele) => ele.id === filterOptionsKeys[i]);
      if (index !== -1) {
        const filterItem = filters[index];
        const { id, filter } = filterItem;
        const selection = filterOptions[filterOptionsKeys[i]];
        if (filter === SUMMARY_FILTERS.SELECTION_SINGLE) {
          if (selection.value === ALL_OPTION.value) {
            continue;
          }
          const value = el[id];
          if (!value === selection.value) {
            override = true;
            break;
          }
        }
        if (filter === SUMMARY_FILTERS.SELECTION_MULTIPLE) {
          if (selection[0].value === ALL_OPTION.value) {
            continue;
          }
          try {
            const value = el[id];
            if (Array.isArray(selection)) {
              let arrayOverride = true; // start off assuming it will be false
              for (let j = 0; j < selection.length; j += 1) {
                if (value === selection[j].value) {
                  arrayOverride = false;
                  break;
                }
              }
              override = arrayOverride;
              break;
            }
          } catch (err) {
            throw new Error('failed in parsing JSON data');
          }
        }
      }
    }
    if (override) {
      return false;
    }
    return true;
  });
};
