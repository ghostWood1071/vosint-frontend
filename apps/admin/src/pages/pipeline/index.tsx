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

export const InformationGathering = lazyLoad(
  () => import("./views/information-gathering-list"),
  (module) => module.InformationGatheringList,
  {
    fallback: <SplashScreen />,
  },
);

export const InformationGatheringCreate = lazyLoad(
  () => import("./views/information-gathering-create"),
  (module) => module.InformationGatheringCreate,
  {
    fallback: <SplashScreen />,
  },
);

export const InformationGatheringDetail = lazyLoad(
  () => import("./views/information-gathering-detail"),
  (module) => module.InformationGatheringDetail,
  { fallback: <SplashScreen /> },
);
