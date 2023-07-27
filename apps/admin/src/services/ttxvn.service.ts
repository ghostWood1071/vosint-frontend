import { BASE_URL_PIPELINE } from "@/constants/config";
import { apiClient, filterEmptyString } from "@/utils/api";

export const getTTXVNNews = async (filter: any) => {
  const result = await apiClient.post<any>(`${BASE_URL_PIPELINE}/Job/api/get_table_ttxvn`, "", {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const handleCrawlNews = async (id: string) => {
  const result = await apiClient.post(`${BASE_URL_PIPELINE}/Job/api/crawling_ttxvn`, "", {
    params: filterEmptyString({ id: id }),
  });
  return result;
};

export const getAccountTTXVNConfig = async () => {
  const result = await apiClient.get(`/account-ttxvn-config`);
  return result.data;
};

export const updateAccountTTXVNConfig = async (id: string, data: Record<string, string>) => {
  const result = await apiClient.put(`/account-ttxvn-config/${id}`, data);
  return result.data;
};
