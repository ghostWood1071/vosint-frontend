import {
  createUser,
  deleteUser,
  getUsers,
  updateProfile,
  updateUser,
  uploadAvatar,
} from "@/services/user.service";
import { AxiosError } from "axios";
import { UseMutationOptions, useMutation, useQuery } from "react-query";

export const CACHE_KEYS = {
  LIST: "LIST",
};

export const useUserManager = (filter: Record<string, string>) => {
  return useQuery([CACHE_KEYS.LIST, filter], () => getUsers(filter));
};

export const useCreateUser = (
  options?: UseMutationOptions<any, AxiosError<{ detail: string }>, any, { previousData: any }>,
) => {
  return useMutation((values) => createUser(values), options);
};

export const useUpdateUser = (
  options?: UseMutationOptions<any, unknown, { _id: string; values: any }>,
) => {
  return useMutation(({ _id, values }) => updateUser(_id, values), options);
};

export const useUpdateProfile = (
  options?: UseMutationOptions<any, unknown, Record<string, string>>,
) => {
  return useMutation((body) => updateProfile(body), options);
};

export const useDeleteUser = (options?: UseMutationOptions<any, unknown, string>) => {
  return useMutation((id: string) => deleteUser(id), options);
};

export const useUploadAvatar = (options?: UseMutationOptions<string, unknown, FormData>) => {
  return useMutation((data) => uploadAvatar(data), options);
};
