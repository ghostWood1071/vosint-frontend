import { BASE_URL_PIPELINE } from "@/constants/config";
import { apiClient, filterEmptyString } from "@/utils/api";

const getAccountTTXVNConfig = async () => {
  const result = await apiClient.get(`/account-ttxvn-config`);
  return result.data;
};

const updateAccountTTXVNConfig = async (id: string, data: Record<string, string>) => {
  const result = await apiClient.put(`/account-ttxvn-config/${id}`, data);
  return result.data;
};

export { getAccountTTXVNConfig, updateAccountTTXVNConfig };
