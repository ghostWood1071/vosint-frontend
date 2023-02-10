import { getUserManager } from "@/services/user-manager.service";
import { useQuery } from "react-query";

export const USER_MANAGER = "user_manager";

export const useUserManager = () => {
  return useQuery([USER_MANAGER], () => getUserManager());
};
