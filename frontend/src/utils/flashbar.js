export const createFlashbarItem = ({
  type,
  dismissible = true,
  setFlashbarItems,
  header,
  content,
  id,
}) => ({
  type,
  dismissible,
  dismissLabel: 'Dismiss message',
  onDismiss: setFlashbarItems,
  content,
  header,
  id,
});

export const isPbClientError = (err) =>
  err.name &&
  typeof err.name === 'string' &&
  err.name.includes('ClientResponseError');
