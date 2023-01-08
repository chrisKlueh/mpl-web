export const validateTitle = (values) => {
  const errors = {};
  if (!values.title) {
    errors.title = "Required";
  } else if (values.title.length > 40) {
    errors.title = "Maximum allowed length is 40 characters";
  }
  return errors;
};
export const validateShortDesc = (values) => {
  const errors = {};
  if (!values.short_desc) {
    errors.short_desc = "Required";
  } else if (values.short_desc.length > 40) {
    errors.short_desc = "Maximum allowed length is 40 characters";
  }
  return errors;
};
export const validateDetailDesc = (values) => {
  const errors = {};
  if (!values.detail_desc) {
    errors.detail_desc = "Required";
  } else if (values.detail_desc.length > 240) {
    errors.detail_desc = "Maximum allowed length is 240 characters";
  }
  return errors;
};

// export const validateDemoFiles = (values) => {
//   const errors = {};
//   if (!values.demoFiles) {
//     errors.demoFiles = "Required";
//   } else if (values.demoFiles.length > 1) {
//     errors.demoFiles = "Please upload exactly one file";
//   }
//   return errors;
// };

export const validateAll = (values) => {
  const titleErrors = validateTitle(values);
  const shortDescErrors = validateShortDesc(values);
  const detailDescErrors = validateDetailDesc(values);
  // const demoFilesErrors = validateDemoFiles(values);

  return {
    ...titleErrors,
    ...shortDescErrors,
    ...detailDescErrors,
    // ...demoFilesErrors,
  };
};
