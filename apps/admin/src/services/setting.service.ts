import { apiClient } from "@/utils/api";

import { APIResponse } from "./service.types";

export const postSetting = async (data: any) => {
  const result = await apiClient.post<APIResponse<any>>(`/social-media/`, data);
  return result.data.payload;
};
export const getSetting = async () => {
  const result = await apiClient.get<any>(`/social-media/social_media/Facebook`);
  return result.data;
};
