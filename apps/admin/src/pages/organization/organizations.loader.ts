import { getNewsList } from "@/services/news.service";
import { getOrganizationsSidebar } from "@/services/organizations.service";
import { useQuery } from "react-query";

export const CACHE_KEYS = {
  OrganizationsSidebar: "ORGANIZATIONS_SIDEBAR",
  NewsList: "NEWS_LIST",
};

export const useOrganizationsSidebar = () => {
  return useQuery([CACHE_KEYS.OrganizationsSidebar], () => getOrganizationsSidebar());
};

export const useNewsList = () => {
  return useQuery([CACHE_KEYS.NewsList], () => getNewsList({}));
};
