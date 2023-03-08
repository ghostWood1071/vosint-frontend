import { apiClient } from "@/utils/api";

import { IChangePasswordDto } from "./auth.type";

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

export const changePassword = async (data: IChangePasswordDto) => {
  const url = `${apiAuthBaseUrl}/change-password`;
  return apiClient.put(url, data).then((res) => res.data);
};
