import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export { PipelineLayout } from "./components/pipeline-layout";

export const DashboardStatistics = lazyLoad(
  () => import("./views/dashboard-statistics"),
  (module) => module.DashboardStatistics,
  {
    fallback: <SplashScreen />,
  },
);

export const DataProcessing = lazyLoad(
  () => import("./views/data-processing"),
  (module) => module.DataProcessing,
  {
    fallback: <SplashScreen />,
  },
);

export const PipelineList = lazyLoad(
  () => import("./views/pipeline-list"),
  (module) => module.PipelineList,
  {
    fallback: <SplashScreen />,
  },
);

export const PipelineCreate = lazyLoad(
  () => import("./views/pipeline-create"),
  (module) => module.PipelineCreate,
  {
    fallback: <SplashScreen />,
  },
);

export const PipelineDetail = lazyLoad(
  () => import("./views/pipeline-detail"),
  (module) => module.PipelineDetail,
  { fallback: <SplashScreen /> },
);
