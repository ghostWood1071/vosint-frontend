import { apiClient, filterEmptyString } from "@/utils/api";

const getNewsSidebar = async (title?: string) => {
  const result = await apiClient.get<any>(`/newsletters`, {
    params: filterEmptyString({ title }),
  });
  return result.data;
};

const getNewsletterDetail = async (id: string) => {
  const result = await apiClient.get(`/newsletters/${id}`);
  return result.data;
};

const getNewsByNewsletter = async (newsletterId: string, filter: Record<string, string>) => {
  const result = await apiClient.get(`/newsletters/${newsletterId}/news`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

const addNewsletter = async (data: any) => {
  const result = await apiClient.post<any>(`/newsletters`, data);
  return result.data;
};

const addNewsIdsToNewsletter = async (newsletterId: string, newsIds: string[]) => {
  const result = await apiClient.post<any>(`/newsletters/${newsletterId}/news`, newsIds);
  return result.data;
};

const updateNewsletter = async (newsletterId: string, newsletter: any) => {
  const result = await apiClient.patch(`/newsletters/${newsletterId}`, newsletter);
  return result.data;
};

const deleteNewsletter = async (newsletterId: string) => {
  const result = await apiClient.delete<any>(`/newsletters/${newsletterId}`);
  return result.data;
};

const deleteMultipleNewsletter = async ({ newsletter_ids }: { newsletter_ids: string[] }) => {
  const result = await apiClient.post<any>(`/newsletters/delete-many`, {
    newsletter_ids,
  });
  return result.data;
};

const deleteNewsIdInNewsletter = async (newsletterId: string, newsIds: string[]) => {
  const result = await apiClient.put<any>(`/newsletters/${newsletterId}/news`, newsIds);
  return result.data;
};

export {
  getNewsSidebar,
  getNewsByNewsletter,
  getNewsletterDetail,
  addNewsletter,
  addNewsIdsToNewsletter,
  updateNewsletter,
  deleteNewsletter,
  deleteMultipleNewsletter,
  deleteNewsIdInNewsletter,
};
