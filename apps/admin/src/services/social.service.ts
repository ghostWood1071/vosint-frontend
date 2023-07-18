import { apiClient, filterEmptyString } from "@/utils/api";

export const gePriorityObject = async (filter: any) => {
  const result = await apiClient.get<any>(`/user/interested/${filter.type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const addPriorityObject = async (data: any) => {
  const result = await apiClient.post<any>(`/user/interested`, data);
  return result.data;
};

export const deletePriorityObject = async (priorityObjectId: string) => {
  const result = await apiClient.delete<any>(`/user/interested/${priorityObjectId}`);
  return result.data;
};

// export const updatePriorityObject = async (priorityObjectId: string, data: any) => {
//   const result = await apiClient.put(
//     `/user/interested/${priorityObjectId}`,
//     data,
//   );
//   return result.data;
// };

export interface DataFilterSocialPage {
  name: string;
  page_number: Number;
  page_size: Number;
}

export const getSocialPage = async (filter: DataFilterSocialPage) => {
  const result = await apiClient.get(`/Job/api/get_table`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};
