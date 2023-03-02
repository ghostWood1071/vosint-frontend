import {
  addNewsSource,
  deleteNewsSource,
  getSourceConfig,
  updateNewsSource,
} from "@/services/source-config.service";
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
      onSuccess: () => {
        queryClient.invalidateQueries(CACHE_KEYS.SourceNewsConfig);
      },
      onError: () => {},
    },
  );
};
