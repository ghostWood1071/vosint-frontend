import { apiClient } from "@/utils/api";

import { IEventDto, IReportDto, TEvents } from "./report-type";

const apiEventBaseV2Url = "";
const apiReportBaseV2Url = "";

export const createEvent = async (data: IEventDto) => {
  const result = await apiClient.post(`${apiEventBaseV2Url}/event`, data);
  return result.data;
};

export const getEvent = async (id: string) => {
  const result = await apiClient.get(`${apiEventBaseV2Url}/event/detail/${id}`);
  return result.data;
};

export const getEvents = async (filter: Record<string, any>) => {
  const result = await apiClient.get<TEvents>(`${apiEventBaseV2Url}/event`, {
    params: filter,
  });
  return result.data;
};

export const updateEvent = async (id: string, data: any) => {
  const result = await apiClient.put(`${apiEventBaseV2Url}/event/${id}`, data);
  return result.data;
};

export const removeNewsInEvent = async (id: string, data: string[]) => {
  const result = await apiClient.put(`${apiEventBaseV2Url}/event/remove-new/${id}`, data);
  return result.data;
};

// CRUD for report
export const createReport = async (data: IReportDto) => {
  const result = await apiClient.post(`${apiReportBaseV2Url}/report`, data);
  return result.data;
};

export const getReport = async (id: string) => {
  const result = await apiClient.get(`${apiReportBaseV2Url}/report/${id}`);
  return result.data;
};

export const getReports = async (filter: Record<string, any>) => {
  const result = await apiClient.get(`${apiReportBaseV2Url}/report`, {
    params: filter,
  });
  return result.data;
};

export const updateReport = async (id: string, data: any) => {
  const result = await apiClient.put(`${apiReportBaseV2Url}/report/${id}`, data);
  return result.data;
};

export const removeReport = async (id: string) => {
  const result = await apiClient.delete(`${apiReportBaseV2Url}/report/${id}`);
  return result.data;
};
