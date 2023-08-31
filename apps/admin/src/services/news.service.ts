import { BASE_URL_PIPELINE, BASE_URL_SUM } from "@/constants/config";
import type { INewsSummaryDTO } from "@/models/news.type";
import { apiClient, filterEmptyString } from "@/utils/api";

const getNewsList = async (filter: any) => {
  const result = await apiClient.get<any>(`/news`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

const getNewsDetail = async (id: string) => {
  const result = await apiClient.get(`/news/${id}`);
  return result.data;
};

const SetSeenPost = async (newsId: string) => {
  const result = await apiClient.post<any>(`/news/read/${newsId}`);
  return result.data;
};

const SetNotSeenPost = async (newsId: string) => {
  const result = await apiClient.post<any>(`/news/unread/${newsId}`);
  return result.data;
};

const exportNews = async (data: any) => {
  const result = await apiClient.post<any>(`/news/export-to-word`, data, {
    responseType: "blob",
  });

  return result.data;
};

const addNewsToCategory = async (data: any) => {
  // const result = await apiClient.post<any>(``, data);
  // return result.data;
};

const checkMatchKeyword = async (data: any) => {
  const result = await apiClient.post<any>(`/news/check-news-contain-keywords`, data);
  return result.data;
};

const deleteNewsFromCategory = async (data: any) => {
  // const query = new URLSearchParams({  });
  const result = await apiClient.post<any>(
    `/news/remove-news-from-object?object_id=${data.object_ids}`,
    data.news_ids,
  );

  return result.data;
};

export {
  getNewsDetail,
  getNewsList,
  SetSeenPost,
  SetNotSeenPost,
  exportNews,
  addNewsToCategory,
  checkMatchKeyword,
  deleteNewsFromCategory,
};
