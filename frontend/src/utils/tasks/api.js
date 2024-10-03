import { COLLECTION_NAMES } from '../../lib/collections';
import { fetchPbRecordList, updatePbRecord } from '../api';

export const fetchHabits = async (pb, setDataInStore) => {
  const result = await fetchPbRecordList(pb, {
    collectionName: COLLECTION_NAMES.HABITS,
    sort: '-updated',
  });
  if (result.length) {
    setDataInStore(COLLECTION_NAMES.HABITS, result);
  }
  return true;
};

export const fetchDailies = async (pb, setDataInStore) => {
  const result = await fetchPbRecordList(pb, {
    collectionName: COLLECTION_NAMES.DAILIES,
    sort: '-updated',
    expandFields: ['current_relation'],
  });
  if (result.length) {
    setDataInStore(COLLECTION_NAMES.DAILIES, result);
  }
  return true;
};

export const updateDaily = async (pb, replaceItemInStore, daily) => {
  const record = await updatePbRecord(pb, {
    collectionName: COLLECTION_NAMES.DAILIES,
    id: daily.id,
    expandFields: ['current_relation'],
    body: {
      completed: !daily.completed,
    },
  });
  if (record) {
    replaceItemInStore(COLLECTION_NAMES.DAILIES, record);
  }
};
