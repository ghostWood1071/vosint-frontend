import { apiClient } from "@/utils/api";

export const getUserManager = async () => {
  const result = await apiClient.get<any>(`/user-manager`);
  return result.data;
};
