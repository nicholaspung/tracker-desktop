export function pbRecordToUseCollectionData(data, dataTransformer) {
  if (!data) {
    return [];
  }

  if (!data.items) {
    return data.map((el) => dataTransformer(el));
  }

  return data.items.map((el) => dataTransformer(el));
}
