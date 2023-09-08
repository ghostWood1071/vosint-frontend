import { IEventDTO } from "@/models/event.type";
import {
  IQuickReportDTO,
  IReportDTO,
  TReportEventsDTO,
  UpdateReportAndEventType,
} from "@/models/report.type";
import { apiClient, filterEmptyString } from "@/utils/api";

const getReport = async (id: string) => {
  const result = await apiClient.get(`/report/${id}`);
  return result.data;
};

const getReports = async (filter: Record<string, any>) => {
  const result = await apiClient.get(`/report`, {
    params: filter,
  });
  return result.data;
};

const getReportEvents = async (id: string) => {
  const result = await apiClient.get(`/report/events/${id}`);
  return result.data;
};

const getQuickReports = async (filter: Record<string, any>) => {
  const result = await apiClient.get(`/report/quick-report`, {
    params: filter,
  });
  return result.data;
};

const getEventsDetail = async (id: string) => {
  const result = await apiClient.get<IEventDTO[]>(`/report/events/${id}/event`);
  return result.data;
};
const createReport = async (data: IReportDTO) => {
  const result = await apiClient.post(`/report`, data);
  return result.data;
};

const createReportEvents = async (data: TReportEventsDTO) => {
  const result = await apiClient.post(`/report/events`, data);
  return result.data;
};

const createQuickReport = async (data: IQuickReportDTO) => {
  const result = await apiClient.post(`/report/quick-report`, data);
  return result.data;
};

const addEventIdsToReport = async (id: string, data: string[]) => {
  const result = await apiClient.post(`/report/events/${id}/add_event_ids`, data);
  return result.data;
};
const updateReport = async (id: string, data: any) => {
  const result = await apiClient.put(`/report/${id}`, data);
  return result.data;
};

const UpdateReportAndEvent = async (data: UpdateReportAndEventType) => {
  const result = await apiClient.put(`/report/remove-heading/`, "", {
    params: filterEmptyString(data),
  });
  return result.data;
};
const removeReport = async (id: string) => {
  const result = await apiClient.delete(`/report/${id}`);
  return result.data;
};

const removeReportEvents = async (id: string) => {
  const result = await apiClient.delete(`/report/events/${id}`);
  return result.data;
};

const removeEventIdsToReport = async (id: string, data: string[]) => {
  const result = await apiClient.post(`/report/events/${id}/remove_event_ids`, data);
  return result.data;
};

export {
  getReport,
  getReports,
  getEventsDetail,
  getReportEvents,
  getQuickReports,
  createReport,
  createReportEvents,
  createQuickReport,
  addEventIdsToReport,
  updateReport,
  UpdateReportAndEvent,
  removeReport,
  removeReportEvents,
  removeEventIdsToReport,
};
