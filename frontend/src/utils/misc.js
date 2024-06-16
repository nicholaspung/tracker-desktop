export const ALL_OPTION = { label: 'all', value: 'all' };

export const toOptions = (data, field) => {
  if (Array.isArray(data) && field) {
    return data.map((el) => ({ label: el[field], value: el[field] }));
  }
  if (Array.isArray(data)) {
    return data.map((el) => ({ label: el, value: el }));
  }
  if (field) {
    return { label: data[field], value: data[field] };
  }
  return { label: data, value: data };
};
