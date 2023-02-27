import { createUser, deleteUser, getUsers, updateUser } from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "react-query";

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

export const useUpdateUser = ({ onSuccess }: any) => {
  const queryClient = useQueryClient();

  return useMutation(({ _id, values }: { _id: string; values: any }) => updateUser(_id, values), {
    onSuccess() {
      queryClient.invalidateQueries([CACHE_KEYS.LIST]);
      onSuccess();
    },
  });
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
