import { COLLECTION_NAMES } from '../../lib/collections';
import { fetchPbRecordList } from '../api';

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
