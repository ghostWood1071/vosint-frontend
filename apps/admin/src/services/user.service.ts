import { apiClient, filterEmptyString } from "@/utils/api";

const getMe = async () => {
  const result = await apiClient.get(`/user/me`);
  return result.data;
};

const getUsers = async (filter: Record<string, string>) => {
  const result = await apiClient.get<any>(`/user`, {
    params: filterEmptyString(filter),
  });

  return result.data;
};

const getNewsBookmarks = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/user/bookmarks`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const getNewsVitals = async (filter: Record<string, string>) => {
  const result = await apiClient.get(`/user/vital`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};

const gePriorityObject = async (filter: any) => {
  const result = await apiClient.get<any>(`/user/interested/${filter.type}`, {
    params: filterEmptyString(filter),
  });
  return result.data;
};
const createUser = async (body: any) => {
  const result = await apiClient.post(`/user`, body);
  return result.data;
};

const addNewsIdsToVitalUser = async (newsIds: string[]) => {
  const result = await apiClient.post<any>(`/user/vital`, newsIds);
  return result;
};

const addPriorityObject = async (data: any) => {
  const result = await apiClient.post<any>(`/user/interested`, data);
  return result.data;
};

const uploadAvatar = async (data: FormData) => {
  return apiClient
    .post<string>(`/user/avatar`, data, {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

const addNewsIdsToBookmarkUser = async (newsIds: string[]) => {
  const result = await apiClient.post<any>(`/user/bookmarks`, newsIds);
  return result;
};
const updateUser = async (id: string, body: any) => {
  const result = await apiClient.put(`/user/${id}`, body);
  return result.data;
};

const updateProfile = async (body: any) => {
  const result = await apiClient.put(`/user/profile`, body);
  return result.data;
};

// const updatePriorityObject = async (priorityObjectId: string, data: any) => {
//   const result = await apiClient.put(
//     `/user/interested/${priorityObjectId}`,
//     data,
//   );
//   return result.data;
// };

const deleteUser = async (id: string) => {
  const result = await apiClient.delete(`/user/${id}`);
  return result.data;
};

const deleteNewsInBookmarkUser = async (newsIds: string[]) => {
  const result = await apiClient.put<any>(`/user/bookmarks`, newsIds);
  return result;
};

const deleteNewsInVitalUser = async (newsIds: string[]) => {
  const result = await apiClient.put<any>(`/user/vital`, newsIds);
  return result;
};

const deletePriorityObject = async (priorityObjectId: string) => {
  const result = await apiClient.delete<any>(`/user/interested/${priorityObjectId}`);
  return result.data;
};

export {
  getMe,
  getUsers,
  getNewsBookmarks,
  getNewsVitals,
  gePriorityObject,
  uploadAvatar,
  createUser,
  addNewsIdsToBookmarkUser,
  addNewsIdsToVitalUser,
  addPriorityObject,
  updateUser,
  updateProfile,
  deleteUser,
  deleteNewsInBookmarkUser,
  deleteNewsInVitalUser,
  deletePriorityObject,
};
