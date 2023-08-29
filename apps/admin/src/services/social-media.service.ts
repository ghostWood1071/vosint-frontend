import { APIResponse } from "@/models/service.type";
import { apiClient, filterEmptyString } from "@/utils/api";

const getFacebookSetting = async (filter: any) => {
  const url = `/Social-media/social_media/Facebook/${filter.type_data}`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getTwitterSetting = async (filter: any) => {
  const url = `/Social-media/social_media/Twitter/Object`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getTiktokSetting = async (filter: any) => {
  const url = `/Social-media/social_media/Tiktok/Object`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getSettingFilter = async (filter: any) => {
  const url = `/Social-media/${filter.type_data}/${filter.valueFilter}`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getAccountMonitorSocialMedia = async (filter: any) => {
  var url = `/Social-media/social_media/${filter.type_data}`;
  const result = await apiClient.get<any>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getSocialObjectList = async (filter: any) => {
  const result = await apiClient.get<any>(`/Social-media/${filter.type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getSetting = async () => {
  const result = await apiClient.get<any>(`/social-media/social_media/Facebook`);
  return result.data;
};

const postSetting = async (data: any) => {
  const result = await apiClient.post<APIResponse<any>>(`/social-media`, data);
  return result.data.payload;
};

const updateSocialConfig = async (data: any) => {
  const result = await apiClient.put(`/Social-media/edit_social`, data);
  return result.data;
};

const deleteSocialConfig = async (SocialId: string) => {
  const result = await apiClient.delete<any>(`/Social-media/Social/${SocialId}`);
  return result.data;
};

export {
  getFacebookSetting,
  getTwitterSetting,
  getTiktokSetting,
  getSettingFilter,
  getAccountMonitorSocialMedia,
  getSocialObjectList,
  getSetting,
  postSetting,
  updateSocialConfig,
  deleteSocialConfig,
};
