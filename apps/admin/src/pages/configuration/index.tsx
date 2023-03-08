import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export { ConfigurationLayout } from "./components/configuration-layout";

export const NewsCategoryConfig = lazyLoad(
  () => import("./news-config/news-category/news-category-config.page"),
  (module) => module.CategoryNewsConfig,
  { fallback: <SplashScreen /> },
);

export const NewsSourceConfig = lazyLoad(
  () => import("./news-config/news-source/news-source-list.page"),
  (module) => module.SourceNewsConfigList,
  {
    fallback: <SplashScreen />,
  },
);

export const AccountForMonitoringFacebook = lazyLoad(
  () => import("./news-config/news-accounts/facebook/accounts-for-monitoring-facebook"),
  (module) => module.AccountForMonitoringFacebook,
  {
    fallback: <SplashScreen />,
  },
);
export const AccountForMonitoringTwitter = lazyLoad(
  () => import("./news-config/news-accounts/twitter/accounts-for-monitoring-twitter"),
  (module) => module.AccountForMonitoringTwitter,
  {
    fallback: <SplashScreen />,
  },
);
export const AccountForMonitoringTiktok = lazyLoad(
  () => import("./news-config/news-accounts/tiktok/accounts-for-monitoring-tiktok"),
  (module) => module.AccountForMonitoringTiktok,
  {
    fallback: <SplashScreen />,
  },
);

export const FacebookConfig = lazyLoad(
  () => import("./social-config/facebook/facebook-config.page"),
  (module) => module.FacebookConfig,
  {
    fallback: <SplashScreen />,
  },
);

export const TwitterConfig = lazyLoad(
  () => import("./social-config/twitter/twitter-config.page"),
  (module) => module.TwitterConfig,
  {
    fallback: <SplashScreen />,
  },
);

export const TiktokConfig = lazyLoad(
  () => import("./social-config/tiktok/tiktok-config.page"),
  (module) => module.TiktokConfig,
  {
    fallback: <SplashScreen />,
  },
);

export const CollectDataConfig = lazyLoad(
  () => import("./social-config/collect-data/collect-data.page"),
  (module) => module.CollectDataConfig,
  {
    fallback: <SplashScreen />,
  },
);

export const ProxyConfig = lazyLoad(
  () => import("./proxy-config/proxy-config.page"),
  (module) => module.ProxyConfig,
  {
    fallback: <SplashScreen />,
  },
);

export const UserManagement = lazyLoad(
  () => import("./user-management/user-management.page"),
  (module) => module.UserManagerList,
  {
    fallback: <SplashScreen />,
  },
);

export const OrganizationCate = lazyLoad(
  () => import("./organization-cate"),
  (module) => module.OrganizationCate,
  {
    fallback: <SplashScreen />,
  },
);

export const CountryCate = lazyLoad(
  () => import("./country-cate"),
  (module) => module.CountryCate,
  {
    fallback: <SplashScreen />,
  },
);

export const ObjectCate = lazyLoad(
  () => import("./object-cate"),
  (module) => module.ObjectCate,
  {
    fallback: <SplashScreen />,
  },
);
