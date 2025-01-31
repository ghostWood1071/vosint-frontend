import { ETreeAction, ETreeTag, MTreeAction, MTreeTag } from "@/components/news/news-state";
import { INewsSummaryDTO, TNewsSummary } from "@/models/news.type";
import { NewsletterDTO } from "@/models/newsletter.type";
import { ISummary, ISummaryDTO } from "@/models/summary.type";
import {
  AddManyEventToNews,
  createEventNews,
  deleteEventNews,
  generateSystemEventNews,
  getAllEventNews,
  getEventByIdNews,
  updateEventNews,
} from "@/services/event.service";
import {
  getEventsByNewsletterWithApiJob,
  getNewsBookmarksWithApiJob,
  getNewsByNewsletterWithApiJob,
  getNewsFormElt,
  getNewsFromTTXVN,
  getNewsListWithApiJob,
  getNewsViaSourceAndApiJob,
  getNewsVitalsWithApiJob,
} from "@/services/job.service";
import {
  SetNotSeenPost,
  SetSeenPost,
  checkMatchKeyword,
  createNewsObject,
  deleteNewsFromCategory,
  deleteNewsObject,
  exportNews,
  getEventFormObj,
  getNewsDetail,
} from "@/services/news.service";
import {
  addNewsIdsToNewsletter,
  addNewsletter,
  deleteMultipleNewsletter,
  deleteNewsIdInNewsletter,
  deleteNewsletter,
  getNewsSidebar,
  getNewsletterDetail,
  updateNewsletter,
} from "@/services/newsletter.service";
import { getSummary } from "@/services/summary.service";
import {
  addNewsIdsToBookmarkUser,
  addNewsIdsToVitalUser,
  deleteNewsInBookmarkUser,
  deleteNewsInVitalUser,
} from "@/services/user.service";
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
  NewsListSearch: "NEWS_LIST_SEARCH",
  CreateNewsletter: "CREATE_NEWSLETTER",
  NewsDetail: "NEWS_DETAIL",
  NewsletterDetail: "NEWSLETTER_DETAIL",
  Summary: "SUMMARY",
  NewsEvent: "NEWS_EVENT",
  ListEvents: "LIST_EVENT",
  NewsTTXVN: "NEWS_TTXVN",
  SWITCH: "SWITCH",
};


export const useInfiniteEventFormObj = (id: string, filter: any, tag: string) => {
  return useInfiniteQuery([CACHE_KEYS.ListEvents, id], ({ pageParam }) => {
    return getEventFormObj({
      page_number: pageParam?.page_number || 1,
      page_size: pageParam?.page_size || 50,
      text_search: filter.text_search || filter.event_name,
      start_date: filter.startDate || filter.start_date,
      end_date: filter.endDate || filter.end_date,
      sac_thai: "",
      language_source: filter?.langs ? filter.langs.join(",") : "",
      type: tag === "source" || tag === "source_group" ? tag : "",
      object_id: (id === "organization") ? "" : id,
    });
  });
};

export const useNewsSidebar = (title?: string) => {
  return useQuery([CACHE_KEYS.NewsSidebar, title], () => getNewsSidebar(title));
};

export const useNewsList = (filter: any, options?: UseQueryOptions<any, unknown>) => {
  return useQuery<any>([CACHE_KEYS.NewsList, filter], () => getNewsListWithApiJob(filter), options);
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

export const useEventsByIdNewsList = (filter: any) => {
  return useQuery<any>([CACHE_KEYS.NewsEvent, filter], () =>
    getEventsByNewsletterWithApiJob(filter),
  );
};

export const useMutationSwitch = () => {
  const queryClient = useQueryClient();

  return useMutation((newsLetterId?: any) => switchNewsAndEvents(newsLetterId), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.SWITCH);

      message.success({
        content: "Chuyển đổi thành công!",
        key: CACHE_KEYS.SWITCH,
      });
    },
    onError: (err) => {
      message.error({
        content: err || "Lỗi",
        key: CACHE_KEYS.SWITCH,
      });
    },
  });
};

