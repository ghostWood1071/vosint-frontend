import { getMe, loginAuth } from "@/services/auth.service";
import { useMutation, useQuery } from "react-query";

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
