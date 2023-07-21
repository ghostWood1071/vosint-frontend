import { apiClient, filterEmptyString } from "@/utils/api";

import { IPipelineSource } from "./source-config.type";

export const getPipelineSource = async () => {
  return apiClient.get<IPipelineSource[]>(`/Source/pipeline-options`).then((res) => res.data);
};

export const getSourceConfig = async (filter: any) => {
  const endpoint = `/Source${filter.text_search ? `/${filter.text_search}` : ""}`;
  const params = filterEmptyString(filter);
  const result = await apiClient.get<any>(endpoint, { params });
  return result.data;
};

export const addNewsSource = async (data: any) => {
  const result = await apiClient.post<any>(`/Source`, data);
  return result.data;
};

export const deleteNewsSource = async (newsSourceId: string) => {
  const result = await apiClient.delete<any>(`/Source/${newsSourceId}`);
  return result.data;
};

export const updateNewsSource = async (newsSourceId: string, data: any) => {
  const result = await apiClient.put(`/Source/${newsSourceId}`, data);
  return result.data;
};
