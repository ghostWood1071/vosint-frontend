import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export { SocialLayout } from "./components/social-layout";

export const SocialDashboard = lazyLoad(
  () => import("./social-dashboard"),
  (module) => module.SocialDashboard,
  { fallback: <SplashScreen /> },
);

export const PriorityObject = lazyLoad(
  () => import("./priority-object"),
  (module) => module.PriorityObject,
  {
    fallback: <SplashScreen />,
  },
);

export const Facebook = lazyLoad(
  () => import("./social-page/facebook"),
  (module) => module.Facebook,
  {
    fallback: <SplashScreen />,
  },
);

export const Twitter = lazyLoad(
  () => import("./social-page/twitter"),
  (module) => module.Twitter,
  {
    fallback: <SplashScreen />,
  },
);

export const Tiktok = lazyLoad(
  () => import("./social-page/tiktok"),
  (module) => module.Tiktok,
  {
    fallback: <SplashScreen />,
  },
);
