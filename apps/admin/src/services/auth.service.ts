import { apiClient } from "@/utils/api";

import { IChangePasswordDto } from "./auth.type";

export const loginAuth = async (data: any) => {
  const url = `/login`;
  const result = await apiClient.post(url, data);
  return result.data;
};

export const getMe = async () => {
  const url = `/user/me`;
  const result = await apiClient.get(url);
  return result.data;
};

export const changePassword = async (data: IChangePasswordDto) => {
  const url = `/change-password`;
  return apiClient.put(url, data).then((res) => res.data);
};
