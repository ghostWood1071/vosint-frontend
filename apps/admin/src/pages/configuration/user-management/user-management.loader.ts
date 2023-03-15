import {
  createUser,
  deleteUser,
  getUsers,
  updateProfile,
  updateUser,
  uploadAvatar,
} from "@/services/user.service";
import { UseMutationOptions, useMutation, useQuery, useQueryClient } from "react-query";

export const CACHE_KEYS = {
  LIST: "LIST",
};

export const useUserManager = (filter: Record<string, string>) => {
  return useQuery([CACHE_KEYS.LIST, filter], () => getUsers(filter));
};

export const useCreateUser = ({ onSuccess }: any) => {
  const queryClient = useQueryClient();

  return useMutation((values) => createUser(values), {
    onSuccess() {
      queryClient.invalidateQueries([CACHE_KEYS.LIST]);
      onSuccess();
    },
  });
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

export const useDeleteUser = ({ onSuccess }: any) => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deleteUser(id), {
    onSuccess() {
      queryClient.invalidateQueries([CACHE_KEYS.LIST]);
      onSuccess?.();
    },
  });
};

export const useUploadAvatar = (options?: UseMutationOptions<string, unknown, FormData>) => {
  return useMutation((data) => uploadAvatar(data), options);
};
