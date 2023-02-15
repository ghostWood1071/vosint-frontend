import {
  addNewsIdsToNewsletter,
  addNewsletter,
  deleteNewsletter,
  getNewsList,
  getNewsSidebar,
  updateNewsletter,
} from "@/services/news.service";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";

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

export const useMutationNewsSidebar = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ mode, _id, topic, ...data }: any) => {
      if (mode === "delete") {
        return deleteNewsletter(_id);
      }

      if (mode === "update") {
        return updateNewsletter(_id, { ...data, tags: topic });
      }

      return addNewsletter({ ...data, tags: topic });
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
