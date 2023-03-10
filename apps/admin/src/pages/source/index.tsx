import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export { SourceManagementLayout } from "./components/source-management-layout";

export const SourceGroup = lazyLoad(
  () => import("./source-group/source-group-page"),
  (module) => module.ViewList,
  { fallback: <SplashScreen /> },
);
