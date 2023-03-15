import { apiClient, filterEmptyString } from "@/utils/api";

const apiUserBaseUrl = "/v2";

export const getUsers = async (filter: Record<string, string>) => {
  const result = await apiClient.get<any>(`${apiUserBaseUrl}/user`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

export const createUser = async (body: any) => {
  const result = await apiClient.post(`${apiUserBaseUrl}/user`, body);
  return result.data;
};

export const updateUser = async (id: string, body: any) => {
  const result = await apiClient.put(`${apiUserBaseUrl}/user/${id}`, body);
  return result.data;
};

export const updateProfile = async (body: any) => {
  const result = await apiClient.put(`${apiUserBaseUrl}/user/profile`, body);
  return result.data;
};

export const deleteUser = async (id: string) => {
  const result = await apiClient.delete(`${apiUserBaseUrl}/user/${id}`);
  return result.data;
};

export const uploadAvatar = async (data: FormData) => {
  return apiClient
    .post<string>(`${apiUserBaseUrl}/user/avatar`, data, {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};
