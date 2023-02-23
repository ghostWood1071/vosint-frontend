import { apiClient } from "@/utils/api";

const apiAuthBaseUrl = "/v2";

export const loginAuth = async (data: any) => {
  const url = `${apiAuthBaseUrl}/login`;
  const result = await apiClient.post(url, data);
  return result.data;
};

export const getMe = async () => {
  const url = `${apiAuthBaseUrl}/user/me`;
  const result = await apiClient.get(url);
  return result.data;
};
