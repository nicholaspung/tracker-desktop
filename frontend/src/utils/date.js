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
  if (dateObj2.getFullYear() !== dateObj1.getFullYear()) {
    return false;
  }
  if (dateObj2.getMonth() !== dateObj1.getMonth()) {
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
