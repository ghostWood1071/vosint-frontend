import { apiClient, filterEmptyString } from "@/utils/api";

const apiCateConfigBaseV2Url = "/v2";

//get
export const getObjectCateConfig = async (filter: any) => {
  const result = await apiClient.get<any>(`${apiCateConfigBaseV2Url}/object/${filter.type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

export const getProxyConfig = async (filter: any) => {
  const result = await apiClient.get<any>(`${apiCateConfigBaseV2Url}/Proxy/${filter.text_search}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

//add
export const addNewObjectCateConfig = async (data: any, typeObject: any, statusData: any) => {
  const result = await apiClient.post<any>(`${apiCateConfigBaseV2Url}/object/`, data, {
    params: {
      type: typeObject,
      Status: statusData,
    },
  });
  return result.data;
};

export const addNewProxyConfig = async (data: any) => {
  const result = await apiClient.post<any>(`${apiCateConfigBaseV2Url}/Proxy/`, data);
  return result.data;
};

//delete
export const deleteObjectCateConfig = async (objectId: string) => {
  const result = await apiClient.delete<any>(`${apiCateConfigBaseV2Url}/object/${objectId}`);
  return result.data;
};

export const deleteProxyConfig = async (proxyId: string) => {
  const result = await apiClient.delete<any>(`${apiCateConfigBaseV2Url}/Proxy/${proxyId}`);
  return result.data;
};

//update
export const updateObjectCateConfig = async (objectId: string, data: any) => {
  const result = await apiClient.put(`${apiCateConfigBaseV2Url}/object/${objectId}`, data);
  return result.data;
};

export const updateProxyConfig = async (proxyId: string, data: any) => {
  const result = await apiClient.put(`${apiCateConfigBaseV2Url}/Proxy/${proxyId}`, data);
  return result.data;
};

//upload image
export const uploadFile = async (data: any) => {
  const result = await apiClient.post(`${apiCateConfigBaseV2Url}/upload/`, data, {
    headers: {
      accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
  return result;
};
