import { getNewsList, getNewsSidebar } from "@/services/news.service";
import { useQuery } from "react-query";

export const CACHE_KEYS = {
  NewsSidebar: "NEWS_SIDEBAR",
  NewsList: "NEWS_LIST",
};

export const useNewsSidebar = () => {
  return useQuery([CACHE_KEYS.NewsSidebar], () => getNewsSidebar());
};

export const useNewsList = () => {
  return useQuery([CACHE_KEYS.NewsList], () => getNewsList());
};
