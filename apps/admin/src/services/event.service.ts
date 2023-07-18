import { apiClient, filterEmptyString } from "@/utils/api";

export const getAllEventCreatedByUser = async (filter: any) => {
  const result = await apiClient.get<any>(`/event/search`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const deleteEventCreatedByUser = async (event_id: string) => {
  const result = await apiClient.delete<any>(`/event/${event_id}`);
  return result.data;
};

export const updateEventCreatedByUser = async (event_id: string, data: any) => {
  const result = await apiClient.put(`/event/${event_id}`, data);
  return result.data;
};

export const createEventFromUser = async (data: any) => {
  const result = await apiClient.post<any>(`/event`, data);
  return result.data;
};

export const cloneSystemEventToUserEvent = async (event_id: string) => {
  const result = await apiClient.put(`/event/clone-event/${event_id}`, "");
  return result;
};
