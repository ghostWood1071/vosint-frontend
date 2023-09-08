import { BASE_URL, BASE_URL_PIPELINE } from "@/constants/config";
import { IActionInfos, ILogHistory, IPipeline, IPipelines } from "@/models/pipeline.type";
import { APIResponse } from "@/models/service.type";
import { apiClient, filterEmptyString } from "@/utils/api";

const getPipelines = async (filter: any) => {
  const url = `${BASE_URL}/Pipeline/api/get_pipelines`;
  const result = await apiClient.get<APIResponse<IPipelines[]>>(url, {
    params: filterEmptyString(filter),
  });
  return {
    data: result.data.payload,
    total: result.data?.metadata?.total_records,
  };
};

const getPipelineDetail = async (id: string) => {
  const url = `${BASE_URL}/Pipeline/api/get_pipeline_by_id/${id}`;
  const result = await apiClient.get<APIResponse<IPipeline>>(url);
  return result.data.payload;
};

const getActionInfos = async () => {
  const url = `${BASE_URL}/Pipeline/api/get_action_infos`;
  const result = await apiClient.get<APIResponse<IActionInfos[]>>(url);
  return result.data.payload;
};

const putPipeline = async (data: any) => {
  const url = `${BASE_URL}/Pipeline/api/put_pipeline`;
  const result = await apiClient.post<APIResponse<any>>(url, data);
  return result.data.payload;
};

const clonePipeline = async (id: string) => {
  const url = `${BASE_URL}/Pipeline/api/clone_pipeline/${id}`;
  const result = await apiClient.post<APIResponse<any>>(url);
  return result.data.payload;
};

const deletePipeline = async (id: string) => {
  const url = `${BASE_URL}/Pipeline/api/delete_pipeline/${id}`;
  const result = await apiClient.delete<APIResponse<any>>(url);
  return result.data.payload;
};

export {
  getPipelines,
  getPipelineDetail,
  getActionInfos,
  putPipeline,
  clonePipeline,
  deletePipeline,
};
