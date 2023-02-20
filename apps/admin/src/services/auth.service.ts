import { apiClient } from "@/utils/api";

// const apiAuthBaseUrl = "/v2";
const apiAuthBaseUrl = "";

export const loginAuth = async (data: any) => {
  const url = `${apiAuthBaseUrl}/login`;
  const result = await apiClient.post(url, data);
  return result.data;
};
