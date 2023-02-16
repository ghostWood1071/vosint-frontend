import { apiClient, filterEmptyString } from "@/utils/api";

import { IActionInfos, IPipeline, IPipelines } from "./pipeline.types";
import { APIResponse } from "./service.types";

const apiPipelineBaseUrl = "/pipeline/api";

export const getPipelines = async (filter: any) => {
  const url = `${apiPipelineBaseUrl}/get_pipelines`;
  const result = await apiClient.get<APIResponse<IPipelines[]>>(url, {
    params: filterEmptyString(filter),
  });
  return {
    data: result.data.payload,
    total: result.data?.metadata?.total_records,
  };
};

export const getPipelineDetail = async (id: string) => {
  const url = `${apiPipelineBaseUrl}/get_pipeline_by_id/${id}`;
  const result = await apiClient.get<APIResponse<IPipeline>>(url);
  return result.data.payload;
};

export const getActionInfos = async () => {
  const url = `${apiPipelineBaseUrl}/get_action_infos`;
  const result = await apiClient.get<APIResponse<IActionInfos[]>>(url);
  return result.data.payload;
};

export const putPipeline = async (data: any) => {
  const url = `${apiPipelineBaseUrl}/put_pipeline`;
  const result = await apiClient.post<APIResponse<any>>(url, data);
  return result.data.payload;
};

export const clonePipeline = async (id: string) => {
  const url = `${apiPipelineBaseUrl}/clone_pipeline/${id}`;
  const result = await apiClient.post<APIResponse<any>>(url);
  return result.data.payload;
};

export const verifyPipeline = async (id: string) => {
  const url = `${apiPipelineBaseUrl}/run_only_job/${id}`;
  const result = await apiClient.post<APIResponse<any>>(url);
  return result.data.payload;
};

export const deletePipeline = async (id: string) => {
  const url = `${apiPipelineBaseUrl}/delete_pipeline/${id}`;
  const result = await apiClient.delete<APIResponse<any>>(url);
  return result.data.payload;
};

export const getHistory = async (id: string) => {
  const url = `${apiPipelineBaseUrl}/get_log_history_error_or_getnews/${id}`;
  const result = await apiClient.get<APIResponse<IPipeline>>(url);
  return result.data;
};
