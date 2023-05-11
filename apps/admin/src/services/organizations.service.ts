import { apiClient, filterEmptyString } from "@/utils/api";

const apiBaseUrlV2 = "";

export const getOrganizationsSidebar = async () => {
  const result = await apiClient.get<any>(`organizations-sidebar`);
  return result.data;
};

export const getObject = async (filter: Record<string, string>, type: any) => {
  const result = await apiClient.get(`${apiBaseUrlV2}/object/${type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getNewsByObjectId = async (objectId: string, filter: Record<string, string>) => {
  const result = await apiClient.get(`${apiBaseUrlV2}/object/${objectId}/news`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};
