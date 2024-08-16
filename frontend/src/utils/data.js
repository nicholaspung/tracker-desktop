import jmespath from 'jmespath';
import {
  addPbRecord,
  deletePbRecord,
  fetchPbRecordList,
  updatePbRecord,
} from './api';
import { SELECT_TYPES, TABLE_DISPLAY_TYPES } from '../lib/display';

export const transformer = (el, config) => {
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

  if (Array.isArray(data)) {
    if (!data.items) {
      return data.map((el) => dataTransformer(el, config));
    }

    return data.items.map((el) => dataTransformer(el, config));
  }
  return [];
}

function pbRecordToUseCollectionData(data, dataTransformer, config) {
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
    expandFields: Array.isArray(config.columns)
      ? config.columns
          .filter((el) => el.expandFields)
          .map((ele) => ele.expandFields)
      : undefined,
    sort: config.sort,
  });
  if (!data) return null;
  if (data.name === 'ClientResponseError 0') return null;

  const transformedData = pbRecordsToUseCollectionData(
    data,
    transformer,
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

const transformDataToPbRecordData = (config, data, stores) => {
  const dataCopy = { ...data };
  config.columns.forEach((column) => {
    if (column.type === TABLE_DISPLAY_TYPES.DATE) {
      const dataDate = new Date(dataCopy[column.id]);
      const year = dataDate.getFullYear();
      const month = dataDate.getMonth();
      const day = dataDate.getDate();
      const now = new Date();
      const hour = now.getHours();
      const min = now.getMinutes();
      dataCopy[column.id] = new Date(year, month, day, hour, min).toISOString();
    }
    if (column.store && dataCopy[column.id]) {
      if (column.selectType === SELECT_TYPES.SINGLE) {
        const value = column.autoSuggestFieldIds
          ? data[column.id]
          : dataCopy[column.id].value;
        const record = stores[column.store].find(
          (el) => el[column.storeField] === value,
        );
        dataCopy[column.expandFields] = record.id;
      } else {
        dataCopy[column.expandFields] = dataCopy[column.id].map((dataValue) => {
          const record = stores[column.store].find(
            (el) => el[column.storeField] === dataValue.value,
          );
          return record.id;
        });
      }
    }
  });
  return dataCopy;
};

export const addData = async (
  pb,
  config,
  { newData, addItemToStore, stores },
) => {
  // Replace relational data with correct id
  const newPbData = transformDataToPbRecordData(config, newData, stores);

  const data = await addPbRecord(pb, {
    collectionName: config.collection,
    body: newPbData,
    expandFields: config.columns
      .filter((el) => el.expandFields)
      .map((ele) => ele.expandFields),
  });
  if (!data) return null;
  if (data.name === 'ClientResponseError 0') return null;

  const transformedData = pbRecordToUseCollectionData(
    data,
    transformer,
    config,
  );
  if (!addItemToStore) {
    return transformedData;
  }
  await addItemToStore(config.collection, transformedData);
  return transformedData;
};

export const updateData = async (
  pb,
  config,
  { updatedData, replaceItemInStore, stores },
) => {
  if (!updatedData) return null;

  const updatedPbData = transformDataToPbRecordData(
    config,
    updatedData,
    stores,
  );

  const data = await updatePbRecord(
    pb,
    {
      collectionName: config.collection,
      id: updatedPbData.id,
      body: updatedPbData,
      expandFields: config.columns
        .filter((el) => el.expandFields)
        .map((ele) => ele.expandFields),
    },
    true,
  );

  if (!data) return null;
  if (data.name === 'ClientResponseError 0') return null;

  const transformedData = pbRecordToUseCollectionData(
    data,
    transformer,
    config,
  );
  if (!replaceItemInStore) {
    return transformedData;
  }
  await replaceItemInStore(config.collection, transformedData);
  return transformedData;
};

export const deleteData = async (pb, config, { id, removeItemInStore }) => {
  if (!id) return null;

  const data = await deletePbRecord(pb, {
    collectionName: config.collection,
    id,
  });
  if (data && data.name === 'ClientResponseError 0') return null;

  await removeItemInStore(config.collection, id);
  return data;
};
