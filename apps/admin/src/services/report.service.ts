import { apiClient, filterEmptyString } from "@/utils/api";

import { IEventDto, IQuickReportDto, IReportDto, TEvents, TReportEventsDto } from "./report-type";

export const createEvent = async (data: IEventDto) => {
  const result = await apiClient.post(`/event`, data);
  return result.data;
};

export const getEvent = async (id: string) => {
  const result = await apiClient.get(`/event/detail/${id}`);
  return result.data;
};

export const getEventTTXVN = async (queryString: string) => {
  const result = await apiClient.get(`/event/ttxvn?${queryString}`);
  return result.data;
};

export const getEvents = async (filter: Record<string, any>) => {
  const result = await apiClient.get<TEvents>(`/event`, {
    params: filter,
  });
  return result.data;
};

export const updateEvent = async (id: string, data: any) => {
  const result = await apiClient.put(`/event/${id}`, data);
  return result.data;
};

export const removeNewsInEvent = async (id: string, data: string[]) => {
  const result = await apiClient.put(`/event/remove-new/${id}`, data);
  return result.data;
};

// CRUD for report
export const createReport = async (data: IReportDto) => {
  const result = await apiClient.post(`/report`, data);
  return result.data;
};

export const getReport = async (id: string) => {
  const result = await apiClient.get(`/report/${id}`);
  return result.data;
};

export const getReports = async (filter: Record<string, any>) => {
  const result = await apiClient.get(`/report`, {
    params: filter,
  });
  return result.data;
};

export const updateReport = async (id: string, data: any) => {
  const result = await apiClient.put(`/report/${id}`, data);
  return result.data;
};

export const removeReport = async (id: string) => {
  const result = await apiClient.delete(`/report/${id}`);
  return result.data;
};

export const getReportEvents = async (id: string) => {
  const result = await apiClient.get(`/report/events/${id}`);
  return result.data;
};

export const createReportEvents = async (data: TReportEventsDto) => {
  const result = await apiClient.post(`/report/events`, data);
  return result.data;
};

export const removeReportEvents = async (id: string) => {
  const result = await apiClient.delete(`/report/events/${id}`);
  return result.data;
};

export const addEventIdsToReport = async (id: string, data: string[]) => {
  const result = await apiClient.post(`/report/events/${id}/add_event_ids`, data);
  return result.data;
};

export const removeEventIdsToReport = async (id: string, data: string[]) => {
  const result = await apiClient.post(`/report/events/${id}/remove_event_ids`, data);
  return result.data;
};

export const getEventsDetail = async (id: string) => {
  const result = await apiClient.get<IEventDto[]>(`/report/events/${id}/event`);
  return result.data;
};

export interface UpdateReportAndEventType {
  id_report: string | undefined;
  id_heading: string | undefined;
}

export const UpdateReportAndEvent = async (data: UpdateReportAndEventType) => {
  const result = await apiClient.put(`/report/remove-heading`, "", {
    params: filterEmptyString(data),
  });
  return result.data;
};

// Quick report
export const getQuickReports = async (filter: Record<string, any>) => {
  const result = await apiClient.get(`/report/quick-report`, {
    params: filter,
  });
  return result.data;
};

export const createQuickReport = async (data: IQuickReportDto) => {
  const result = await apiClient.post(`/report/quick-report`, data);
  return result.data;
};
