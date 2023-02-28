import {
  addNewCountryCateConfig,
  addNewObjectCateConfig,
  addNewOrganizationCateConfig,
  addNewProxyConfig,
  deleteCountryCateConfig,
  deleteObjectCateConfig,
  deleteOrganizationCateConfig,
  deleteProxyConfig,
  getCountryCateConfig,
  getObjectCateConfig,
  getOrganizationCateConfig,
  getProxyConfig,
  updateCountryCateConfig,
  updateObjectCateConfig,
  updateOrganizationCateConfig,
  updateProxyConfig,
} from "@/services/cate-config.service";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const CACHE_KEYS = {
  OrganizationCate: "ORGANIZATION_CATEGORY",
  CountryCate: "COUNTRY_CATEGORY",
  ObjectCate: "OBJECT_CATEGORY",
  ProxyConfig: "PROXY_CONFIG",
};

export const useOrganizationCate = () => {
  return useQuery([CACHE_KEYS.OrganizationCate], () => getOrganizationCateConfig());
};

export const useCountryCate = () => {
  return useQuery([CACHE_KEYS.CountryCate], () => getCountryCateConfig());
};

export const useObjectCate = () => {
  return useQuery([CACHE_KEYS.ObjectCate], () => getObjectCateConfig());
};

export const useProxyConfig = () => {
  return useQuery([CACHE_KEYS.ProxyConfig], () => getProxyConfig());
};

export const useMutationOrganizationCate = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, _id, ...data }: any) => {
      if (action === "delete") {
        return deleteOrganizationCateConfig(_id);
      }

      if (action === "update") {
        return updateOrganizationCateConfig(_id, data);
      }

      if (action === "add") {
        console.log("this is data", data);
        return addNewOrganizationCateConfig(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CACHE_KEYS.OrganizationCate);
      },
      onError: () => {},
    },
  );
};

export const useMutationCountryCate = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, _id, ...data }: any) => {
      if (action === "delete") {
        return deleteCountryCateConfig(_id);
      }

      if (action === "update") {
        return updateCountryCateConfig(_id, data);
      }

      if (action === "add") {
        return addNewCountryCateConfig(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CACHE_KEYS.CountryCate);
      },
      onError: () => {},
    },
  );
};

export const useMutationObjectCate = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, _id, ...data }: any) => {
      if (action === "delete") {
        return deleteObjectCateConfig(_id);
      }

      if (action === "update") {
        return updateObjectCateConfig(_id, data);
      }

      if (action === "add") {
        return addNewObjectCateConfig(data);
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
