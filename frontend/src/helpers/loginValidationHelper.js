//validates username corresponding to fd-code (= fdai + arbitrary amount of numbers)
export const validateUsername = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = "Required";
  } /* else if (!/^fdai[0-9]+$/i.test(values.username)) {
    errors.username = "Invalid fd code";
  } */
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

//merges validateUsername and validatePassword error objects
export const validateUsernameAndPasswords = (
  values,
  hasPasswordConfirmation,
  discloseRequiredChars
) => {
  const usernameErrors = validateUsername(values);
  const passwordErrors = validatePassword(
    values,
    hasPasswordConfirmation,
    discloseRequiredChars
  );
  return { ...usernameErrors, ...passwordErrors };
};
