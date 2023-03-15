import { apiClient, filterEmptyString } from "@/utils/api";

const apiPriorityObjectBaseV2Url = "/v2";

export const gePriorityObject = async (filter: any) => {
  const result = await apiClient.get<any>(`user/interested/${filter.type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const addPriorityObject = async (data: any) => {
  const result = await apiClient.post<any>(`${apiPriorityObjectBaseV2Url}/user/interested`, data);
  return result.data;
};

export const deletePriorityObject = async (priorityObjectId: string) => {
  const result = await apiClient.delete<any>(
    `${apiPriorityObjectBaseV2Url}/user/interested/${priorityObjectId}`,
  );
  return result.data;
};

// export const updatePriorityObject = async (priorityObjectId: string, data: any) => {
//   const result = await apiClient.put(
//     `${apiPriorityObjectBaseV2Url}/user/interested/${priorityObjectId}`,
//     data,
//   );
//   return result.data;
// };
