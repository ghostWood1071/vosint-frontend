import { apiClient } from "@/utils/api";

export const getOrganizationsSidebar = async () => {
  const result = await apiClient.get<any>(`organizations-sidebar`);
  return result.data;
};
