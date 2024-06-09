const isDate = (arg) => arg instanceof Date;

export const dateToDatePickerMonth = (dateObj = new Date()) => {
  if (!isDate) {
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
  if (!isDate) {
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
      firstYear: now.getUTCFullYear(),
      firstMonth: now.getUTCMonth() + 1,
      firstDay: now.getUTCDate(),
    };
  }
  const first = data[data.length - 1][dateField];
  const firstDate = new Date(first);
  return {
    firstYear: firstDate.getUTCFullYear(),
    firstMonth: firstDate.getUTCMonth() + 1,
    firstDay: firstDate.getUTCDate(),
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
  return date <= new Date() && date >= new Date(dateString);
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
