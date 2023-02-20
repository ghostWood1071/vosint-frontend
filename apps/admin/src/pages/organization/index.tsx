import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export { OrganizationsLayout } from "./components/organizations-layout";

export const OrganizationsListPage = lazyLoad(
  () => import("./views/organizations-list.page"),
  (module) => module.OrganizationsListPage,
  { fallback: <SplashScreen /> },
);
