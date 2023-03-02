import { apiClient, filterEmptyString } from "@/utils/api";

const apiBaseUrlV2 = "/v2";

export const getOrganizationsSidebar = async () => {
  const result = await apiClient.get<any>(`organizations-sidebar`);
  return result.data;
};

export const getObject = async (filter: Record<string, string>, type: any, name: any) => {
  const result = await apiClient.get(`${apiBaseUrlV2}/object/${type}/${name}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};
