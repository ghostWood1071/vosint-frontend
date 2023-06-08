import moment from "moment";

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

export const convertTimeToShowInUI = (time: any) => {
  return moment(time).format("DD/MM/YYYY");
};
