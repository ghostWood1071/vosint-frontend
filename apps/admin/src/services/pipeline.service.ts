import { BASE_URL_JOB, BASE_URL_PIPELINE } from "@/constants/config";
import { apiClient, filterEmptyString } from "@/utils/api";

import { IActionInfos, ILogHistory, IPipeline, IPipelines } from "./pipeline.type";
import { APIResponse } from "./service.types";

export const getPipelines = async (filter: any) => {
  const url = `${BASE_URL_PIPELINE}/Pipeline/api/get_pipelines`;
  const result = await apiClient.get<APIResponse<IPipelines[]>>(url, {
    params: filterEmptyString(filter),
  });
  return {
    data: result.data.payload,
    total: result.data?.metadata?.total_records,
  };
};

export const getPipelineDetail = async (id: string) => {
  const url = `${BASE_URL_PIPELINE}/Pipeline/api/get_pipeline_by_id/${id}`;
  const result = await apiClient.get<APIResponse<IPipeline>>(url);
  return result.data.payload;
};

export const getActionInfos = async () => {
  const url = `${BASE_URL_PIPELINE}/Pipeline/api/get_action_infos`;
  const result = await apiClient.get<APIResponse<IActionInfos[]>>(url);
  return result.data.payload;
};

export const putPipeline = async (data: any) => {
  const url = `${BASE_URL_PIPELINE}/Pipeline/api/put_pipeline`;
  const result = await apiClient.post<APIResponse<any>>(url, data);
  return result.data.payload;
};

export const clonePipeline = async (id: string) => {
  const url = `${BASE_URL_PIPELINE}/Pipeline/api/clone_pipeline/${id}`;
  const result = await apiClient.post<APIResponse<any>>(url);
  return result.data.payload;
};

export const deletePipeline = async (id: string) => {
  const url = `${BASE_URL_PIPELINE}/Pipeline/api/delete_pipeline/${id}`;
  const result = await apiClient.delete<APIResponse<any>>(url);
  return result.data.payload;
};

export const verifyPipeline = async (id: string) => {
  const url = `${BASE_URL_JOB}/Job/api/run_only_job/${id}`;
  const result = await apiClient.post(url, null, {
    timeout: 1_000 * 60 * 5,
  });
  return result.data;
};

export const getHistory = async (id: string, filter: Record<string, any>) => {
  const url = `${BASE_URL_JOB}/Job/api/get_log_history_error_or_getnews/${id}`;
  const result = await apiClient.get<APIResponse<IPipeline>>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getLogHistoryLast = async (id: string) => {
  const url = `${BASE_URL_JOB}/Job/api/get_log_history_last/${id}`;
  const result = await apiClient.get<ILogHistory>(url);
  return result.data;
};

export const startJobById = async (id: string) => {
  const url = `${BASE_URL_JOB}/Job/api/start_job/${id}`;
  const result = await apiClient.post(url);
  return result.data;
};

export const stopJobById = async (id: string) => {
  const url = `${BASE_URL_JOB}/Job/api/stop_job/${id}`;
  const result = await apiClient.post(url);
  return result.data;
};

export const startAllJob = async () => {
  const url = `${BASE_URL_JOB}/Job/api/start_all_jobs`;
  const result = await apiClient.post(url);
  return result.data;
};

export const stopAllJob = async () => {
  const url = `${BASE_URL_JOB}/Job/api/stop_all_jobs`;
  const result = await apiClient.post(url);
  return result.data;
};
