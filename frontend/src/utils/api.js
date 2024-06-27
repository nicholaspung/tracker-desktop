export async function fetchPbRecordList(
  pb,
  { collectionName, expandFields, sort },
  debug = false,
) {
  if (!collectionName) return [];
  try {
    const options = {
      expand: expandFields ? expandFields.join(',') : undefined,
      sort: sort || undefined,
    };
    Object.keys(options).forEach((key) => {
      if (!options[key]) {
        delete options[key];
      }
    });
    let resultList;
    if (Object.keys(options).length) {
      resultList = await pb.collection(collectionName).getFullList(options);
    } else {
      resultList = await pb.collection(collectionName).getFullList();
    }
    if (debug) {
      console.log('fetch api', resultList);
    }

    if (!resultList || resultList.name === 'ClientResponseError 0') {
      throw new Error(`Failed to fetch data for ${collectionName}`);
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
