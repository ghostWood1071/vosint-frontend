import {
  addNewObjectCateConfig,
  addNewProxyConfig,
  deleteObjectCateConfig,
  deleteProxyConfig,
  getObjectCateConfig,
  getProxyConfig,
  updateObjectCateConfig,
  updateProxyConfig,
} from "@/services/cate-config.service";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const CACHE_KEYS = {
  ObjectCate: "OBJECT_CATEGORY",
  ProxyConfig: "PROXY_CONFIG",
};

export const useObjectCate = (filter: any) => {
  return useQuery([CACHE_KEYS.ObjectCate, filter], () => getObjectCateConfig(filter));
};

export const useProxyConfig = (filter: any) => {
  return useQuery([CACHE_KEYS.ProxyConfig, filter], () => getProxyConfig(filter));
};

export const useMutationObjectCate = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, _id, typeObject, ...data }: any) => {
      if (action === "delete") {
        return deleteObjectCateConfig(_id);
      }

      if (action === "update") {
        return updateObjectCateConfig(_id, data);
      }

      if (action === "add") {
        return addNewObjectCateConfig(data, typeObject, data.status);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CACHE_KEYS.ObjectCate);
      },
      onError: () => {},
    },
  );
};

export const useMutationProxy = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, _id, ...data }: any) => {
      if (action === "delete") {
        return deleteProxyConfig(_id);
      }

      if (action === "update") {
        return updateProxyConfig(_id, data);
      }

      if (action === "add") {
        return addNewProxyConfig(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CACHE_KEYS.ProxyConfig);
      },
      onError: () => {},
    },
  );
};
