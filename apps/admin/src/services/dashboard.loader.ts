import { useQuery } from "react-query";

import { getHotNewsToday, getNewsCountryToday, getNewsHoursToday } from "./dashboard.service";

export const CACHE_KEYS = {
  HOT_NEWS_TODAY: "HOT_NEWS_TODAY",
  NEWS_COUNTRY_TODAY: "NEWS_COUNTRY_TODAY",
  NEWS_HOURS_TODAY: "NEWS_HOURS_TODAY",
};

export const useHotNewsToday = () => {
  return useQuery([CACHE_KEYS.HOT_NEWS_TODAY], () => getHotNewsToday());
};

export const useNewsCountryToday = () => {
  return useQuery([CACHE_KEYS.NEWS_COUNTRY_TODAY], () => getNewsCountryToday());
};

export const useNewsHoursToday = () => {
  return useQuery([CACHE_KEYS.NEWS_HOURS_TODAY], () => getNewsHoursToday());
};
