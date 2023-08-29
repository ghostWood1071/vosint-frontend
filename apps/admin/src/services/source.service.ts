import { IPipelineSource } from "@/models/source-config.type";
import { apiClient, filterEmptyString } from "@/utils/api";

const getPipelineSource = async () => {
  return apiClient.get<IPipelineSource[]>(`/Source/pipeline-options`).then((res) => res.data);
};

const getSourceConfig = async (filter: any) => {
  const endpoint = `/Source${filter.text_search ? `/${filter.text_search}` : ""}`;
  const params = filterEmptyString(filter);
  const result = await apiClient.get<any>(endpoint, { params });
  return result.data;
};

const addNewsSource = async (data: any) => {
  const result = await apiClient.post<any>(`/Source`, data);
  return result.data;
};

const updateNewsSource = async (newsSourceId: string, data: any) => {
  const result = await apiClient.put(`/Source/${newsSourceId}`, data);
  return result.data;
};

const deleteNewsSource = async (newsSourceId: string) => {
  const result = await apiClient.delete<any>(`/Source/${newsSourceId}`);
  return result.data;
};

export { getPipelineSource, getSourceConfig, addNewsSource, deleteNewsSource, updateNewsSource };
