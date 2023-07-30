import { useQuery } from "react-query";

import { getHotNewsToday } from "./dashboard.service";

export const CACHE_KEYS = {
  HOT_NEWS_TODAY: "HOT_NEWS_TODAY",
};

export const useHotNewsToday = () => {
  return useQuery([CACHE_KEYS.HOT_NEWS_TODAY], () => getHotNewsToday());
};
