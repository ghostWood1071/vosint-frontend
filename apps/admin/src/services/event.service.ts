import { BASE_URL_SUM } from "@/constants/config";
import { IEventDTO, IEventSummaryDTO, TEvents } from "@/models/event.type";
import { apiClient, filterEmptyString } from "@/utils/api";

const getEvent = async (id: string) => {
  const result = await apiClient.get(`/event/detail/${id}`);
  return result.data;
};

const getEventTTXVN = async (queryString: string) => {
  const result = await apiClient.get(`/event/ttxvn?${queryString}`);
  return result.data;
};

const getEvents = async (filter: Record<string, any>) => {
  const result = await apiClient.get<TEvents>(`/event`, {
    params: filter,
  });
  return result.data;
};

const getAllEventCreatedByUser = async (filter: any) => {
  const result = await apiClient.get<any>(`/event/search`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

const getEventByIdNews = async (newsId: string) => {
  const result = await apiClient.get<any>(`/event/news/${newsId}`);
  return result.data;
};

const getAllEventNews = async (filter: any) => {
  const result = await apiClient.get<any>(`/event/search`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getKhachTheAndChuThe = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/event/get-chu-the-khach-the`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getEventBaseOnKhachTheAndChuThe = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/event/search-based-chu-the-khach-the`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const createEvent = async (data: IEventDTO) => {
  const result = await apiClient.post(`/event`, data);
  return result.data;
};

const createEventFromUser = async (data: any) => {
  const result = await apiClient.post<any>(`/event`, data);
  return result.data;
};

const createEventNews = async (data: any) => {
  const result = await apiClient.post<any>(`/event`, data);
  return result.data;
};

const AddManyEventToNews = async (data: any, news_id: string) => {
  const result = await apiClient.put<any>(`/event/add-event/${news_id}`, data);
  return result.data;
};

const updateEvent = async (id: string, data: any) => {
  const result = await apiClient.put(`/event/${id}`, data);
  return result.data;
};

const cloneSystemEventToUserEvent = async (event_id: string) => {
  const result = await apiClient.put(`/event/clone-event/${event_id}`, "");
  return result;
};

const updateEventCreatedByUser = async (event_id: string, data: any) => {
  const result = await apiClient.put(`/event/${event_id}`, data);
  return result.data;
};

const updateEventNews = async (event_id: string, data: any) => {
  const result = await apiClient.put(`/event/${event_id}`, data);
  return result.data;
};

const removeNewsInEvent = async (id: string, data: string[]) => {
  const result = await apiClient.put(`/event/remove-new/${id}`, data);
  return result.data;
};

const deleteEventCreatedByUser = async (event_id: string) => {
  const result = await apiClient.delete<any>(`/event/${event_id}`);
  return result.data;
};

const deleteEventNews = async (news_id: string, data: any) => {
  const result = await apiClient.put<any>(`/event/remove-event/${news_id}`, data);
  return result.data;
};

const exportEvents = async (data: any) => {
  const result = await apiClient.post<any>(`/event/export-to-word`, data, {
    headers: { "Access-Control-Expose-Headers": "Content-Disposition" },
    responseType: "blob",
  });
  return result.data;
};

const generateSystemEventNews = async (news_id: string) => {
  const result = await apiClient.post(`/Event/extract_event`, "", {
    params: {
      Id_news: news_id,
    },
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    },
  });
  return result.data;
};

export {
  getEvent,
  getEventTTXVN,
  getEvents,
  getAllEventCreatedByUser,
  getEventByIdNews,
  getAllEventNews,
  getKhachTheAndChuThe,
  getEventBaseOnKhachTheAndChuThe,
  createEvent,
  createEventFromUser,
  createEventNews,
  AddManyEventToNews,
  updateEvent,
  updateEventNews,
  updateEventCreatedByUser,
  cloneSystemEventToUserEvent,
  removeNewsInEvent,
  deleteEventCreatedByUser,
  deleteEventNews,
  exportEvents,
  generateSystemEventNews,
};
