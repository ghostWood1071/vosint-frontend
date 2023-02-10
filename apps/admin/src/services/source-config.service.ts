import { apiClient } from "@/utils/api";

// import { APIResponse } from "./service.types";

export const getSourceConfig = async () => {
  const result = await apiClient.get<any>(`/source-config`);
  return result.data;
};
