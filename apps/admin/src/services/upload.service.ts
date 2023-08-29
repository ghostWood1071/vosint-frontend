import { apiClient, filterEmptyString } from "@/utils/api";

//upload image
const uploadFile = async (data: any) => {
  const result = await apiClient.post(`/upload`, data, {
    headers: {
      accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
  return result;
};

export { uploadFile };
