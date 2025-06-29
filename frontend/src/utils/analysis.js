import {
  SUMMARY_ANALYSIS,
  SUMMARY_ANALYSIS_DISPLAY,
  TIME_FILTERS,
} from '../lib/summary';
import {
  cloudscapeDateToCorrectDateValue,
  dateToDatePicker,
  dateToDatePickerMonth,
  findLatestDate,
  isCurrentMonth,
  isCurrentYear,
  pbDateToDisplay,
} from './date';
import { totalSumOfDataAccordingToField } from './math';
import { ALL_OPTION, itemExists } from './misc';
import {
  getMonthsBetweenDates,
  getSortedRanges,
  getWeeksBetweenDates,
  getYearsBetweenDates,
  groupDataByMonthRanges,
  groupDataByWeekRanges,
  groupDataByYearRanges,
} from './time';

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

const dateToBarChatDisplay = (date, timeFilter, timeFrame) => {
  let xDisplay;
  if (timeFilter.value === TIME_FILTERS.ALL) {
    xDisplay = 'All';
  } else if (timeFilter.value === TIME_FILTERS.MONTH) {
    if (timeFrame) {
      xDisplay = timeFrame[TIME_FILTERS.MONTH];
    } else {
      xDisplay = dateToDatePickerMonth(new Date(date));
    }
  } else if (timeFilter.value === TIME_FILTERS.YEAR) {
    if (timeFrame) {
      xDisplay = String(timeFrame[TIME_FILTERS.YEAR].value);
    } else {
      [xDisplay] = date.split(' ')[0].split('-');
    }
  } else if (timeFrame) {
    const timeFrameValue = timeFrame[TIME_FILTERS.DATE_RANGE];
    if (!timeFrameValue) return [];
    xDisplay = `${timeFrameValue.startDate} to ${timeFrameValue.endDate}`;
  } else {
    xDisplay = dateToDatePicker(new Date(date));
  }
  return xDisplay;
};

export const singleBarChartDataAccordingToFields = (
  data,
  titleField,
  timeFrame,
  valueField,
  timeFilter,
) => {
  let xDisplay = '';
  if (timeFrame) {
    xDisplay = dateToBarChatDisplay('', timeFilter, timeFrame);
  } else {
    xDisplay = 'loading...';
  }
  return data.map((el) => ({
    title: el[titleField],
    type: 'bar',
    data: [{ x: xDisplay, y: el[valueField] }],
  }));
};

export const multipleBarChartDataAccordingToFields = (
  data,
  titleField,
  valueField,
  dateField,
  timeFilter,
  analysisDisplay,
  sumField,
) => {
  const result = {};
  const analysisResult = {};
  data.forEach((el) => {
    if (!result[el[titleField]]) {
      result[el[titleField]] = [];
    }
    result[el[titleField]].push(el);
    if (analysisDisplay === SUMMARY_ANALYSIS_DISPLAY.POSITIVE_NEGATIVE_TOTAL) {
      if (!analysisResult[el[dateField]]) {
        analysisResult[el[dateField]] = [];
      }
      analysisResult[el[dateField]].push(el);
    }
  });

  if (analysisDisplay === SUMMARY_ANALYSIS_DISPLAY.POSITIVE_NEGATIVE_TOTAL) {
    const positiveData = {
      title: 'positive',
      type: 'bar',
      data: [],
    };
    const negativeData = {
      title: 'negative',
      type: 'bar',
      data: [],
    };
    Object.keys(analysisResult).forEach((date) => {
      const { positive, negative } = totalSumOfDataAccordingToField(
        analysisResult[date],
        sumField,
      );
      positiveData.data.push({
        x: dateToBarChatDisplay(date, timeFilter),
        y: positive,
      });
      negativeData.data.push({
        x: dateToBarChatDisplay(date, timeFilter),
        y: negative,
      });
    });
    return [positiveData, negativeData];
  }

  return Object.keys(result).map((value) => {
    const chartData = [];
    result[value].forEach((el) => {
      chartData.push({
        x: dateToBarChatDisplay(el[dateField], timeFilter),
        y: el[valueField],
      });
    });
    return {
      title: value,
      type: 'bar',
      data: chartData,
    };
  });
};

