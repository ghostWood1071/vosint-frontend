import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export { NewsLayout } from "./components/news-layout";

export const NewsListPage = lazyLoad(
  () => import("./views/news-list.page"),
  (module) => module.NewsListPage,
  { fallback: <SplashScreen /> },
);

export const NewsDetailPage = lazyLoad(
  () => import("./views/news-detail.page"),
  (module) => module.NewsDetailPage,
  { fallback: <SplashScreen /> },
);
