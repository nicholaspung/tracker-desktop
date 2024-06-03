import jmespath from 'jmespath';
import { fetchPbRecordList } from './api';
import { isCurrentMonth } from './date';
import { ALL_OPTION } from './misc';

export function pbRecordToUseCollectionData(data, dataTransformer) {
  if (!data) {
    return [];
  }

  if (!data.items) {
    return data.map((el) => dataTransformer(el));
  }

  return data.items.map((el) => dataTransformer(el));
}

export const getListData = async (
  pb,
  collection,
  columns,
  { prevData, setData } = {},
) => {
  const data = await fetchPbRecordList(pb, {
    collectionName: collection,
    expandFields: columns
      .filter((el) => el.expandFields)
      .map((ele) => ele.expandFields),
  });
  if (!data) return null;
  if (data.name === 'ClientResponseError 0') return null;

  const transfomer = (el) => {
    const transform = {};
    columns.forEach((ele) => {
      const { id } = ele;
      if (!transform[id]) {
        if (ele.expandPath) {
          transform[id] = jmespath.search(el, ele.expandPath);
        } else {
          transform[id] = el[id];
        }
      }
    });
    return transform;
  };

  const transformedData = pbRecordToUseCollectionData(data, transfomer);

  if (!prevData || !setData) {
    return transformedData;
  }
  if (JSON.stringify(transformedData) !== JSON.stringify(prevData)) {
    setData(collection, transformedData);
  }
  return transformedData;
};

export const filterDataAccordingToPbDate = (data, date = new Date()) =>
  data.filter((el) => isCurrentMonth(new Date(el.date), date));

export const filterDataAccoringToField = (data, field, selection) => {
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
