import { isCurrentMonth } from './date';
import { ALL_OPTION } from './misc';

export const filterDataAccordingToPbDate = (data, date = new Date()) =>
  data.filter((el) => isCurrentMonth(new Date(el.date), date));

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
  date,
  valueField,
) =>
  data.map((el) => ({
    title: el[titleField],
    type: 'bar',
    data: [{ x: date, y: el[valueField] }],
  }));
