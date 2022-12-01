export const required = value => {
  let errorMessage;
  if (!value || value.toString().trim().length === 0) {
    errorMessage = 'required';
  }
  return errorMessage;
};
