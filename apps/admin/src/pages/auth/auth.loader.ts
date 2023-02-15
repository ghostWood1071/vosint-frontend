import { loginAuth } from "@/services/auth.service";
import { useMutation } from "react-query";

export const CACHE_KEYS = {
  Login: "LOGIN",
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
