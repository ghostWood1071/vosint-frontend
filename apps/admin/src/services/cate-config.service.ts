import { apiClient } from "@/utils/api";

const apiCateConfigBaseV2Url = "";

//get
export const getOrganizationCateConfig = async () => {
  const result = await apiClient.get<any>(`${apiCateConfigBaseV2Url}/organize`);
  return result.data;
};

export const getObjectCateConfig = async () => {
  const result = await apiClient.get<any>(`${apiCateConfigBaseV2Url}/object`);
  return result.data;
};

export const getCountryCateConfig = async () => {
  const result = await apiClient.get<any>(`${apiCateConfigBaseV2Url}/country`);
  return result.data;
};

//add
export const addNewOrganizationCateConfig = async (data: any) => {
  const result = await apiClient.post<any>(`${apiCateConfigBaseV2Url}/organize/`, data, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return result.data;
};

export const addNewObjectCateConfig = async (data: any) => {
  const result = await apiClient.post<any>(`${apiCateConfigBaseV2Url}/object/`, data, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return result.data;
};

export const addNewCountryCateConfig = async (data: any) => {
  const result = await apiClient.post<any>(`${apiCateConfigBaseV2Url}/country/`, data, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return result.data;
};

//delete
export const deleteCountryCateConfig = async (countryCateId: string) => {
  const result = await apiClient.delete<any>(`${apiCateConfigBaseV2Url}/country/${countryCateId}`);
  return result.data;
};

export const deleteOrganizationCateConfig = async (organizationCateId: string) => {
  const result = await apiClient.delete<any>(
    `${apiCateConfigBaseV2Url}/organize/${organizationCateId}`,
  );
  return result.data;
};
export const deleteObjectCateConfig = async (objectCateId: string) => {
  const result = await apiClient.delete<any>(`${apiCateConfigBaseV2Url}/object/${objectCateId}`);
  return result.data;
};

//update
export const updateOrganizationCateConfig = async (organizationCateId: string, data: any) => {
  const result = await apiClient.put(
    `${apiCateConfigBaseV2Url}/organize/${organizationCateId}`,
    data,
  );
  return result.data;
};
export const updateObjectCateConfig = async (objectCateId: string, data: any) => {
  const result = await apiClient.put(`${apiCateConfigBaseV2Url}/object/${objectCateId}`, data);
  return result.data;
};
export const updateCountryCateConfig = async (countryCateId: string, data: any) => {
  const result = await apiClient.put(`${apiCateConfigBaseV2Url}/country/${countryCateId}`, data);
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
