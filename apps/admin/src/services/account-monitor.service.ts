import { apiClient, filterEmptyString } from "@/utils/api";

const getAdminMonitor = async (filter: any) => {
  const url = `/account-monitor/get_by_social/${filter.type_data}`;
  const result = await apiClient.get<any>(url, {});
  return result.data;
};

const postAccountMonitor = async (data: any) => {
  const result = await apiClient.post<any>(`/account-monitor`, data);
  return result.data;
};

const updateAccountMonitor = async (data: any) => {
  const result = await apiClient.put(`/account-monitor/edit_account_monitor`, data);
  return result.data;
};

const deleteAccountMonitor = async (SocialId: string) => {
  const result = await apiClient.delete<any>(`/account-monitor/delete/${SocialId}`);
  return result.data;
};

export { getAdminMonitor, postAccountMonitor, updateAccountMonitor, deleteAccountMonitor };
