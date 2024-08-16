const isDate = (arg) => arg instanceof Date;

export const dateToDatePickerMonth = (dateObj = new Date()) => {
  if (!isDate(dateObj)) {
    throw new Error('argument is not an instance of Date()');
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
};

export const isCurrentMonth = (dateObj2, dateObj1 = new Date()) => {
  if (dateObj2.getUTCFullYear() !== dateObj1.getUTCFullYear()) {
    return false;
  }
  if (dateObj2.getUTCMonth() !== dateObj1.getUTCMonth()) {
    return false;
  }

  return true;
};

export const isCurrentYear = (dateObj2, dateObj1 = new Date()) => {
  if (dateObj2.getUTCFullYear() !== dateObj1.getUTCFullYear()) {
    return false;
  }

  return true;
};

export const dateToDatePicker = (dateObj = new Date()) => {
  if (!isDate(dateObj)) {
    throw new Error('argument is not an instance of Date()');
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const generateYearArrayFromYearToThisYear = (year) => {
  const nowYear = new Date().getUTCFullYear();
  const yearArray = Array(nowYear - year + 1)
    .fill('a')
    .map((_, i) => year + i);
  return yearArray;
};

// Assumption is that function will only be used for data pre-sorted
// Last -> First
export const getFirstMonthAndYearFromData = (data, dateField) => {
  if (!data.length) {
    const now = new Date();
    return {
      firstYear: now.getFullYear(),
      firstMonth: now.getMonth() + 1,
      firstDay: now.getDate(),
    };
  }
  const first = data[data.length - 1][dateField];
  const firstDate = new Date(first);
  return {
    firstYear: firstDate.getFullYear(),
    firstMonth: firstDate.getMonth() + 1,
    firstDay: firstDate.getDate(),
  };
};

export const isDateEnabled = (date, { year, month, day }) => {
  let dateString = '';
  if (year) {
    dateString += year;
  }
  if (month) {
    dateString += `-${month}`;
  }
  if (day) {
    dateString += `-${day}`;
  }
  const dataDate = new Date(dateToDatePicker(date));
  return dataDate <= new Date() && dataDate >= new Date(dateString);
};

export const isValidRange = ({ startDate, endDate, year, month, day }) => {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const isValidStartDate = isDateEnabled(startDateObj, { year, month, day });
  const isValidEndDate = isDateEnabled(endDateObj, { year, month, day });

  if (isValidStartDate && isValidEndDate) {
    return {
      valid: true,
    };
  }
  if (!isValidStartDate && !isValidEndDate) {
    // If start and end date are invalid
    return { valid: false, errorMessage: 'Invalid start and end dates' };
  }
  if (isValidStartDate) {
    // If start date is valid, end date is invalid
    return {
      valid: false,
      errorMessage: 'Invalid end date',
    };
  }
  if (isValidEndDate) {
    // If end date is valid, start date is invalid
    return {
      valid: false,
      errorMessage: 'Invalid start date',
    };
  }

  return (
    isDateEnabled(startDateObj, { year, month, day }) &&
    isDateEnabled(endDateObj, { year, month, day })
  );
};

export function findLatestDate(dates) {
  // Check if the array is empty
  if (dates.length === 0) {
    return null; // or you could return undefined, depending on your preference
  }

  // Sort the dates in descending order
  const sortedDates = dates.sort((a, b) =>
    // We can directly compare the strings since they're in 'YYYY-MM-DD' format
    b.localeCompare(a),
  );

  // Return the first (latest) date
  return sortedDates[0];
}

export const pbDateToDisplay = (value) => {
  const dataDate = new Date(value);
  const year = dataDate.getFullYear();
  const month = String(dataDate.getMonth() + 1).padStart(2, '0');
  const day = String(dataDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const cloudscapeDateToCorrectDateValue = (value, isFilter = false) => {
  const now = new Date();
  if (!value) {
    return now;
  }
  const hour = now.getHours();
  const min = now.getMinutes();
  let dataDate;
  if (isFilter) {
    dataDate = new Date(...value.split(' ')[0].split('-'));
  } else {
    dataDate = new Date(...value.split('-'));
  }
  const year = dataDate.getFullYear();
  const month = dataDate.getMonth();
  const day = dataDate.getDate();
  const result = new Date(year, Number(month) - 1, day, hour, min);
  return result;
};
