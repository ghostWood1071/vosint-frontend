import { getEventBaseOnKhachTheAndChuThe, getKhachTheAndChuThe } from "@/services/event.service";
import { getNewsBasedOnObject } from "@/services/job.service";
import { getNewsList } from "@/services/news.service";
import { getNewsByObjectId, getObject } from "@/services/object.service";
import { getOrganizationsSidebar } from "@/services/organizations.service";
import { useInfiniteQuery, useQuery } from "react-query";

export const CACHE_KEYS = {
  OrganizationsSidebar: "ORGANIZATIONS_SIDEBAR",
  NewsList: "NEWS_LIST",
  Object: "OBJECT",
  ListKhachTheAndChuThe: "LIST_KHACHTHE_AND_CHUTHE",
  ListEvent: "LIST_EVENT",
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

export const useNewsByObjectId = (filter: Record<string, any>) => {
  return useQuery([CACHE_KEYS.NewsList, filter], () => getNewsBasedOnObject(filter));
};

export const useGetKhachTheAndChuThe = (filter: Record<string, string>) => {
  return useQuery([CACHE_KEYS.ListKhachTheAndChuThe, filter], () => getKhachTheAndChuThe(filter));
};

export const useInfiniteuseGetEventBaseOnKTAndCT = (filter: Record<string, string>) => {
  return useInfiniteQuery<any>([CACHE_KEYS.ListEvent], (data) =>
    getEventBaseOnKhachTheAndChuThe(
      data.pageParam !== undefined
        ? { ...data.pageParam, ...filter }
        : { skip: 1, limit: 50, ...filter },
    ),
  );
};

export const useInfiniteNewsByObject = (filter: Record<string, any>) => {
  return useInfiniteQuery<any>([CACHE_KEYS.NewsList], (data) =>
    getNewsBasedOnObject(
      data.pageParam !== undefined
        ? { ...data.pageParam, ...filter }
        : { page_number: 1, page_size: 50, ...filter },
    ),
  );
};

export const useNewsByObject = (id: any, filter: Record<string, any>) => {
  return useInfiniteQuery<any>([CACHE_KEYS.NewsList], (data) => getNewsByObjectId(id, filter));
};

export enum OBJECT_TYPE {
  DOI_TUONG = "Đối tượng",
  TO_CHUC = "Tổ chức",
  QUOC_GIA = "Quốc gia",
}
