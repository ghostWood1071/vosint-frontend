import { apiClient, filterEmptyString } from "@/utils/api";

const getGroupSource = async (filter: any) => {
  const result = await apiClient.get<any>(`/Source-group`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const addGroupSource = async (data: any) => {
  const result = await apiClient.post<any>(`/Source-group`, data);
  return result.data;
};

const updateGroupSource = async (groupId: string, data: any) => {
  const result = await apiClient.put(`/Source-group/${groupId}`, data);
  return result.data;
};

const deleteGroupSource = async (groupId: string) => {
  const result = await apiClient.delete<any>(`/Source-group/${groupId}`);
  return result.data;
};

export { getGroupSource, addGroupSource, updateGroupSource, deleteGroupSource };
