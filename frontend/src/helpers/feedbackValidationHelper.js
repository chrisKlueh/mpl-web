export const validateType = (values) => {
  const errors = {};
  if (!values.feedbackType) {
    errors.feedbackType = "Required";
  }
  return errors;
};

export const validateFeedback = (values) => {
  const errors = {};
  if (!values.feedback) {
    errors.feedback = "Required";
  } else if (values.feedback.length > 240) {
    errors.feedback = "Maximum allowed length is 240 characters";
  }
  return errors;
};

export const validateAll = (values) => {
  const feedbackTypeErrors = validateType(values);
  const feedbackErrors = validateFeedback(values);

  return {
    ...feedbackTypeErrors,
    ...feedbackErrors,
  };
};