const dateFilterFunction = (el, filterOptions, dateField = 'date') => {
  const value = pbDateToDisplay(el[dateField]);
  if (filterOptions.timeFrame) {
    if (
      filterOptions.timeFrame.groupByEvery ||
      filterOptions.timeFilter.value === TIME_FILTERS.ALL
    ) {
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
    if (!dateFilterFunction(el, filterOptions)) {
      return false;
    }

    return filterOptionsKeys.every((filterKey) => {
      const filterItem = filters.find((f) => f.id === filterKey);
      if (!filterItem) return true;

      const { id } = filterItem;
      const selection = filterOptions[filterKey];
      const value = el[id];

      // Check if the selection is ALL_OPTION
      const isAllOption = Array.isArray(selection)
        ? selection[0].value === ALL_OPTION.value
        : selection.value === ALL_OPTION.value;

      if (isAllOption) return true;

      // Skip if value is undefined or null
      if (value === undefined || value === null) return false;

      if (typeof value === 'string') {
        // For string values (like category)
        return selection.some((s) => s.value === value);
      }
      if (Array.isArray(value)) {
        // For array values (like tags)
        return selection.every((s) => value.includes(s.value));
      }

      // If value is neither a string nor an array, it can't match
      return false;
    });
  });
};

export const getGroupedDateRangeKeysObject = (
  data,
  dateField,
  timeFilter,
  groupByEvery,
) => {
  const result = {};
  let timeKeys;
  if (itemExists(data)) {
    const firstDate = data[0][dateField];
    const lastDate = data[data.length - 1][dateField];
    if (timeFilter.value === TIME_FILTERS.YEAR) {
      timeKeys = getYearsBetweenDates(firstDate, lastDate, groupByEvery.value);
    } else if (timeFilter.value === TIME_FILTERS.MONTH) {
      timeKeys = getMonthsBetweenDates(firstDate, lastDate, groupByEvery.value);
    } else if (timeFilter.value === TIME_FILTERS.WEEK) {
      timeKeys = getWeeksBetweenDates(firstDate, lastDate, groupByEvery.value);
    }
    timeKeys.forEach((el) => {
      result[el] = [];
    });
  }
  return result;
};

export const getSummedGroupedDataRangeKeysArr = (
  data,
  rangesObj,
  timeFilter,
  sumField,
  groupFields,
  dateField,
) => {
  let summedGroupedData;
  const summedResult = [];
  if (timeFilter.value === TIME_FILTERS.YEAR) {
    summedGroupedData = groupDataByYearRanges(data, rangesObj);
  } else if (timeFilter.value === TIME_FILTERS.MONTH) {
    summedGroupedData = groupDataByMonthRanges(data, rangesObj);
  } else {
    summedGroupedData = groupDataByWeekRanges(data, rangesObj);
  }
  Object.keys(summedGroupedData).forEach((rangeKey) => {
    const summedRangeKeyData = sumDataAccordingToFields(
      summedGroupedData[rangeKey],
      sumField,
      groupFields,
    );
    let newRangeKey;
    if (timeFilter.value === TIME_FILTERS.YEAR) {
      const today = new Date();
      const month = today.getMonth();
      newRangeKey = cloudscapeDateToCorrectDateValue(
        new Date(rangeKey, month).toISOString().split('T')[0],
      ).toISOString();
    } else if (timeFilter.value === TIME_FILTERS.MONTH) {
      newRangeKey = cloudscapeDateToCorrectDateValue(
        new Date(rangeKey).toISOString().split('T')[0],
      ).toISOString();
    } else {
      const laterDate = rangeKey.split('/')[1];
      newRangeKey = cloudscapeDateToCorrectDateValue(
        new Date(laterDate).toISOString().split('T')[0],
      ).toISOString();
    }
    const correctedRangeSummedRangeKeyData = summedRangeKeyData.map((el) => ({
      ...el,
      [dateField]: newRangeKey,
    }));
    summedResult.push(correctedRangeSummedRangeKeyData);
  });
  return summedResult.flat();
};

