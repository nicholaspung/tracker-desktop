/**
 * FUNCTIONS CREATED BY CLAUDE.AI BECAUSE TOO MUCH BRAIN POWER
 */

import { itemExists } from './misc';

export const getSortedRanges = (ranges) => {
  // Create a copy of ranges to avoid modifying the original
  const rangesCopy = Object.fromEntries(
    Object.entries(ranges).map(([year, arr]) => [year, [...arr]]),
  );

  // Sort years in descending order
  const sortedRanges = Object.keys(rangesCopy).sort((a, b) =>
    b.localeCompare(a),
  );

  return { sortedRanges, rangesCopy };
};

export function getYearsBetweenDates(startDateStr, endDateStr, multiple) {
  // Parse the input strings into Date objects
  let startDate = new Date(startDateStr);
  let endDate = new Date(endDateStr);

  // Ensure endDate is later than startDate
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  const years = [];
  let currentYear = endDate.getFullYear();
  const startYear = startDate.getFullYear();

  while (currentYear >= startYear) {
    // Create a new Date object for January 1st of the current year
    const yearDate = new Date(currentYear, 0, 1);
    years.push(yearDate.getFullYear());
    currentYear -= multiple;
  }

  return years;
}

export function getMonthsBetweenDates(startDateStr, endDateStr, multiple) {
  // Parse the input strings into Date objects, preserving UTC
  let startDate = new Date(startDateStr);
  let endDate = new Date(endDateStr);

  // Ensure endDate is later than startDate
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  const months = [];
  // Start from the first day of the end date's month
  const currentDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  // Continue until we've included the month of the start date
  while (
    currentDate >= new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  ) {
    // Format the date as YYYY-MM
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, '0')}`;
    months.push(formattedDate);

    // Move to the previous month
    currentDate.setMonth(currentDate.getMonth() - multiple);
  }

  return months;
}

export function getWeeksBetweenDates(startDateStr, endDateStr, multiple) {
  // Parse the input strings into Date objects, preserving UTC
  let startDate = new Date(startDateStr);
  let endDate = new Date(endDateStr);

  // Ensure startDate is earlier than endDate
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  const weeks = [];

  // Function to get the start of the week (Monday) for a given date
  function getWeekStart(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.getFullYear(), d.getMonth(), diff);
  }

  // Function to format date as YYYY-MM-DD
  function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // Start from the end date
  const currentDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
  );
  let weekCounter = 0;
  let firstWeekIncluded = false;

  while (currentDate >= startDate) {
    let weekStart = getWeekStart(currentDate);
    let weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Adjust weekStart if it's before the startDate
    if (weekStart < startDate) {
      weekStart = new Date(startDate);
    }

    // Adjust weekEnd if it's after the endDate
    if (weekEnd > endDate) {
      weekEnd = new Date(endDate);
    }

    // Always include the first week that contains the start date
    if (!firstWeekIncluded && weekStart <= startDate && startDate <= weekEnd) {
      weeks.push(`${formatDate(weekStart)}/${formatDate(weekEnd)}`);
      firstWeekIncluded = true;
    } else if (weekCounter % multiple === 0) {
      const formattedWeek = `${formatDate(weekStart)}/${formatDate(weekEnd)}`;

      // Only add the week if it's not already in the array
      if (weeks.length === 0 || weeks[weeks.length - 1] !== formattedWeek) {
        weeks.push(formattedWeek);
      }
    }

    // Move to the previous week and increment the counter
    currentDate.setDate(currentDate.getDate() - 7);
    weekCounter += 1;
  }

  return weeks;
}

export function groupDataByYearRanges(data, yearRanges, locale = 'en-US') {
  const { sortedRanges: sortedYears, rangesCopy: yearRangesCopy } =
    getSortedRanges(yearRanges);

  if (!itemExists(yearRangesCopy)) return {};

  // Prepare date formatter for the items
  const yearFormatter = new Intl.DateTimeFormat(locale, { year: 'numeric' });

  // Helper function to format date to YYYY
  const formatYear = (date) => yearFormatter.format(date);

  // Helper function to find the correct group for a given year
  const findCorrectGroup = (itemYear) => {
    let currentGroup = sortedYears[0];
    for (let i = 1; i < sortedYears.length; i += 1) {
      if (itemYear > sortedYears[i]) {
        return currentGroup;
      }
      currentGroup = sortedYears[i];
    }
    return currentGroup;
  };

  // Group data into year ranges
  data.forEach((item) => {
    const itemDate = new Date(item.date);
    const itemYear = formatYear(itemDate);
    const targetYear = findCorrectGroup(itemYear);
    yearRangesCopy[targetYear].push(item);
  });

  // Remove empty years
  const finalResult = {};
  sortedYears.forEach((year) => {
    if (yearRangesCopy[year].length > 0) {
      finalResult[year] = yearRangesCopy[year];
    }
  });

  return finalResult;
}

export function groupDataByMonthRanges(data, monthRanges, locale = 'en-US') {
  const { sortedRanges: sortedMonths, rangesCopy: monthRangesCopy } =
    getSortedRanges(monthRanges);

  if (!itemExists(monthRangesCopy)) return {};

  // Prepare date formatters for the items
  const yearFormatter = new Intl.DateTimeFormat(locale, { year: 'numeric' });
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: '2-digit' });

  // Helper function to format date to YYYY-MM
  const formatYearMonth = (date) => {
    const year = yearFormatter.format(date);
    const month = monthFormatter.format(date);
    return `${year}-${month}`;
  };

  // Helper function to find the correct group for a given month
  const findCorrectGroup = (itemMonth) => {
    let currentGroup = sortedMonths[0];
    for (let i = 1; i < sortedMonths.length; i += 1) {
      if (itemMonth > sortedMonths[i]) {
        return currentGroup;
      }
      currentGroup = sortedMonths[i];
    }
    return currentGroup;
  };

  // Group data into month ranges
  data.forEach((item) => {
    const itemDate = new Date(item.date);
    const itemMonth = formatYearMonth(itemDate);
    const targetMonth = findCorrectGroup(itemMonth);
    monthRangesCopy[targetMonth].push(item);
  });

  // Remove empty months
  const finalResult = {};
  sortedMonths.forEach((month) => {
    if (monthRangesCopy[month].length > 0) {
      finalResult[month] = monthRangesCopy[month];
    }
  });

  return finalResult;
}

export function groupDataByWeekRanges(data, weekRanges) {
  // Create a copy of weekRanges to avoid modifying the original
  const weekRangesCopy = Object.fromEntries(
    Object.entries(weekRanges).map(([range, arr]) => [range, [...arr]]),
  );

  if (!itemExists(weekRangesCopy)) return {};

  // Parse date strings to Date objects in local time
  const parseDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Sort week ranges in descending order based on end date
  const sortedWeekRanges = Object.keys(weekRangesCopy).sort((a, b) => {
    const dateA = parseDate(a.split('/')[1]);
    const dateB = parseDate(b.split('/')[1]);
    return dateB - dateA;
  });

  // Helper function to find the correct group for a given date
  const findCorrectGroup = (itemDate) => {
    for (let i = 0; i < sortedWeekRanges.length; i += 1) {
      const currentRangeEnd = parseDate(sortedWeekRanges[i].split('/')[1]);
      if (itemDate <= currentRangeEnd && sortedWeekRanges[i + 1]) {
        const nextRangeEnd = parseDate(sortedWeekRanges[i + 1].split('/')[1]);
        if (itemDate > nextRangeEnd) {
          return sortedWeekRanges[i];
        }
      }
    }
    // If the date is before all ranges, return the last range
    return sortedWeekRanges[sortedWeekRanges.length - 1];
  };

  // Group data into week ranges
  data.forEach((item) => {
    // Convert the item's date to local time
    const itemDate = new Date(item.date);
    const localItemDate = new Date(
      itemDate.getFullYear(),
      itemDate.getMonth(),
      itemDate.getDate(),
    );
    const targetRange = findCorrectGroup(localItemDate);
    weekRangesCopy[targetRange].push(item);
  });

  // Remove empty ranges and ensure original order
  const finalResult = {};
  sortedWeekRanges.forEach((range) => {
    if (weekRangesCopy[range].length > 0) {
      finalResult[range] = weekRangesCopy[range];
    }
  });

  return finalResult;
}
