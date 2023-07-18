import { apiClient, filterEmptyString } from "@/utils/api";

export const getUsers = async (filter: Record<string, string>) => {
  const result = await apiClient.get<any>(`/user`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

export const createUser = async (body: any) => {
  const result = await apiClient.post(`/user`, body);
  return result.data;
};

export const updateUser = async (id: string, body: any) => {
  const result = await apiClient.put(`/user/${id}`, body);
  return result.data;
};

export const updateProfile = async (body: any) => {
  const result = await apiClient.put(`/user/profile`, body);
  return result.data;
};

export const deleteUser = async (id: string) => {
  const result = await apiClient.delete(`/user/${id}`);
  return result.data;
};

export const uploadAvatar = async (data: FormData) => {
  return apiClient
    .post<string>(`/user/avatar`, data, {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};
