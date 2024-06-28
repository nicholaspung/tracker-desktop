import { SUMMARY_FILTERS, TIME_FILTERS } from '../lib/summary';
import { isCurrentMonth, isCurrentYear } from './date';
import { ALL_OPTION } from './misc';

export const sumDataAccordingToFields = (data, sumField, groupField) => {
  const groupFieldObj = {};

  data.forEach((el) => {
    const groupValue = el[groupField];
    const sumValue = el[sumField];

    if (!groupFieldObj[groupValue]) {
      groupFieldObj[groupValue] = {
        id: el.id,
        [sumField]: sumValue,
        [groupField]: groupValue,
      };
    } else {
      groupFieldObj[groupValue][sumField] += sumValue;
    }
  });

  return Object.keys(groupFieldObj).map((el) => groupFieldObj[el]);
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
    if (timeFilter.value === TIME_FILTERS.MONTH) {
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

const dateFilterFunction = (el, filterOptions) => {
  if (filterOptions.timeFrame) {
    if (filterOptions.timeFilter.value === TIME_FILTERS.MONTH) {
      return isCurrentMonth(
        new Date(el.date),
        new Date(filterOptions.timeFrame[TIME_FILTERS.MONTH]),
      );
    }
    if (filterOptions.timeFilter.value === TIME_FILTERS.YEAR) {
      return isCurrentYear(
        new Date(el.date),
        new Date(String(filterOptions.timeFrame[TIME_FILTERS.YEAR].value)),
      );
    }
    return (
      new Date(el.date) >=
        new Date(filterOptions.timeFrame[TIME_FILTERS.DATE_RANGE].startDate) &&
      new Date(el.date) <=
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
          try {
            const parsedData = JSON.stringify(el[id]);
            if (!parsedData.includes(selection.value)) {
              override = true;
              break;
            }
          } catch (err) {
            throw new Error('failed in parsing JSON data');
          }
        }
        if (filter === SUMMARY_FILTERS.SELECTION_MULTIPLE) {
          if (selection[0].value === ALL_OPTION.value) {
            continue;
          }
          try {
            const parsedData = JSON.stringify(el[id]);
            if (Array.isArray(selection)) {
              for (let j = 0; j < selection.length; j += 1) {
                if (!parsedData.includes(selection[j].value)) {
                  override = true;
                  break;
                }
              }
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