export const useMutationCreateNewsObject = () => {
  const queryClient = useQueryClient();

  return useMutation((data: any) => createNewsObject(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.SWITCH);

      message.success({
        content: "Thêm thành công!",
        key: CACHE_KEYS.SWITCH,
      });
    },
    onError: (err) => {
      message.error({
        content: err || "Lỗi",
        key: CACHE_KEYS.SWITCH,
      });
    },
  });
};


export const useMutationDeleteNewsObject = () => {
  const queryClient = useQueryClient();

  return useMutation((data: any) => deleteNewsObject(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.SWITCH);

      message.success({
        content: "Xoá thành công!",
        key: CACHE_KEYS.SWITCH,
      });
    },
    onError: (err) => {
      message.error({
        content: err || "Lỗi",
        key: CACHE_KEYS.SWITCH,
      });
    },
  });
};

export const useMutationNewsSidebar = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, NewsletterDTO>(
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
      onError: (err) => {
        // message.error(`${err.response.data}`);
        message.error(`Đã tồn tại!`);

      },
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
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["ME"]);
        message.success(
          `Thêm vào ${
            variables.newsletterId === "quan_trong"
              ? "tin " + MTreeTag["quan_trong"]
              : variables.newsletterId === "danh_dau"
              ? "tin được " + MTreeTag["danh_dau"]
              : "giỏ tin"
          } thành công`,
        );
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
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["ME"]);
        queryClient.invalidateQueries(CACHE_KEYS.NewsList);
        message.success(
          `Xoá khỏi ${
            variables.newsletterId === "quan_trong"
              ? "tin " + MTreeTag["quan_trong"]
              : variables.newsletterId === "danh_dau"
              ? "tin được " + MTreeTag["danh_dau"]
              : "giỏ tin"
          } thành công`,
        );
      },
      onError: (err, newTodo, context) => {},
      onSettled: (newTodo) => {},
    },
  );
};

export const useGetNewsSummaryLazy = (
  options?: UseMutationOptions<ISummary, unknown, ISummaryDTO>,
) => {
  return useMutation([CACHE_KEYS.Summary], (data: ISummaryDTO) => getSummary(data), options);
};

export const useInfiniteNewsList = (filter: any) => {
  return useInfiniteQuery<any>([CACHE_KEYS.NewsList], (data) =>
    getNewsListWithApiJob(
      data.pageParam !== undefined
        ? { ...data.pageParam, ...filter }
        : { page_number: 1, page_size: 50, ...filter },
    ),
  );
};

export const useMutationExportNews = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ data }: any) => {
      return exportNews(data);
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsList]);
        message.success({
          content: "Xuất file thành công",
        });
      },
      onError: () => {
        message.error({
          content: "lỗi!",
        });
      },
    },
  );
};

export const useInfiniteNewsFormElt = (id: string, filter: any, tag: string) => {
  return useInfiniteQuery([CACHE_KEYS.NewsList, id], ({ pageParam }) => {
    return getNewsFormElt({
      page_number: pageParam?.page_number || 1,
      page_size: pageParam?.page_size || 50,
      groupType: id === ETreeTag.QUAN_TRONG ? "vital" : id === ETreeTag.DANH_DAU ? "bookmarks" : "",
      search_Query: filter.text_search,
      startDate: filter.startDate,
      endDate: filter.endDate,
      langs: filter?.langs ? filter.langs.join(",") : "",
      sentiment: filter?.sentiment,
      id_nguon_nhom_nguon: tag === "source" || tag === "source_group" ? id : "",
      type: tag === "source" || tag === "source_group" ? tag : "",
      newsletter_id: tag === "chu_de" || tag === "linh_vuc" || tag === "gio_tin" ? id : "",
    });
  });
};

