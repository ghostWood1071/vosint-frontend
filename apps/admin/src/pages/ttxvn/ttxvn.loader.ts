import { getTTXVNNews, handleCrawlNews } from "@/services/ttxvn.service";
import { message } from "antd";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";

export const TTXVN_CACHE_KEYS = {
  ListTTXVN: "LIST_TTXVN",
};

export const useInfiniteTTXVNList = (filter: any) => {
  return useInfiniteQuery<any>([TTXVN_CACHE_KEYS.ListTTXVN], (data) =>
    getTTXVNNews(
      data.pageParam !== undefined
        ? { ...data.pageParam, ...filter }
        : { page_number: 1, page_size: 50, ...filter },
    ),
  );
};

export const useMutationTTXVN = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id }: any) => {
      return handleCrawlNews(id);
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([TTXVN_CACHE_KEYS.ListTTXVN]);
        message.success({
          content: "Đã lấy tin thành công",
        });
      },
      onError: () => {
        message.error({
          content: "Đã xảy ra lỗi!",
        });
      },
    },
  );
};
