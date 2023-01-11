import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export { NewsLayout } from "./components/news-layout";

export const NewsListPage = lazyLoad(
  () => import("./views/news-list.page"),
  (module) => module.NewsListPage,
  { fallback: <SplashScreen /> },
);
