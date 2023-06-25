import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export const ReportLayout = lazyLoad(
  () => import("../components/report-layout"),
  (module) => module.ReportLayout,
  {
    fallback: <SplashScreen />,
  },
);

export const PeriodicReport = lazyLoad(
  () => import("./periodic-report"),
  (module) => module.PeriodicReport,
  {
    fallback: <SplashScreen />,
  },
);

export const QuickReportDetail = lazyLoad(
  () => import("./quick-report-detail"),
  (module) => module.QuickReportDetail,
  {
    fallback: <SplashScreen />,
  },
);

export const QuickReportCreate = lazyLoad(
  () => import("./quick-report-create"),
  (module) => module.QuickReportCreate,
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