export const getLatestGroupedDataRangeKeysArr = (
  data,
  rangesObj,
  timeFilter,
  dateField,
) => {
  const { sortedRanges, rangesCopy } = getSortedRanges(rangesObj);
  const yearFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric' });
  const monthFormatter = new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
  });
  if (timeFilter.value === TIME_FILTERS.YEAR) {
    // Helper function to format date to YYYY
    const formatYear = (date) => yearFormatter.format(date);

    data.forEach((item) => {
      const itemDate = new Date(item[dateField]);
      const itemYear = formatYear(itemDate);
      const itemDateDate = new Date(itemYear);
      sortedRanges.forEach((month) => {
        const monthDate = new Date(month);
        if (itemDateDate <= monthDate) {
          rangesCopy[month].push(item);
        }
      });
    });
  } else if (timeFilter.value === TIME_FILTERS.MONTH) {
    // Helper function to format date to YYYY-MM
    const formatYearMonth = (date) => {
      const year = yearFormatter.format(date);
      const month = monthFormatter.format(date);
      return `${year}-${month}`;
    };

    data.forEach((item) => {
      const itemDate = new Date(item[dateField]);
      const itemMonth = formatYearMonth(itemDate);
      const itemDateDate = new Date(itemMonth);
      sortedRanges.forEach((month) => {
        const monthDate = new Date(month);
        if (itemDateDate <= monthDate) {
          rangesCopy[month].push(item);
        }
      });
    });
  } else {
    // Parse date strings to Date objects in local time
    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    // Sort week ranges in descending order based on end date
    const sortedWeekRanges = Object.keys(rangesCopy).sort((a, b) => {
      const dateA = parseDate(a.split('/')[1]);
      const dateB = parseDate(b.split('/')[1]);
      return dateB - dateA;
    });
    data.forEach((item) => {
      const itemDate = new Date(item[dateField]);
      sortedWeekRanges.forEach((weekRange) => {
        const weekEndDate = new Date(weekRange.split('/')[1]);
        if (itemDate <= weekEndDate) {
          rangesCopy[weekRange].push(item);
        }
      });
    });
  }
  return rangesCopy;
};

/**
 * OVERALL
 */

// returns [{}]
export const getOverallDataAnalysis = (
  data,
  analysis,
  filterOptions,
  fields,
) => {
  let total;
  let positive;
  let negative;
  let analyzedData = data;

  if (
    analysis.includes(SUMMARY_ANALYSIS.GROUP) &&
    itemExists(filterOptions.timeFrame)
  ) {
    const { groupByEvery } = filterOptions.timeFrame;
    const { timeFilter } = filterOptions;
    const result = getGroupedDateRangeKeysObject(
      analyzedData,
      fields.dateField,
      timeFilter,
      groupByEvery,
    );
    if (analysis.includes(SUMMARY_ANALYSIS.LATEST)) {
      const groupedLatestData = getLatestGroupedDataRangeKeysArr(
        analyzedData,
        result,
        timeFilter,
        fields.dateField,
      );
      Object.keys(groupedLatestData).forEach((range) => {
        const latestData = latestDataAccordingToField(
          groupedLatestData[range],
          fields.latestFields,
        );
        if (analysis.includes(SUMMARY_ANALYSIS.SUM)) {
          groupedLatestData[range] = sumDataAccordingToFields(
            latestData,
            fields.sumField,
            fields.groupFields,
          );
        } else {
          groupedLatestData[range] = latestData;
        }
      });
      analyzedData = Object.keys(groupedLatestData)
        .map((range) =>
          groupedLatestData[range].map((el) => ({
            ...el,
            [fields.dateField]:
              timeFilter.value === TIME_FILTERS.WEEK
                ? range.split('/')[1]
                : range,
          })),
        )
        .flat();
    } else if (analysis.includes(SUMMARY_ANALYSIS.SUM)) {
      analyzedData = getSummedGroupedDataRangeKeysArr(
        analyzedData,
        result,
        timeFilter,
        fields.sumField,
        fields.groupFields,
        fields.dateField,
      );
    }
  } else {
    if (analysis.includes(SUMMARY_ANALYSIS.LATEST)) {
      analyzedData = latestDataAccordingToField(
        analyzedData,
        fields.latestFields,
      );
    }
    if (analysis.includes(SUMMARY_ANALYSIS.SUM)) {
      analyzedData = sumDataAccordingToFields(
        analyzedData,
        fields.sumField,
        fields.groupFields,
      );
      if (fields.analysisDisplayFields) {
        const totalSum = totalSumOfDataAccordingToField(
          analyzedData,
          fields.sumField,
        );
        total = totalSum.total;
        positive = totalSum.positive;
        negative = totalSum.negative;
      }
    }
  }
  return {
    analyzedData,
    total,
    positive,
    negative,
  };
};
