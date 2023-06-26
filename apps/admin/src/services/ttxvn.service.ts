import { apiClient, filterEmptyString } from "@/utils/api";

const apiTTXVNNewsBaseV2Url = "";

export const getTTXVNNews = async (filter: any) => {
  const result = await apiClient.get<any>(
    `${apiTTXVNNewsBaseV2Url}/vnnew/get-craw-vnnew/${filter.check_crawl ?? "all"}`,
    {
      params: filterEmptyString(filter),
    },
  );
  return result.data;
};

export const updateTTXVNNews = async (id: string, data: any) => {
  const result = await apiClient.put(`${apiTTXVNNewsBaseV2Url}/${id}`, data);
  return result.data;
};
