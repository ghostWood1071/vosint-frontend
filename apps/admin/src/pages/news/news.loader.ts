import {
  addNewsIdsToNewsletter,
  addNewsletter,
  deleteNewsIdInNewsletter,
  deleteNewsletter,
  getNewsDetail,
  getNewsList,
  getNewsSidebar,
  updateNewsletter,
} from "@/services/news.service";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { ETreeAction, ETreeTag } from "../../components/tree/tree.store";

export const CACHE_KEYS = {
  NewsSidebar: "NEWS_SIDEBAR",
  NewsList: "NEWS_LIST",
  CreateNewsletter: "CREATE_NEWSLETTER",
};

export const useNewsSidebar = () => {
  return useQuery([CACHE_KEYS.NewsSidebar], () => getNewsSidebar());
};

export const useNewsList = (filter: any) => {
  return useQuery([CACHE_KEYS.NewsList, filter], () => getNewsList(filter));
};

export const useNewsDetail = (id: string, filter: any) => {
  return useQuery([CACHE_KEYS.NewsList, id, filter], () => getNewsDetail(id, filter), {
    enabled: id !== ETreeTag.QUAN_TRONG && id !== ETreeTag.DANH_DAU,
  });
};

export const useMutationNewsSidebar = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, _id, ...data }: any) => {
      if (action === ETreeAction.DELETE) {
        return deleteNewsletter(_id);
      }

      if (action === ETreeAction.UPDATE) {
        return updateNewsletter(_id, data);
      }

      if (action === ETreeAction.CREATE) {
        return addNewsletter(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CACHE_KEYS.NewsSidebar);
      },
      onError: () => {},
    },
  );
};

export const useDeleteNewsletter = () => {
  const queryClient = useQueryClient();
  return useMutation((newsletterId: any) => deleteNewsletter(newsletterId), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.NewsSidebar);
    },
  });
};

export const useNewsIdToNewsletter = (id: string, filter?: any) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ newsletterId, newsIds }: { newsletterId: string; newsIds: string[] }) => {
      if (newsletterId === ETreeTag.DANH_DAU) {
        return new Promise(() => "pending...");
      }

      if (newsletterId === ETreeTag.QUAN_TRONG) {
        return new Promise(() => "pending...");
      }

      return addNewsIdsToNewsletter(newsletterId, newsIds);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsList, id, filter]);
      },
    },
  );
};

export const useDeleteNewsInNewsletter = (id: string, filter?: any) => {
  const queryClient = useQueryClient();

  return useMutation<any, any, { newsletterId: string; newsId: string[] }>(
    ({ newsletterId, newsId }) => deleteNewsIdInNewsletter(newsletterId, newsId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsList, id, filter]);
      },
    },
  );
};
