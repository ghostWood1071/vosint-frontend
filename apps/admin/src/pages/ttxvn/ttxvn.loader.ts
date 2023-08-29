import {
  getAccountTTXVNConfig,
  updateAccountTTXVNConfig,
} from "@/services/account-ttxvn-config.service";
import { getTTXVNNews, handleCrawlNews } from "@/services/job.service";
import { message } from "antd";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";

export const TTXVN_CACHE_KEYS = {
  ListTTXVN: "LIST_TTXVN",
  AccountConfig: "ACCOUNT_CONFIG",
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

export const useAccountTTXVNConfig = () => {
  return useQuery([TTXVN_CACHE_KEYS.AccountConfig], () => {
    return getAccountTTXVNConfig();
  });
};

export const useMutationAccountTTXVNConfig = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: any) => {
      return updateAccountTTXVNConfig(id, data);
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([TTXVN_CACHE_KEYS.AccountConfig]);
        message.success({
          content: "Cập nhật tài khoản thành công!",
        });
      },
      onError: (data: any) => {
        message.error({
          content: "Đã xảy ra lỗi!",
        });
      },
    },
  );
};
