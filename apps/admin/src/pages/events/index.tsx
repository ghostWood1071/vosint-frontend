import { SplashScreen } from "@/components";
import { lazyLoad } from "@/utils/loadable";

export { EventLayout } from "./components/event-layout";

export const EventPage = lazyLoad(
  () => import("./event.page"),
  (module) => module.EventPage,
  { fallback: <SplashScreen /> },
);

export const SystemEventPage = lazyLoad(
  () => import("./system-event.page"),
  (module) => module.SystemEventPage,
  { fallback: <SplashScreen /> },
);
