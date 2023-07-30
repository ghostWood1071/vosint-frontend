import { apiClient } from "@/utils/api";

export const getHotNewsToday = async () => {
  const result = await apiClient.get(`/dashboard/hot-news-today`);

  return result.data;
};
