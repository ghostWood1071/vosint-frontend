import { BASE_URL_PIPELINE } from "@/constants/config";
import { apiClient, filterEmptyString } from "@/utils/api";

export const getOrganizationsSidebar = async () => {
  const result = await apiClient.get<any>(`organizations-sidebar`);
  return result.data;
};

export const getObject = async (filter: Record<string, string>, type: any) => {
  const result = await apiClient.get(`/object/${type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getNewsByObjectId = async (objectId: string, filter: Record<string, string>) => {
  const result = await apiClient.get(`/object/${objectId}/news`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getKhachTheAndChuThe = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/event/get-chu-the-khach-the`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getEventBaseOnKhachTheAndChuThe = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/event/search-based-chu-the-khach-the`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getNewsBasedOnObject = async (filter: Record<string, string>) => {
  const result = await apiClient.post(`${BASE_URL_PIPELINE}/Job/api/elt_search`, "", {
    params: filterEmptyString(filter),
  });
  return result.data;
};
