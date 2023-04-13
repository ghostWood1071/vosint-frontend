import { ETreeAction, ETreeTag, MTreeAction, MTreeTag } from "@/components/news/news-state";
import {
  AddManyEventToNews,
  addNewsIdsToBookmarkUser,
  addNewsIdsToNewsletter,
  addNewsIdsToVitalUser,
  addNewsletter,
  createEventNews,
  deleteMultipleNewsletter,
  deleteNewsIdInNewsletter,
  deleteNewsInBookmarkUser,
  deleteNewsInVitalUser,
  deleteNewsletter,
  getAllEventNews,
  getEventByIdNews,
  getNewsBookmarks,
  getNewsByNewsletter,
  getNewsDetail,
  getNewsList,
  getNewsSidebar,
  getNewsSummary,
  getNewsVitals,
  getNewsletterDetail,
  updateEventNews,
  updateNewsletter,
} from "@/services/news.service";
import { INewsSummaryDto, NewsletterDto, TNewsSummary } from "@/services/news.type";
import { message } from "antd";
import {
  UseMutationOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

export const CACHE_KEYS = {
  NewsSidebar: "NEWS_SIDEBAR",
  NewsList: "NEWS_LIST",
  CreateNewsletter: "CREATE_NEWSLETTER",
  NewsDetail: "NEWS_DETAIL",
  NewsletterDetail: "NEWSLETTER_DETAIL",
  Summary: "SUMMARY",
  NewsEvent: "NEWS_EVENT",
};

export const useNewsSidebar = (title?: string) => {
  return useQuery([CACHE_KEYS.NewsSidebar, title], () => getNewsSidebar(title));
};

export const useNewsList = (filter: any, options?: UseQueryOptions<any, unknown>) => {
  return useQuery<any>([CACHE_KEYS.NewsList, filter], () => getNewsList(filter), options);
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

export const useEventByIdNewsList = (newsId: string) => {
  return useQuery<any>([CACHE_KEYS.NewsEvent, newsId], () => getEventByIdNews(newsId));
};

export const useAllEventNewsList = (filter: any) => {
  return useQuery<any>([CACHE_KEYS.NewsEvent, filter], () => getAllEventNews(filter));
};

export const useMutationNewsSidebar = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, NewsletterDto>(
    ({ action, _id, newsletter_ids, ...data }: any) => {
      if (action === ETreeAction.DELETE) {
        return deleteMultipleNewsletter({ newsletter_ids });
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
      onSuccess: (_, variables) => {
        if (variables.action && variables.tag) {
          message.success(`${MTreeAction[variables.action]} ${MTreeTag[variables.tag]} thành công`);
        }
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
        queryClient.invalidateQueries(["ME"]);
        message.success("Xoá tin thành công");
      },
      onMutate: async (newTodo) => {
        await queryClient.cancelQueries([CACHE_KEYS.NewsList, newTodo.newsletterId]);
        const previousTask = await queryClient.getQueryData([
          CACHE_KEYS.NewsList,
          newTodo.newsletterId,
        ]);

        queryClient.setQueryData([CACHE_KEYS.NewsList, newTodo.newsletterId], (old: any) => {
          const a = old.pages.map((i: any) => {
            let data = i.result;
            newTodo.newsId.map((element) => {
              data = data.filter((o: any) => o._id !== element);
              return null;
            });
            return { result: data, total_record: i.total_record };
          });
          return { pages: a, pageParams: old.pageParams };
        });
        return { previousTask };
      },
      onError: (err, newTodo, context) => {},
      onSettled: (newTodo) => {},
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

export const useInfiniteNewsList = (filter: any) => {
  return useInfiniteQuery<any>([CACHE_KEYS.NewsList], (data) =>
    getNewsList({ ...data.pageParam, ...filter } ?? { skip: "1", limit: 30, ...filter }),
  );
};

export const useInfiniteNewsByNewsletter = (id: string, filter: any) => {
  return useInfiniteQuery([CACHE_KEYS.NewsList, id], (data) => {
    if (id === ETreeTag.QUAN_TRONG) {
      return getNewsVitals({ ...data.pageParam, ...filter } ?? { skip: "1", limit: 30, ...filter });
    }

    if (id === ETreeTag.DANH_DAU) {
      return getNewsBookmarks(
        { ...data.pageParam, ...filter } ?? { skip: "1", limit: 30, ...filter },
      );
    }

    return getNewsByNewsletter(
      id,
      { ...data.pageParam, ...filter } ?? { skip: "1", limit: 30, ...filter },
    );
  });
};

export const useMutationEventNews = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, _id, data }: any) => {
      if (action === "update") {
        return updateEventNews(_id, data);
      }

      if (action === "add") {
        return createEventNews(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsEvent]);
        message.success({
          content: (variables.action === "add" ? "Thêm" : "Sửa") + " sự kiện thành công",
          key: CACHE_KEYS.NewsEvent,
        });
      },
      onError: () => {
        message.error({
          content: "Tên sự kiện đã tồn tại. Hãy nhập lại!",
          key: CACHE_KEYS.NewsEvent,
        });
      },
    },
  );
};

export const useMutationAddManyEvent = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, id, data }: any) => {
      if (action === "add") {
        return AddManyEventToNews(data, id);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsEvent]);
        message.success({
          content: "Thêm các sự kiện thành công",
          key: CACHE_KEYS.NewsEvent,
        });
      },
      onError: () => {
        message.error({
          content: "Thêm các sự kiện lỗi. Hãy nhập lại!",
          key: CACHE_KEYS.NewsEvent,
        });
      },
    },
  );
};
