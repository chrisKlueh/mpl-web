//validates groupName filled
export const validateGroupName = (values) => {
  const errors = {};
  if (!values.group_name) {
    errors.group_name = "Required";
  }
  return errors;
};

//validates password filled
export const validatePassword = (
  values,
  hasPasswordConfirmation,
  discloseRequiredChars
) => {
  const errors = {};
  if (!values.password) {
    errors.password = "Required";
  } else if (discloseRequiredChars && !(values.password.length >= 8)) {
    errors.password = "Password too short";
  }
  if (hasPasswordConfirmation) {
    if (!values.confirm_password) {
      errors.confirm_password = "Required";
    } else if (values.password !== values.confirm_password) {
      errors.confirm_password = "Confirmation does not match";
    }
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
