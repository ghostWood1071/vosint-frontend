import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export const UserManagerList = lazyLoad(
  () => import("./views/user-manager-list"),
  (module) => module.UserManagerList,
  {
    fallback: <SplashScreen />,
  },
);
