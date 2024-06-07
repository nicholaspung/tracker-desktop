import jmespath from 'jmespath';
import { addPbRecord, fetchPbRecordList } from './api';
import { SELECT_TYPES } from '../lib/display';

const transfomer = (el, config) => {
  const transform = { id: el.id };
  config.columns.forEach((ele) => {
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

export function pbRecordsToUseCollectionData(data, dataTransformer, config) {
  if (!data) {
    return [];
  }

  if (!data.items) {
    return data.map((el) => dataTransformer(el, config));
  }

  return data.items.map((el) => dataTransformer(el, config));
}

export function pbRecordToUseCollectionData(data, dataTransformer, config) {
  if (!data) {
    return {};
  }

  return dataTransformer(data, config);
}

export const getListData = async (
  pb,
  config,
  { prevData, setDataInStore } = {},
) => {
  const data = await fetchPbRecordList(pb, {
    collectionName: config.collection,
    expandFields: config.columns
      .filter((el) => el.expandFields)
      .map((ele) => ele.expandFields),
    sort: config.sort,
  });
  if (!data) return null;
  if (data.name === 'ClientResponseError 0') return null;

  const transformedData = pbRecordsToUseCollectionData(
    data,
    transfomer,
    config,
  );

  if (!prevData || !setDataInStore) {
    return transformedData;
  }
  if (JSON.stringify(transformedData) !== JSON.stringify(prevData)) {
    await setDataInStore(config.collection, transformedData);
  }
  return transformedData;
};

export const addData = async (
  pb,
  config,
  { newData, addItemToStore, stores },
) => {
  // Replace relational data with correct id
  const newDataCopy = { ...newData };
  config.columns.forEach((column) => {
    if (column.store) {
      if (column.selectType === SELECT_TYPES.SINGLE) {
        const record = stores[column.store].find(
          (el) => el[column.storeField] === newDataCopy[column.id].value,
        );
        newDataCopy[column.id] = record.id;
      } else {
        newDataCopy[column.id] = newDataCopy[column.id].map((dataValue) => {
          const record = stores[column.store].find(
            (el) => el[column.storeField] === dataValue.value,
          );
          return record.id;
        });
      }
    }
  });

  const data = await addPbRecord(pb, {
    collectionName: config.collection,
    body: newDataCopy,
    expandFields: config.columns
      .filter((el) => el.expandFields)
      .map((ele) => ele.expandFields),
  });
  if (!data) return null;
  if (data.name === 'ClientResponseError 0') return null;

  const transformedData = pbRecordToUseCollectionData(data, transfomer, config);
  if (!addItemToStore) {
    return transformedData;
  }
  await addItemToStore(config.collection, transformedData);
  return transformedData;
};
