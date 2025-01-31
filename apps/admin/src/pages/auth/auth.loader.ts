import { IChangePasswordDTO } from "@/models/auth.type";
import { changePassword, loginAuth } from "@/services/auth.service";
import { getMe } from "@/services/user.service";
import { AxiosError } from "axios";
import { UseMutationOptions, useMutation, useQuery } from "react-query";

export const CACHE_KEYS = {
  Login: "LOGIN",
  ME: "ME",
};

export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: any) => void;
  onError: () => void;
}) => {
  return useMutation((data: any) => loginAuth(data), { onSuccess, onError });
};

export const useGetMe = () => {
  return useQuery([CACHE_KEYS.ME], () => getMe());
};

export const useChangePassword = (
  options?: UseMutationOptions<unknown, AxiosError<{ detail: string }>, IChangePasswordDTO>,
) => {
  return useMutation((data) => changePassword(data), options);
};
