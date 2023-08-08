import { apiClient, filterEmptyString } from "@/utils/api";

import { IProxyPipelineOptions } from "./cate-config.type";

//get
export const getObjectCateConfig = async (filter: any) => {
  const result = await apiClient.get<any>(`/object/${filter.type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getProxyConfig = async (filter: any) => {
  const result = await apiClient.get<any>(`/Proxy/search`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getFacebookSetting = async (filter: any) => {
  var url = `/Social-media/social_media/Facebook/${filter.type_data}`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getTwitterSetting = async (filter: any) => {
  const url = `/Social-media/social_media/Twitter/Object`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getTiktokSetting = async (filter: any) => {
  const url = `/Social-media/social_media/Tiktok/Object`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getSettingFilter = async (filter: any) => {
  const url = `/Social-media/${filter.type_data}/${filter.valueFilter}`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getAdminMonitor = async (filter: any) => {
  const url = `/account-monitor/get_by_social/${filter.type_data}`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getAccountMonitorSocialMedia = async (filter: any) => {
  var url = `/Social-media/social_media/${filter.type_data}`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

//add
export const addNewObjectCateConfig = async (data: any) => {
  const result = await apiClient.post<any>(`/object`, data, {
    params: {
      type: data.object_type,
      Status: data.status,
    },
  });
  return result.data;
};

export const addNewProxyConfig = async (data: any) => {
  const result = await apiClient.post<any>(`/Proxy`, data);
  return result.data;
};

export const postSetting = async (data: any) => {
  const result = await apiClient.post<any>(`/Social-media`, data);
  return result.data.playload;
};

export const postAccountMonitor = async (data: any) => {
  const result = await apiClient.post<any>(`/account-monitor`, data);
  return result.data;
};

// delete

export const deleteObjectCateConfig = async (objectId: string) => {
  const result = await apiClient.delete<any>(`/object/${objectId}`);
  return result.data;
};

export const deleteProxyConfig = async (proxyId: string) => {
  const result = await apiClient.delete<any>(`/Proxy/${proxyId}`);
  return result.data;
};

export const deleteSocialConfig = async (SocialId: string) => {
  const result = await apiClient.delete<any>(`/Social-media/Social/${SocialId}`);
  return result.data;
};

export const deleteAccountMonitor = async (SocialId: string) => {
  const result = await apiClient.delete<any>(`/account-monitor/delete/${SocialId}`);
  return result.data;
};

//update
export const updateObjectCateConfig = async (objectId: string, data: any) => {
  const result = await apiClient.put(`/object/${objectId}`, data);
  return result.data;
};

export const updateProxyConfig = async (proxyId: string, data: any) => {
  const result = await apiClient.put(`/Proxy/${proxyId}`, data);
  return result.data;
};

export const updateSocialConfig = async (data: any) => {
  const result = await apiClient.put(`/Social-media/edit_social`, data);
  return result.data;
};

export const updateAccountMonitor = async (data: any) => {
  const result = await apiClient.put(`/account-monitor/edit_account_monitor`, data);
  return result.data;
};

//upload image
export const uploadFile = async (data: any) => {
  const result = await apiClient.post(`/upload`, data, {
    headers: {
      accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
  return result;
};

export const getSocialObjectList = async (filter: any) => {
  const result = await apiClient.get<any>(`/Social-media/${filter.type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getProxyPipelineOptions = async () => {
  const result = await apiClient.get<IProxyPipelineOptions>(`/Proxy/pipeline-options`);
  return result.data;
};
