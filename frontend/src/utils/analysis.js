import { TIME_FILTERS } from '../lib/summary';
import { isCurrentMonth, isCurrentYear } from './date';
import { ALL_OPTION } from './misc';

export const filterDataAccordingToPbDate = (data, timeFilter, timeFrame) => {
  if (timeFilter.value === TIME_FILTERS.MONTH) {
    return data.filter((el) =>
      isCurrentMonth(
        new Date(el.date),
        new Date(timeFrame[TIME_FILTERS.MONTH]),
      ),
    );
  }
  if (timeFilter.value === TIME_FILTERS.YEAR) {
    return data.filter((el) =>
      isCurrentYear(
        new Date(el.date),
        new Date(String(timeFrame[TIME_FILTERS.YEAR].value)),
      ),
    );
  }
  return data.filter(
    (el) =>
      new Date(el.date) >=
        new Date(timeFrame[TIME_FILTERS.DATE_RANGE].startDate) &&
      new Date(el.date) <= new Date(timeFrame[TIME_FILTERS.DATE_RANGE].endDate),
  );
};

export const filterDataAccordingToField = (data, field, selection) => {
  if (Array.isArray(selection)) {
    if (selection[0].value === ALL_OPTION.value) {
      return data;
    }
  } else if (selection.value === ALL_OPTION.value) {
    return data;
  }

  return data.filter((el) => {
    try {
      const parsedData = JSON.stringify(el[field]);
      if (Array.isArray(selection)) {
        for (let i = 0; i < selection.length; i += 1) {
          if (!parsedData.includes(selection[i].value)) {
            return false;
          }
        }
      } else if (!parsedData.includes(selection.value)) {
        return false;
      }

      return true;
    } catch (err) {
      throw new Error('failed in parsing JSON data');
    }
  });
};

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
export const pieChartDataAccordingToFields = (data, titleField, valueField) =>
  data.map((el) => ({ title: el[titleField], value: el[valueField] }));

export const barChartDataAccordingToFields = (
  data,
  titleField,
  timeFrame,
  valueField,
  timeFilter,
) => {
  let xDisplay = '';
  if (timeFilter.value === TIME_FILTERS.MONTH) {
    xDisplay = timeFrame[TIME_FILTERS.MONTH];
  } else if (timeFilter.value === TIME_FILTERS.YEAR) {
    xDisplay = String(timeFrame[TIME_FILTERS.YEAR].value);
  } else {
    const timeFrameValue = timeFrame[TIME_FILTERS.DATE_RANGE];
    if (!timeFrameValue) return [];
    xDisplay = `${timeFrameValue.startDate} to ${timeFrameValue.endDate}`;
  }
  return data.map((el) => ({
    title: el[titleField],
    type: 'bar',
    data: [{ x: xDisplay, y: el[valueField] }],
  }));
};
