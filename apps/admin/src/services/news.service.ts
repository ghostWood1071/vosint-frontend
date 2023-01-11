import { apiClient } from "@/utils/api";

export const getNewsSidebar = async () => {
  const result = await apiClient.get<any>(`news-sidebar`);
  return result.data;
};

export const getNewsList = async () => {
  const result = await apiClient.get<any>(`news`);
  return result.data;
};
