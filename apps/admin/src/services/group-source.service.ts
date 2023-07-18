import { apiClient, filterEmptyString } from "@/utils/api";

export const getGroupSource = async (filter: any) => {
  const result = await apiClient.get<any>(`/Source-group`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const addGroupSource = async (data: any) => {
  const result = await apiClient.post<any>(`/Source-group`, data);
  return result.data;
};

export const deleteGroupSource = async (groupId: string) => {
  const result = await apiClient.delete<any>(`/Source-group/${groupId}`);
  return result.data;
};

export const updateGroupSource = async (groupId: string, data: any) => {
  const result = await apiClient.put(`/Source-group/${groupId}`, data);
  return result.data;
};
