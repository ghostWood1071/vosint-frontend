import { IProxyPipelineOptions } from "@/models/cate-config.type";
import { apiClient, filterEmptyString } from "@/utils/api";

const getProxyConfig = async (filter: any) => {
  const result = await apiClient.get<any>(`/Proxy/search`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getProxyPipelineOptions = async () => {
  const result = await apiClient.get<IProxyPipelineOptions>(`/Proxy/pipeline-options`);
  return result.data;
};
const addNewProxyConfig = async (data: any) => {
  const result = await apiClient.post<any>(`/Proxy`, data);
  return result.data;
};

const updateProxyConfig = async (proxyId: string, data: any) => {
  const result = await apiClient.put(`/Proxy/${proxyId}`, data);
  return result.data;
};
const deleteProxyConfig = async (proxyId: string) => {
  const result = await apiClient.delete<any>(`/Proxy/${proxyId}`);
  return result.data;
};

export {
  getProxyConfig,
  getProxyPipelineOptions,
  addNewProxyConfig,
  updateProxyConfig,
  deleteProxyConfig,
};
