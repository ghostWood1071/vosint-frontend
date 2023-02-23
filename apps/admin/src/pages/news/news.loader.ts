import {
  addNewsToBookmarkUser as addNewsIdsToBookmarkUser,
  addNewsIdsToNewsletter,
  addNewsletter,
  deleteNewsIdInNewsletter,
  deleteNewsInBookmarkUser,
  deleteNewsletter,
  getNewsBookmarks,
  getNewsDetail,
  getNewsList,
  getNewsSidebar,
  updateNewsletter,
} from "@/services/news.service";
import { message } from "antd";
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
  return useQuery([CACHE_KEYS.NewsList, id, filter], () => {
    if (id === ETreeTag.DANH_DAU) {
      return getNewsBookmarks(filter);
    }

    return getNewsDetail(id, filter);
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

export const useNewsIdToNewsletter = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ newsletterId, newsIds }: { newsletterId: string; newsIds: string[] }) => {
      if (newsletterId === ETreeTag.DANH_DAU) {
        return addNewsIdsToBookmarkUser(newsIds);
      }

      if (newsletterId === ETreeTag.QUAN_TRONG) {
        return new Promise(() => "pending...");
      }

      return addNewsIdsToNewsletter(newsletterId, newsIds);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsList]);
        queryClient.invalidateQueries(["ME"]);
        message.success("Thêm tin thành công");
      },
    },
  );
};

export const useDeleteNewsInNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation<any, any, { newsletterId: string; newsId: string[] }>(
    ({ newsletterId, newsId }) => {
      if (newsletterId === ETreeTag.DANH_DAU) {
        return deleteNewsInBookmarkUser(newsId);
      }

      return deleteNewsIdInNewsletter(newsletterId, newsId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsList]);
        queryClient.invalidateQueries(["ME"]);
        message.success("Xoá tin thành công");
      },
    },
  );
};