export const useGetNewsFromTTXVNInfinite = (filter: Record<string, any>) => {
  return useInfiniteQuery([CACHE_KEYS.NewsTTXVN, filter], ({ pageParam }) => {
    return getNewsFromTTXVN({
      page_number: pageParam?.page_number || 1,
      page_size: pageParam?.page_size || 50,
      text_search: filter.text_search,
      startDate: filter.startDate,
      endDate: filter.endDate,
    });
  });
};

export const useInfiniteNewsByNewsletter = (id: string, filter: any, tag: string) => {
  return useInfiniteQuery([CACHE_KEYS.NewsList, id], (data) => {
    if (tag === "source" || tag === "source_group") {
      return getNewsViaSourceAndApiJob(
        data.pageParam !== undefined
          ? { ...data.pageParam, ...filter, type: tag, id: id }
          : { page_number: 1, page_size: 50, ...filter, type: tag, id: id },
      );
    }

    if (id === ETreeTag.QUAN_TRONG) {
      return getNewsVitalsWithApiJob(
        data.pageParam !== undefined
          ? { ...data.pageParam, ...filter }
          : { page_number: 1, page_size: 50, ...filter },
      );
    }

    if (id === ETreeTag.DANH_DAU) {
      return getNewsBookmarksWithApiJob(
        data.pageParam !== undefined
          ? { ...data.pageParam, ...filter }
          : { page_number: 1, page_size: 50, ...filter },
      );
    }

    return getNewsByNewsletterWithApiJob(
      id,
      data.pageParam !== undefined
        ? { ...data.pageParam, ...filter }
        : { page_number: 1, page_size: 50, ...filter },
    );
  });
};

export const useCheckMatchKeyword = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: any) => {
      return checkMatchKeyword(data);
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsList]);
      },
      onError: (data: any, variables) => {},
    },
  );
};

export const useMutationDeleteNewsFromCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: any) => {
      return deleteNewsFromCategory(data);
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsList]);
        message.success({
          content: "Xoá thành công",
          key: CACHE_KEYS.NewsList,
        });
      },
      onError: (err: any, variables) => {
        message.success({
          content: "Xoá không thành công",
          key: CACHE_KEYS.NewsList,
        });
      },
    },
  );
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

      if (action === "delete") {
        return deleteEventNews(_id, data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsEvent]);
        message.success({
          content:
            (variables.action === "add" ? "Thêm" : variables.action === "update" ? "Cập nhật" : "Xoá") +
            " sự kiện thành công",
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
export const useMutationChangeStatusSeenPost = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, data }: any) => {
      if (action === "set-seen") {
        return SetSeenPost(data);
      }

      if (action === "set-unseen") {
        return SetNotSeenPost(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsList]);
      },
      onError: () => {},
    },
  );
};

export const useNewsListForSearchingInEvent = (filter: any) => {
  return useQuery<any>([CACHE_KEYS.NewsListSearch, filter], () =>
    getNewsListWithApiJob({ page_number: 1, page_size: 50, ...filter }),
  );
};

export const useMutationGenerateSystemEvent = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ _id }: any) => {
      return generateSystemEventNews(_id);
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([CACHE_KEYS.NewsEvent]);
        message.success({
          content: "Sinh sự kiện thành công",
          key: CACHE_KEYS.NewsEvent,
        });
      },
      onError: () => {
        message.error({
          content: "Không thể thực hiện. Hãy nhập lại!",
          key: CACHE_KEYS.NewsEvent,
        });
      },
    },
  );
};

export const useGetNewsFromTTXVN = (filter: Record<string, any>) => {
  return useQuery([CACHE_KEYS.NewsTTXVN, filter], () => {
    return getNewsFromTTXVN({
      text_search: filter.text_search,
      start_date: filter.start_date,
      end_date: filter.end_date,
    });
  });
};
function switchNewsAndEvents(newsLetterId: any): Promise<unknown> {
  throw new Error("Function not implemented.");
}
