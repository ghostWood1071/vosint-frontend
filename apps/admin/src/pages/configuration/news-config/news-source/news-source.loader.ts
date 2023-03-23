import {
  addNewsSource,
  deleteNewsSource,
  getSourceConfig,
  updateNewsSource,
} from "@/services/source-config.service";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const CACHE_KEYS = {
  SourceNewsConfig: "SOURCE_NEWS_CONFIG",
};

export const useSourceNewsConfigList = (filter: any) => {
  return useQuery([CACHE_KEYS.SourceNewsConfig, filter], () => getSourceConfig(filter));
};

export const useMutationNewsSource = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, _id, ...data }: any) => {
      if (action === "delete") {
        return deleteNewsSource(_id);
      }

      if (action === "update") {
        return updateNewsSource(_id, data);
      }

      if (action === "add") {
        return addNewsSource(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(CACHE_KEYS.SourceNewsConfig);
        message.success({
          content:
            (variables.action === "add" ? "Thêm" : variables.action === "update" ? "Sửa" : "Xoá") +
            " nguồn tin thành công",
          key: CACHE_KEYS.SourceNewsConfig,
        });
      },
      onError: () => {
        message.error({
          content: "Tên nguồn tin đã tồn tại. Hãy nhập lại!",
          key: CACHE_KEYS.SourceNewsConfig,
        });
      },
    },
  );
};
