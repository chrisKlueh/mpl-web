export const truncateString = (string, maxLength) => {
  return string.length > maxLength
    ? string.slice(0, maxLength) + "..."
    : string;
};

export const getSelectedPage = (list, page, rowsPerPage) => {
  const startIndex = page * rowsPerPage;
  return list.slice(startIndex, startIndex + rowsPerPage);
};

export const getMaxAmountOfPages = (list, rowsPerPage) =>
  Math.ceil(list.length / rowsPerPage);
