import { getTTXVNNews, updateTTXVNNews } from "@/services/ttxvn.service";
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
        : { skip: 1, limit: 50, ...filter },
    ),
  );
};

export const useMutationTTXVN = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, _id, data }: any) => {
      if (action === "update") {
        return updateTTXVNNews(_id, data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([TTXVN_CACHE_KEYS.ListTTXVN]);
        message.success({
          content:
            (variables.action === "update"
              ? "Sửa"
              : variables.action === "add"
              ? "Thêm mới"
              : "Xoá") + " sự kiện thành công",
        });
      },
      onError: () => {
        message.error({
          content: "Tên sự kiện đã tồn tại. Hãy nhập lại!",
        });
      },
    },
  );
};
