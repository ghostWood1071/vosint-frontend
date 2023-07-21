import { BASE_URL_PIPELINE, BASE_URL_SUMM } from "@/constants/config";
import { apiClient, filterEmptyString } from "@/utils/api";

import type { INewsSummaryDto } from "./news.type";

export const getNewsSidebar = async (title?: string) => {
  const result = await apiClient.get<any>(`/newsletters`, {
    params: filterEmptyString({ title }),
  });
  return result.data;
};

export const getNewsList = async (filter: any) => {
  const result = await apiClient.get<any>(`/news`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

export const getNewsListWithApiJob = async (filter: any) => {
  const result = await apiClient.get<any>(`/Job/api/get_result_job/News`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

export const getNewsDetail = async (id: string) => {
  const result = await apiClient.get(`/news/${id}`);
  return result.data;
};

export const getNewsByNewsletter = async (newsletterId: string, filter: Record<string, string>) => {
  const result = await apiClient.get(`/newsletters/${newsletterId}/news`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

export const getNewsByNewsletterWithApiJob = async (
  newsletterId: string,
  filter: Record<string, string>,
) => {
  const result = await apiClient.get(`/Job/api/get_news_from_newsletter_id`, {
    params: filterEmptyString({
      ...filter,
      newsletter_id: newsletterId,
    }),
  });
  return result.data;
};

export const getEventsByNewsletterWithApiJob = async (
  // newsletterId: string,
  filter: Record<string, string>,
) => {
  const result = await apiClient.get(`/Job/api/get_event_from_newsletter_list_id`, {
    params: filterEmptyString({
      // ...filter,
      newsletter_id: filter.newsletterId,
      start_date: filter.startDate,
      end_date: filter.endDate,
      event_number: filter.eventNumber,
    }),
  });
  return result.data;
};

export const addNewsletter = async (data: any) => {
  const result = await apiClient.post<any>(`/newsletters`, data);
  return result.data;
};

export const addNewsIdsToNewsletter = async (newsletterId: string, newsIds: string[]) => {
  const result = await apiClient.post<any>(`/newsletters/${newsletterId}/news`, newsIds);
  return result.data;
};

export const deleteNewsletter = async (newsletterId: string) => {
  const result = await apiClient.delete<any>(`/newsletters/${newsletterId}`);
  return result.data;
};

export const deleteMultipleNewsletter = async ({
  newsletter_ids,
}: {
  newsletter_ids: string[];
}) => {
  const result = await apiClient.post<any>(`/newsletters/delete-many`, {
    newsletter_ids,
  });
  return result.data;
};

export const updateNewsletter = async (newsletterId: string, newsletter: any) => {
  const result = await apiClient.patch(`/newsletters/${newsletterId}`, newsletter);
  return result.data;
};

export const deleteNewsIdInNewsletter = async (newsletterId: string, newsIds: string[]) => {
  const result = await apiClient.put<any>(`/newsletters/${newsletterId}/news`, newsIds);
  return result.data;
};

export const getNewsBookmarks = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/user/bookmarks`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getNewsBookmarksWithApiJob = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/Job/api/get_news_from_newsletter_id`, {
    params: filterEmptyString({
      ...filter,
      bookmarks: "1",
    }),
  });
  return result.data;
};

export const getNewsFormElt = async (filter: Record<string, any>) => {
  const result = await apiClient.post(`/Job/api/get_news_from_elt`, filterEmptyString(filter));
  return result.data;
};

export const addNewsIdsToBookmarkUser = async (newsIds: string[]) => {
  const result = await apiClient.post<any>(`/user/bookmarks`, newsIds);
  return result;
};

export const deleteNewsInBookmarkUser = async (newsIds: string[]) => {
  const result = await apiClient.put<any>(`/user/bookmarks`, newsIds);
  return result;
};

export const getNewsVitals = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/user/vital`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getNewsVitalsWithApiJob = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/Job/api/get_news_from_newsletter_id`, {
    params: filterEmptyString({
      ...filter,
      vital: "1",
    }),
  });
  return result.data;
};

export const addNewsIdsToVitalUser = async (newsIds: string[]) => {
  const result = await apiClient.post<any>(`/user/vital`, newsIds);
  return result;
};

export const deleteNewsInVitalUser = async (newsIds: string[]) => {
  const result = await apiClient.put<any>(`/user/vital`, newsIds);
  return result;
};

export const getNewsletterDetail = async (id: string) => {
  const result = await apiClient.get(`/newsletters/${id}`);
  return result.data;
};

export const getNewsSummary = async ({ k, ...data }: INewsSummaryDto) => {
  const query = new URLSearchParams({ k });

  return apiClient
    .post(`${BASE_URL_SUMM}/summary/?${query.toString()}`, data)
    .then((res) => res.data);
};

export const getEventByIdNews = async (newsId: string) => {
  const result = await apiClient.get<any>(`/event/news/${newsId}`);
  return result.data;
};

export const getAllEventNews = async (filter: any) => {
  const result = await apiClient.get<any>(`/event/search`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const createEventNews = async (data: any) => {
  const result = await apiClient.post<any>(`/event`, data);
  return result.data;
};

export const deleteEventNews = async (news_id: string, data: any) => {
  const result = await apiClient.put<any>(`/event/remove-event/${news_id}`, data);
  return result.data;
};

export const updateEventNews = async (event_id: string, data: any) => {
  const result = await apiClient.put(`/event/${event_id}`, data);
  return result.data;
};

export const AddManyEventToNews = async (data: any, news_id: string) => {
  const result = await apiClient.put<any>(`/event/add-event/${news_id}`, data);
  return result.data;
};

export const SetSeenPost = async (newsId: string) => {
  const result = await apiClient.post<any>(`/news/read/${newsId}`);
  return result.data;
};

export const SetNotSeenPost = async (newsId: string) => {
  const result = await apiClient.post<any>(`/news/unread/${newsId}`);
  return result.data;
};

export const getNewsViaSourceAndApiJob = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/Job/api/get_news_from_id_source`, {
    params: filterEmptyString({
      ...filter,
    }),
  });
  return result.data;
};

export const getContentTranslation = async (inputLanguage: string, data: any) => {
  const result = await apiClient.post(`${BASE_URL_PIPELINE}/Job/api/translate`, {
    lang: inputLanguage,
    content: data,
  });
  return result.data;
};

export const generateSystemEventNews = async (news_id: string) => {
  const result = await apiClient.post(`/Event/extract_event`, "", {
    params: {
      Id_news: news_id,
    },
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    },
  });
  return result.data;
};

export const getNewsFromTTXVN = async (params: Record<string, any>) => {
  const result = await apiClient.post(`/Job/api/get_news_from_ttxvn`, {
    params: filterEmptyString(params),
  });

  return result.data;
};
