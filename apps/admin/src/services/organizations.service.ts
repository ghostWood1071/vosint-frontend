import { BASE_URL_PIPELINE } from "@/constants/config";
import { apiClient, filterEmptyString } from "@/utils/api";

const getOrganizationsSidebar = async () => {
  const result = await apiClient.get<any>(`organizations-sidebar`);
  return result.data;
};

export { getOrganizationsSidebar };
