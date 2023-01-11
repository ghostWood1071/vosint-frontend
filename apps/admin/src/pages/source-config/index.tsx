import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export const SourceConfigList = lazyLoad(
  () => import("./views/source-config-list"),
  (module) => module.SourceConfigList,
  {
    fallback: <SplashScreen />,
  },
);
