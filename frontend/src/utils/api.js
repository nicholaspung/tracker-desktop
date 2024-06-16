export async function fetchPbRecordList(
  pb,
  { collectionName, expandFields, sort },
  debug = false,
) {
  try {
    const resultList = await pb.collection(collectionName).getFullList({
      expand: expandFields ? expandFields.join(',') : null,
      sort,
    });
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
  { collectionName, id, body, expandFields },
  debug = false,
) {
  try {
    const result = await pb.collection(collectionName).update(id, body, {
      expand: expandFields ? expandFields.join(',') : null,
    });
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

export async function addPbRecord(
  pb,
  { collectionName, body, expandFields },
  debug = false,
) {
  try {
    const result = await pb.collection(collectionName).create(body, {
      expand: expandFields ? expandFields.join(',') : null,
    });
    if (debug) {
      console.log('add api', result);
    }
    return result;
  } catch (err) {
    if (debug) {
      console.error('add api', err);
    }
    return err;
  }
}

export async function deletePbRecord(
  pb,
  { collectionName, id },
  debug = false,
) {
  try {
    const result = await pb.collection(collectionName).delete(id);
    if (debug) {
      console.log('delete api', result);
    }
    return result;
  } catch (err) {
    if (debug) {
      console.error('delete api', err);
    }
    return err;
  }
}
