import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export const PeriodicReport = lazyLoad(
  () => import("./periodic-report"),
  (module) => module.PeriodicReport,
  {
    fallback: <SplashScreen />,
  },
);

export const QuickReport = lazyLoad(
  () => import("./quick-report"),
  (module) => module.QuickReport,
  {
    fallback: <SplashScreen />,
  },
);

export const SyntheticReport = lazyLoad(
  () => import("./synthetic-report"),
  (module) => module.SyntheticReport,
  {
    fallback: <SplashScreen />,
  },
);
