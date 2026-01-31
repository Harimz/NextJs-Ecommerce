export const toLowerUpper = (value: string) => {
  return value
    .toLowerCase()
    .replace(value.charAt(0), value.charAt(0).toUpperCase());
};
