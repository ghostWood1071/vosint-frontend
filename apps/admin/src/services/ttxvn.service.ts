import { apiClient, filterEmptyString } from "@/utils/api";

const apiTTXVNUrl = "pipeline/Job/api";

export const getTTXVNNews = async (filter: any) => {
  const result = await apiClient.post<any>(`${apiTTXVNUrl}/get_table_ttxvn`, "", {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const handleCrawlNews = async (id: string) => {
  const result = await apiClient.post(`${apiTTXVNUrl}/crawling_ttxvn/`, "", {
    params: filterEmptyString({ id: id }),
  });
  return result;
};
