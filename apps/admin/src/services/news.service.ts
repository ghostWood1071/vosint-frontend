import { apiClient, filterEmptyString } from "@/utils/api";

// const apiNewsBaseUrl = "/pipeline/api";

export const getNewsSidebar = async () => {
  const result = await apiClient.get<any>(`newsletters`);
  return result.data;
};

export const getNewsList = async (filter: any) => {
  // const result = await apiClient.get<any>(`${apiNewsBaseUrl}/get_result_job/News`, {
  //   params: filterEmptyString(filter),
  // });
  const result = await apiClient.get<any>(`/news`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

export const addNewsletter = async (data: any) => {
  const result = await apiClient.post<any>(`newsletters`, data);
  return result.data;
};

export const addNewsIdsToNewsletter = async (newsletterId: string, newsIds: string[]) => {
  const result = await apiClient.post<any>(`/newsletters/${newsletterId}/news`, newsIds);
  return result.data;
};

export const deleteNewsletter = async (newsletterId: string) => {
  const result = await apiClient.delete<any>(`newsletters/${newsletterId}`);
  return result.data;
};

export const updateNewsletter = async (newsletterId: string, newsletter: any) => {
  const result = await apiClient.patch(`newsletters/${newsletterId}`, newsletter);
  return result.data;
};
