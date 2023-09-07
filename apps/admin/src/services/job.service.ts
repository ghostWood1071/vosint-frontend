import { BASE_URL, BASE_URL_PIPELINE } from "@/constants/config";
import { ILogHistory, IPipeline } from "@/models/pipeline.type";
import { APIResponse } from "@/models/service.type";
import { DataFilterSocialPage } from "@/models/social.type";
import { apiClient, filterEmptyString } from "@/utils/api";

const getNewsListWithApiJob = async (filter: any) => {
  const result = await apiClient.get<any>(`/Job/api/get_result_job/News`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

const getNewsByNewsletterWithApiJob = async (
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

const getNewsBookmarksWithApiJob = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/Job/api/get_news_from_newsletter_id`, {
    params: filterEmptyString({
      ...filter,
      bookmarks: "1",
    }),
  });
  return result.data;
};

const getNewsFormElt = async (filter: Record<string, any>) => {
  const result = await apiClient.post(`/Job/api/get_news_from_elt`, filterEmptyString(filter));
  return result.data;
};

const getNewsVitalsWithApiJob = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/Job/api/get_news_from_newsletter_id`, {
    params: filterEmptyString({
      ...filter,
      vital: "1",
    }),
  });
  return result.data;
};

const getNewsViaSourceAndApiJob = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/Job/api/get_news_from_id_source`, {
    params: filterEmptyString({
      ...filter,
    }),
  });
  return result.data;
};

const getContentTranslation = async (inputLanguage: string, data: any) => {
  const result = await apiClient.post(`${BASE_URL_PIPELINE}/Job/api/translate`, {
    lang: inputLanguage,
    content: data,
  });
  return result.data;
};

const getNewsFromTTXVN = async (params: Record<string, any>) => {
  const searchParams = new URLSearchParams(filterEmptyString(params));

  const result = await apiClient.post(`/Job/api/get_news_from_ttxvn?${searchParams.toString()}`);

  return result.data;
};

const getEventsByNewsletterWithApiJob = async (
  // newsletterId: string,
  filter: Record<string, string>,
) => {
  const result = await apiClient.get(`/Job/api/view_time_line`, {
    params: filterEmptyString({
      // ...filter,
      news_letter_id: filter.news_letter_id,
      start_date: filter.start_date,
      end_date: filter.end_date,
      event_number: filter.eventNumber,
    }),
  });

  return result.data;
};

const getEventFormElt = async (filter: Record<string, any>) => {

  const result = await apiClient.post(`/Job/api/view_time_line`, filterEmptyString(filter));
  return result.data;
};

// const getAllEventCreatedByUser = async (filter: any) => {
//   const result = await apiClient.get<any>(`/event/search`, {
//     params: filterEmptyString(filter),
//   });

//   return result.data;
// };

const getNewsBasedOnObject = async (filter: Record<string, string>) => {
  const result = await apiClient.post(`${BASE_URL}/Job/search_news_from_object`, "", {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getHistory = async (id: string, filter: Record<string, any>) => {
  const url = `${BASE_URL_PIPELINE}/Job/api/get_log_history_error_or_getnews/${id}`;
  const result = await apiClient.get<APIResponse<IPipeline>>(url, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getLogHistoryLast = async (id: string) => {
  const url = `${BASE_URL_PIPELINE}/Job/api/get_log_history_last/${id}`;
  const result = await apiClient.get<ILogHistory>(url);
  return result.data;
};

const getSocialPage = async (filter: DataFilterSocialPage) => {
  const result = await apiClient.get(`${BASE_URL_PIPELINE}/Job/api/get_table`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getTTXVNNews = async (filter: any) => {
  const result = await apiClient.post<any>(`${BASE_URL_PIPELINE}/Job/api/get_table_ttxvn`, "", {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const handleCrawlNews = async (id: string) => {
  const result = await apiClient.post(`${BASE_URL_PIPELINE}/Job/api/crawling_ttxvn`, "", {
    params: filterEmptyString({ id: id }),
  });
  return result;
};

const verifyPipeline = async (id: string, mode_test = true) => {
  const searchParams = new URLSearchParams();
  if (!mode_test) {
    searchParams.append("mode_test", "False");
  }

  const url = `${BASE_URL_PIPELINE}/Job/api/run_only_job/${id}?${searchParams.toString()}`;
  const result = await apiClient.post(url, null, {
    timeout: 1_000 * 60 * 60,
  });
  return result.data;
};

const startJobById = async (id: string) => {
  const url = `${BASE_URL_PIPELINE}/Job/api/start_job/${id}`;
  const result = await apiClient.post(url);
  return result.data;
};

const stopJobById = async (id: string) => {
  const url = `${BASE_URL_PIPELINE}/Job/api/stop_job/${id}`;
  const result = await apiClient.post(url);
  return result.data;
};

const startAllJob = async () => {
  const url = `${BASE_URL_PIPELINE}/Job/api/start_all_jobs`;
  const result = await apiClient.post(url);
  return result.data;
};

const stopAllJob = async () => {
  const url = `${BASE_URL_PIPELINE}/Job/api/stop_all_jobs`;
  const result = await apiClient.post(url);
  return result.data;
};

export {
  getNewsListWithApiJob,
  getNewsByNewsletterWithApiJob,
  getNewsBookmarksWithApiJob,
  getNewsFormElt,
  getNewsVitalsWithApiJob,
  getNewsViaSourceAndApiJob,
  getContentTranslation,
  getNewsFromTTXVN,
  getEventsByNewsletterWithApiJob,
  getNewsBasedOnObject,
  getHistory,
  getLogHistoryLast,
  getSocialPage,
  getTTXVNNews,
  getEventFormElt,
  handleCrawlNews,
  verifyPipeline,
  startJobById,
  stopJobById,
  startAllJob,
  stopAllJob,
};
