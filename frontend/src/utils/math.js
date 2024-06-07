function checkPositiveNumber(input) {
  if (typeof input !== 'number') {
    return 'Input is not a number';
  }

  if (input >= 0) {
    return true;
  }
  return false;
}

export const totalSumOfDataAccordingToField = (data, sumField) => {
  let total = 0;
  let positive = 0;
  let negative = 0;

  data.forEach((el) => {
    const value = el[sumField];
    total += value;
    if (checkPositiveNumber(value)) {
      positive += value;
    } else {
      negative += value;
    }
  });

  return {
    total,
    positive,
    negative,
  };
};
