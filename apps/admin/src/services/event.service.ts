import { apiClient, filterEmptyString } from "@/utils/api";
import { IEventSummaryDTO } from "./event.type";
import { BASE_URL_SUMM } from "@/constants/config";
import { INewsSummaryDto } from "./news.type";

export const getEventSummary = async ({ k, ...data }: IEventSummaryDTO) => {
  const query = new URLSearchParams({ k })
  // const newParas = data.paras.replaceAll("..", ".\n\n");
  // data.paras = newParas;

  return apiClient
    .post(`${BASE_URL_SUMM}/summary/?${query.toString()}`, data)
    // .post(`http://vosint.aiacademy.edu.vn/summary/?${query.toString()}`, data)
    // .post(`http://sumthesis.aiacademy.edu.vn/ext`, data)
    .then((res) => res.data);
};

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
