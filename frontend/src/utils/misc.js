export const ALL_OPTION = { label: 'all', value: 'all' };

export const toOptions = (data, field) => {
  if (field) {
    return data.map((el) => ({ label: el[field], value: el[field] }));
  }
  return data.map((el) => ({ label: el, value: el }));
};
