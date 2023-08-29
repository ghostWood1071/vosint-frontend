import { IChangePasswordDTO } from "@/models/auth.type";
import { apiClient } from "@/utils/api";

const loginAuth = async (data: any) => {
  const result = await apiClient.post(`/login`, data);
  return result.data;
};

const changePassword = async (data: IChangePasswordDTO) => {
  return apiClient.put(`/change-password`, data).then((res) => res.data);
};

export { loginAuth, changePassword };
