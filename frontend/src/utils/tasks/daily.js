export const getCompletionPercentage = (objects) => {
  if (objects.length === 0) {
    return 0; // Return 0 if the array is empty to avoid division by zero
  }

  const completedCount = objects.filter((obj) => obj.completed === true).length;
  const totalCount = objects.length;
  const percentage = (completedCount / totalCount) * 100;

  return parseFloat(percentage.toFixed(2)); // Round to two decimal places
};
