//validates groupName filled
export const validateGroupName = (values) => {
  const errors = {};
  if (!values.group_name) {
    errors.group_name = "Required";
  }
  return errors;
};

//validates password filled
export const validatePassword = (values) => {
  const errors = {};
  if (!values.password) {
    errors.password = "Required";
  }
  return errors;
};

//merges validateGroupName and validatePassword error objects
export const validateGroupNameAndPassword = (
  values,
  hasPasswordConfirmation,
  discloseRequiredChars
) => {
  const groupNameErrors = validateGroupName(values);
  const passwordErrors = validatePassword(
    values,
    hasPasswordConfirmation,
    discloseRequiredChars
  );
  return { ...groupNameErrors, ...passwordErrors };
};
