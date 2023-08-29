import { apiClient, filterEmptyString } from "@/utils/api";

const getObjectCateConfig = async (filter: any) => {
  const result = await apiClient.get<any>(`/object/${filter.type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getObject = async (filter: Record<string, string>, type: any) => {
  const result = await apiClient.get(`/object/${type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getNewsByObjectId = async (objectId: string, filter: Record<string, string>) => {
  const result = await apiClient.get(`/object/${objectId}/news`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const addNewObjectCateConfig = async (data: any) => {
  const result = await apiClient.post<any>(`/object`, data, {
    params: {
      type: data.object_type,
      Status: data.status,
    },
  });
  return result.data;
};

const updateObjectCateConfig = async (objectId: string, data: any) => {
  const result = await apiClient.put(`/object/${objectId}`, data);
  return result.data;
};

const deleteObjectCateConfig = async (objectId: string) => {
  const result = await apiClient.delete<any>(`/object/${objectId}`);
  return result.data;
};

export {
  getObjectCateConfig,
  getObject,
  getNewsByObjectId,
  addNewObjectCateConfig,
  updateObjectCateConfig,
  deleteObjectCateConfig,
};
