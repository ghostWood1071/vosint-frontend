import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export const TTXVNNewsPage = lazyLoad(
  () => import("./ttxvn.page"),
  (module) => module.TTXVNNewsPage,
  { fallback: <SplashScreen /> },
);
