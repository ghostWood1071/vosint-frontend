import { apiClient, filterEmptyString } from "@/utils/api";

import { IPipelineSource } from "./source-config.type";

const apiNewsSourceConfigBaseV2Url = "/v2";

export const getPipelineSource = async () => {
  return apiClient
    .get<IPipelineSource[]>(`${apiNewsSourceConfigBaseV2Url}/Source/pipeline-options`)
    .then((res) => res.data);
};

export const getSourceConfig = async (filter: any) => {
  const result = await apiClient.get<any>(
    `${apiNewsSourceConfigBaseV2Url}/Source/${filter.text_search}`,
    {
      params: filterEmptyString(filter),
    },
  );
  return result.data;
};

export const addNewsSource = async (data: any) => {
  const result = await apiClient.post<any>(`${apiNewsSourceConfigBaseV2Url}/Source/`, data);
  return result.data;
};

export const deleteNewsSource = async (newsSourceId: string) => {
  const result = await apiClient.delete<any>(
    `${apiNewsSourceConfigBaseV2Url}/Source/${newsSourceId}`,
  );
  return result.data;
};

export const updateNewsSource = async (newsSourceId: string, data: any) => {
  const result = await apiClient.put(
    `${apiNewsSourceConfigBaseV2Url}/Source/${newsSourceId}`,
    data,
  );
  return result.data;
};
