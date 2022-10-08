export const truncateString = (string, maxLength) => {
  return string.length > maxLength
    ? string.slice(0, maxLength) + "..."
    : string;
};
