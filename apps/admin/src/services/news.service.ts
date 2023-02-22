import { apiClient, filterEmptyString } from "@/utils/api";

const apiNewsBaseV2Url = "/v2";

export const getNewsSidebar = async () => {
  const result = await apiClient.get<any>(`${apiNewsBaseV2Url}/newsletters`);
  return result.data;
};

export const getNewsList = async (filter: any) => {
  const result = await apiClient.get<any>(`${apiNewsBaseV2Url}/news`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

export const getNewsDetail = async (newsletterId: string, filter: Record<string, string>) => {
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
