export async function fetchPbRecordList(pb, { collectionName }, debug = false) {
  try {
    const resultList = await pb.collection(collectionName).getFullList();
    if (debug) {
      console.log('fetch api', resultList);
    }
    return resultList;
  } catch (err) {
    if (debug) {
      console.error('fetch api', err);
    }
    return err;
  }
}

export async function updatePbRecord(
  pb,
  { collectionName, id, body },
  debug = false,
) {
  try {
    const result = await pb.collection(collectionName).update(id, body);
    if (debug) {
      console.log('update api', result);
    }
    return result;
  } catch (err) {
    if (debug) {
      console.error('update api', err);
    }
    return err;
  }
}
