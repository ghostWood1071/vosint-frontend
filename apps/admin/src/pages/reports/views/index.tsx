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

export const SynthesisReportDetail = lazyLoad(
  () => import("./synthesis-report-detail"),
  (module) => module.SynthesisReportDetail,
  {
    fallback: <SplashScreen />,
  },
);

export const SynthesisReportCreate = lazyLoad(
  () => import("./synthesis-report-create"),
  (module) => module.SynthesisReportCreate,
  {
    fallback: <SplashScreen />,
  },
);
