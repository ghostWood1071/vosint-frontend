import { apiClient, filterEmptyString } from "@/utils/api";

import { IProxyPipelineOptions } from "./cate-config.type";

const apiCateConfigBaseV2Url = "/v2";

//get
export const getObjectCateConfig = async (filter: any) => {
  const result = await apiClient.get<any>(`${apiCateConfigBaseV2Url}/object/${filter.type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getProxyConfig = async (filter: any) => {
  const result = await apiClient.get<any>(`${apiCateConfigBaseV2Url}/Proxy/${filter.text_search}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getFacebookSetting = async (filter: any) => {
  var url = apiCateConfigBaseV2Url + `/Social-media/social_media/Facebook/${filter.type_data}`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getTwitterSetting = async (filter: any) => {
  const url = `${apiCateConfigBaseV2Url}/Social-media/social_media/Twitter/Object`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getTiktokSetting = async (filter: any) => {
  const url = `${apiCateConfigBaseV2Url}/Social-media/social_media/Tiktok/Object`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getSettingFilter = async (filter: any) => {
  const url = `${apiCateConfigBaseV2Url}/Social-media/${filter.type_data}/${filter.valueFilter}`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getAdminMonitor = async (filter: any) => {
  const url = `${apiCateConfigBaseV2Url}/account-monitor/get_by_social/${filter.type_data}`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getAccountMonitorSocialMedia = async (filter: any) => {
  var url = apiCateConfigBaseV2Url + `/Social-media/social_media/${filter.type_data}`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

//add
export const addNewObjectCateConfig = async (data: any, typeObject: any, statusData: any) => {
  const result = await apiClient.post<any>(`${apiCateConfigBaseV2Url}/object/`, data, {
    params: {
      type: typeObject,
      Status: statusData,
    },
  });
  return result.data;
};

export const addNewProxyConfig = async (data: any) => {
  const result = await apiClient.post<any>(`${apiCateConfigBaseV2Url}/Proxy/`, data);
  return result.data;
};

export const postSetting = async (data: any) => {
  const result = await apiClient.post<any>(`${apiCateConfigBaseV2Url}/Social-media/`, data);
  return result.data.playload;
};

export const postAccountMonitor = async (data: any) => {
  const result = await apiClient.post<any>(`${apiCateConfigBaseV2Url}/account-monitor/`, data);
  return result.data;
};

// delete

export const deleteObjectCateConfig = async (objectId: string) => {
  const result = await apiClient.delete<any>(`${apiCateConfigBaseV2Url}/object/${objectId}`);
  return result.data;
};

export const deleteProxyConfig = async (proxyId: string) => {
  const result = await apiClient.delete<any>(`${apiCateConfigBaseV2Url}/Proxy/${proxyId}`);
  return result.data;
};

export const deleteSocialConfig = async (SocialId: string) => {
  const result = await apiClient.delete<any>(
    `${apiCateConfigBaseV2Url}/Social-media/Social/${SocialId}`,
  );
  return result.data;
};

export const deleteAccountMonitor = async (SocialId: string) => {
  const result = await apiClient.delete<any>(
    `${apiCateConfigBaseV2Url}/account-monitor/delete/${SocialId}`,
  );
  return result.data;
};

//update
export const updateObjectCateConfig = async (objectId: string, data: any) => {
  const result = await apiClient.put(`${apiCateConfigBaseV2Url}/object/${objectId}`, data);
  return result.data;
};

export const updateProxyConfig = async (proxyId: string, data: any) => {
  const result = await apiClient.put(`${apiCateConfigBaseV2Url}/Proxy/${proxyId}`, data);
  return result.data;
};

export const updateSocialConfig = async (data: any) => {
  const result = await apiClient.put(`${apiCateConfigBaseV2Url}/Social-media/edit_social`, data);
  return result.data;
};

export const updateAccountMonitor = async (data: any) => {
  const result = await apiClient.put(
    `${apiCateConfigBaseV2Url}/account-monitor/edit_account_monitor`,
    data,
  );
  return result.data;
};

//upload image
export const uploadFile = async (data: any) => {
  const result = await apiClient.post(`${apiCateConfigBaseV2Url}/upload/`, data, {
    headers: {
      accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
  return result;
};

export const getSocialObjectList = async (filter: any) => {
  const result = await apiClient.get<any>(`${apiCateConfigBaseV2Url}/Social-media/${filter.type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getProxyPipelineOptions = async () => {
  const result = await apiClient.get<IProxyPipelineOptions>(
    `${apiCateConfigBaseV2Url}/Proxy/pipeline-options`,
  );
  return result.data;
};
