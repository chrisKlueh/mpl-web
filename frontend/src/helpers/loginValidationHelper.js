//validates groupName filled
export const validateGroupName = (values, discloseRequiredLength) => {
  const errors = {};
  if (!values.group_name) {
    errors.group_name = "Required";
  } else if (discloseRequiredLength && values.group_name.length > 50) {
    errors.group_name = "Group name too long";
  }
  return errors;
};

//validates password filled
export const validatePassword = (
  values,
  hasPasswordConfirmation,
  discloseRequiredLength
) => {
  const errors = {};
  if (!values.password) {
    errors.password = "Required";
  } else if (discloseRequiredLength && !(values.password.length >= 8)) {
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
  discloseRequiredLength
) => {
  const groupNameErrors = validateGroupName(values, discloseRequiredLength);
  const passwordErrors = validatePassword(
    values,
    hasPasswordConfirmation,
    discloseRequiredLength
  );
  return { ...groupNameErrors, ...passwordErrors };
};
