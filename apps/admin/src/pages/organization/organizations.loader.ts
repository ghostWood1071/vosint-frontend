import { getNewsList } from "@/services/news.service";
import {
  getNewsByObjectId,
  getObject,
  getOrganizationsSidebar,
} from "@/services/organizations.service";
import { useQuery } from "react-query";

export const CACHE_KEYS = {
  OrganizationsSidebar: "ORGANIZATIONS_SIDEBAR",
  NewsList: "NEWS_LIST",
  Object: "OBJECT",
};

export const useOrganizationsSidebar = () => {
  return useQuery([CACHE_KEYS.OrganizationsSidebar], () => getOrganizationsSidebar());
};

export const useNewsList = () => {
  return useQuery([CACHE_KEYS.NewsList], () => getNewsList({}));
};

export const useObjectList = (type: string, filter: any) => {
  return useQuery([CACHE_KEYS.Object, type, filter], () => getObject(filter, type));
};

export const useNewsByObjectId = (id: string, filter: Record<string, any>) => {
  return useQuery([CACHE_KEYS.NewsList, id, filter], () => getNewsByObjectId(id, filter));
};

export enum OBJECT_TYPE {
  DOI_TUONG = "Đối tượng",
  TO_CHUC = "Tổ chức",
  QUOC_GIA = "Quốc gia",
}
