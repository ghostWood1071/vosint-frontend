import { apiClient, filterEmptyString } from "@/utils/api";

import type { INewsSummaryDto } from "./news.type";

const apiNewsBaseV2Url = "/v2";
const apiSummBaseUrl = "/summ";

export const getNewsSidebar = async (title?: string) => {
  const result = await apiClient.get<any>(`${apiNewsBaseV2Url}/newsletters`, {
    params: filterEmptyString({ title }),
  });
  return result.data;
};

export const getNewsList = async (filter: any) => {
  const result = await apiClient.get<any>(`${apiNewsBaseV2Url}/news`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

export const getNewsDetail = async (id: string) => {
  const result = await apiClient.get(`${apiNewsBaseV2Url}/news/${id}`);
  return result.data;
};

export const getNewsByNewsletter = async (newsletterId: string, filter: Record<string, string>) => {
  const result = await apiClient.get(`${apiNewsBaseV2Url}/newsletters/${newsletterId}/news`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const addNewsletter = async (data: any) => {
  const result = await apiClient.post<any>(`${apiNewsBaseV2Url}/newsletters`, data);
  return result.data;
};

export const addNewsIdsToNewsletter = async (newsletterId: string, newsIds: string[]) => {
  const result = await apiClient.post<any>(
    `${apiNewsBaseV2Url}/newsletters/${newsletterId}/news`,
    newsIds,
  );
  return result.data;
};

export const deleteNewsletter = async (newsletterId: string) => {
  const result = await apiClient.delete<any>(`${apiNewsBaseV2Url}/newsletters/${newsletterId}`);
  return result.data;
};

export const deleteMultipleNewsletter = async ({
  newsletter_ids,
}: {
  newsletter_ids: string[];
}) => {
  const result = await apiClient.post<any>(`${apiNewsBaseV2Url}/newsletters/delete-many`, {
    newsletter_ids,
  });
  return result.data;
};

export const updateNewsletter = async (newsletterId: string, newsletter: any) => {
  const result = await apiClient.patch(
    `${apiNewsBaseV2Url}/newsletters/${newsletterId}`,
    newsletter,
  );
  return result.data;
};

export const deleteNewsIdInNewsletter = async (newsletterId: string, newsIds: string[]) => {
  const result = await apiClient.put<any>(
    `${apiNewsBaseV2Url}/newsletters/${newsletterId}/news`,
    newsIds,
  );
  return result.data;
};

export const getNewsBookmarks = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`${apiNewsBaseV2Url}/user/bookmarks`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const addNewsIdsToBookmarkUser = async (newsIds: string[]) => {
  const result = await apiClient.post<any>(`${apiNewsBaseV2Url}/user/bookmarks`, newsIds);
  return result;
};

export const deleteNewsInBookmarkUser = async (newsIds: string[]) => {
  const result = await apiClient.put<any>(`${apiNewsBaseV2Url}/user/bookmarks`, newsIds);
  return result;
};

export const getNewsVitals = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`${apiNewsBaseV2Url}/user/vital`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const addNewsIdsToVitalUser = async (newsIds: string[]) => {
  const result = await apiClient.post<any>(`${apiNewsBaseV2Url}/user/vital`, newsIds);
  return result;
};

export const deleteNewsInVitalUser = async (newsIds: string[]) => {
  const result = await apiClient.put<any>(`${apiNewsBaseV2Url}/user/vital`, newsIds);
  return result;
};

export const getNewsletterDetail = async (id: string) => {
  const result = await apiClient.get(`${apiNewsBaseV2Url}/newsletters/${id}`);
  return result.data;
};

export const getNewsSummary = async ({ k, ...data }: INewsSummaryDto) => {
  const query = new URLSearchParams({ k });

  return apiClient
    .post(`http://vosint.aiacademy.edu.vn/api${apiSummBaseUrl}/summary/?${query.toString()}`, data)
    .then((res) => res.data);
};
