import { apiClient } from "@/utils/api";

export const getListApp = async () => {
  const result = await apiClient.get<any>(`/list_app`);
  return result.data;
};
