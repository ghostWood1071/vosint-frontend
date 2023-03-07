import {
  addNewsIdsToBookmarkUser,
  addNewsIdsToNewsletter,
  addNewsIdsToVitalUser,
  addNewsletter,
  deleteNewsIdInNewsletter,
  deleteNewsInBookmarkUser,
  deleteNewsInVitalUser,
  deleteNewsletter,
  getNewsBookmarks,
  getNewsByNewsletter,
  getNewsDetail,
  getNewsList,
  getNewsSidebar,
  getNewsSummary,
  getNewsVitals,
  getNewsletterDetail,
  updateNewsletter,
} from "@/services/news.service";
import { INewsSummaryDto, TNewsSummary } from "@/services/news.type";
import { message } from "antd";
import { UseMutationOptions, useMutation, useQuery, useQueryClient } from "react-query";

import { ETreeAction, ETreeTag } from "../../components/tree/tree.store";

export const CACHE_KEYS = {
  NewsSidebar: "NEWS_SIDEBAR",
  NewsList: "NEWS_LIST",
  CreateNewsletter: "CREATE_NEWSLETTER",
  NewsDetail: "NEWS_DETAIL",
  NewsletterDetail: "NEWSLETTER_DETAIL",
  Summary: "SUMMARY",
};

export const useNewsSidebar = () => {
  return useQuery([CACHE_KEYS.NewsSidebar], () => getNewsSidebar());
};

export const useNewsList = (filter: any, enabled = true) => {
  return useQuery([CACHE_KEYS.NewsList, filter], () => getNewsList(filter), { enabled });
};

export const useNewsDetail = (id: string | null) => {
  return useQuery([CACHE_KEYS.NewsDetail, id], () => getNewsDetail(id!), {
    enabled: !!id,
  });
};

export const useNewsletterDetail = (id: string | null, { onSuccess }: any) => {
  return useQuery([CACHE_KEYS.NewsletterDetail, id], () => getNewsletterDetail(id!), {
    enabled: !!id,
    onSuccess,
  });
};

export const useNewsByNewsletter = (id: string, filter: any) => {
  return useQuery([CACHE_KEYS.NewsList, id, filter], () => {
    if (id === ETreeTag.QUAN_TRONG) {
      return getNewsVitals(filter);
    }

    if (id === ETreeTag.DANH_DAU) {
      return getNewsBookmarks(filter);
    }

    return getNewsByNewsletter(id, filter);
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
        queryClient.invalidateQueries([CACHE_KEYS.NewsSidebar]);
        queryClient.invalidateQueries([CACHE_KEYS.NewsletterDetail]);
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
      if (newsletterId === ETreeTag.QUAN_TRONG) {
        return addNewsIdsToVitalUser(newsIds);
      }

      if (newsletterId === ETreeTag.DANH_DAU) {
        return addNewsIdsToBookmarkUser(newsIds);
      }

      return addNewsIdsToNewsletter(newsletterId, newsIds);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsList]);
        queryClient.invalidateQueries([CACHE_KEYS.NewsletterDetail]);
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
      if (newsletterId === ETreeTag.QUAN_TRONG) {
        return deleteNewsInVitalUser(newsId);
      }

      if (newsletterId === ETreeTag.DANH_DAU) {
        return deleteNewsInBookmarkUser(newsId);
      }

      return deleteNewsIdInNewsletter(newsletterId, newsId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsList]);
        queryClient.invalidateQueries([CACHE_KEYS.NewsletterDetail]);
        queryClient.invalidateQueries(["ME"]);
        message.success("Xoá tin thành công");
      },
    },
  );
};

export const useGetNewsSummaryLazy = (
  options?: UseMutationOptions<TNewsSummary, unknown, INewsSummaryDto>,
) => {
  return useMutation(
    [CACHE_KEYS.Summary],
    (data: INewsSummaryDto) => getNewsSummary(data),
    options,
  );
};
