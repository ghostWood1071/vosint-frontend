import {
  addNewsIdsToNewsletter,
  addNewsletter,
  deleteNewsletter,
  getNewsDetail,
  getNewsList,
  getNewsSidebar,
  updateNewsletter,
} from "@/services/news.service";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { ETreeAction } from "../../components/tree/tree.store";

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
  return useQuery([CACHE_KEYS.NewsList, id, filter], () => getNewsDetail(id, filter));
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

export const useNewsIdToNewsletter = () => {
  // const queryClient = useQueryClient();
  return useMutation(
    ({ newsletterId, newsIds }: { newsletterId: string; newsIds: string[] }) =>
      addNewsIdsToNewsletter(newsletterId, newsIds),
    {
      onSuccess: () => {
        message.success("Thêm tin vào giỏ thành công");
        // queryClient.invalidateQueries(CACHE_KEYS.NewsSidebar);
      },
    },
  );
};
