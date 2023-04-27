export const removeWhitespaceInStartAndEndOfString = (params: Record<string, any>) => {
  const result: Record<string, any> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") {
      result[key] = value.trim();
    } else {
      result[key] = value;
    }
  });

  return result;
};
