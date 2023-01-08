export const formatIsoDate = (isoDateString, includeTime) => {
  const date = new Date(isoDateString);
  if (includeTime === undefined || includeTime === true) {
    return (
      addPadding(date.getDate(), 2) +
      "." +
      addPadding(date.getMonth() + 1, 2) +
      "." +
      date.getFullYear() +
      ", " +
      addPadding(date.getHours(), 2) +
      ":" +
      addPadding(date.getMinutes(), 2) +
      ":" +
      addPadding(date.getSeconds(), 2)
    );
  } else {
    return (
      addPadding(date.getDate(), 2) +
      "." +
      addPadding(date.getMonth() + 1, 2) +
      "." +
      date.getFullYear()
    );
  }
};

const addPadding = (string, desiredLength) => {
  string = string.toString();
  while (string.length < desiredLength) {
    string = "0" + string;
  }
  return string;
};

export const shortenString = (string, maxLength) => {
  return maxLength > 3 ? string.substring(0, maxLength - 3) + "..." : string;
};
