import { apiClient, filterEmptyString } from "@/utils/api";

const apiNewsBaseV2Url = "";

export const getAllEventCreatedByUser = async (filter: any) => {
  const result = await apiClient.get<any>(`${apiNewsBaseV2Url}/event/search/`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const deleteEventCreatedByUser = async (event_id: string) => {
  const result = await apiClient.delete<any>(`${apiNewsBaseV2Url}/event/${event_id}`);
  return result.data;
};

export const updateEventCreatedByUser = async (event_id: string, data: any) => {
  const result = await apiClient.put(`${apiNewsBaseV2Url}/event/${event_id}`, data);
  return result.data;
};
