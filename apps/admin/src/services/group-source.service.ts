import { apiClient, filterEmptyString } from "@/utils/api";

const apiGroupSourceConfigBaseV2Url = "";

export const getGroupSource = async (filter: any) => {
  const result = await apiClient.get<any>(
    `${apiGroupSourceConfigBaseV2Url}/Source-group/${filter.text_search}`,
    {
      params: filterEmptyString(filter),
    },
  );
  return result.data;
};

export const addGroupSource = async (data: any) => {
  const result = await apiClient.post<any>(`${apiGroupSourceConfigBaseV2Url}/Source-group/`, data);
  return result.data;
};

export const deleteGroupSource = async (groupId: string) => {
  const result = await apiClient.delete<any>(
    `${apiGroupSourceConfigBaseV2Url}/Source-group/${groupId}`,
  );
  return result.data;
};

export const updateGroupSource = async (groupId: string, data: any) => {
  const result = await apiClient.put(
    `${apiGroupSourceConfigBaseV2Url}/Source-group/${groupId}`,
    data,
  );
  return result.data;
};
