export const ALL_OPTION = { label: 'all', value: 'all' };

export const toOptions = (data, field) =>
  data.map((el) => ({ label: el[field], value: el[field] }));
