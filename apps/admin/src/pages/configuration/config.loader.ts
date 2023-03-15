import {
  addNewObjectCateConfig,
  addNewProxyConfig,
  deleteAccountMonitor,
  deleteObjectCateConfig,
  deleteProxyConfig,
  deleteSocialConfig,
  getAccountMonitorSocialMedia,
  getAdminMonitor,
  getFacebookSetting,
  getObjectCateConfig,
  getProxyConfig,
  getSocialObjectList,
  getTiktokSetting,
  getTwitterSetting,
  postAccountMonitor,
  postSetting,
  updateAccountMonitor,
  updateObjectCateConfig,
  updateProxyConfig,
  updateSocialConfig,
} from "@/services/cate-config.service";
import { UseMutationOptions, useMutation, useQuery, useQueryClient } from "react-query";

export const CACHE_KEYS = {
  ObjectCate: "OBJECT_CATEGORY",
  ProxyConfig: "PROXY_CONFIG",
  SocialObjectList: "SOCIAL_OBJECT_LIST",
  InfoFBSetting: "INFO_FB_SETTING",
  InfoTWSetting: "INFO_TW_SETTING",
  InfoTTSetting: "INFO_TT_SETTING",
  SocialConfig: "SOCIAL_CONFIG",
  DeleteInfoConfig: "DELETE_SOCIAL_CONFIG",
  InfoAccountMonitorFB: "INFO_ACCOUNT_MONITOR_FB",
  InfoAccountMonitorTW: "INFO_ACCOUNT_MONITOR_TW",
  InfoAccountMonitorTT: "INFO_ACCOUNT_MONITOR_TT",
};

export const useObjectCate = (filter: any) => {
  return useQuery([CACHE_KEYS.ObjectCate, filter], () => getObjectCateConfig(filter));
};

export const useProxyConfig = (filter: any) => {
  return useQuery([CACHE_KEYS.ProxyConfig, filter], () => getProxyConfig(filter));
};

export const useSocialObjectList = (filter: any) => {
  return useQuery([CACHE_KEYS.SocialObjectList, filter], () => getSocialObjectList(filter));
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

//
export const useMutationUpdateSocial = (options?: UseMutationOptions<unknown, unknown, any>) => {
  return useMutation((data: any) => {
    return updateSocialConfig(data);
  }, options);
};

export const useMutationDeleteSocial = (options?: UseMutationOptions<unknown, unknown, any>) => {
  return useMutation((id: any) => {
    return deleteSocialConfig(id);
  }, options);
};

export const useMutationUpdateTWSocial = (options?: UseMutationOptions<unknown, unknown, any>) => {
  return useMutation((data: any) => {
    return updateSocialConfig(data);
  }, options);
};

export const useMutationDeleteTWSocial = (options?: UseMutationOptions<unknown, unknown, any>) => {
  return useMutation((id: any) => {
    return deleteSocialConfig(id);
  }, options);
};

export const useFBSetting = (filter: any) => {
  return useQuery([CACHE_KEYS.InfoFBSetting, filter], () => getFacebookSetting(filter));
};

export const useTWSetting = (filter: any) => {
  return useQuery([CACHE_KEYS.InfoTWSetting, filter], () => getTwitterSetting(filter));
};

export const useTTSetting = (filter: any) => {
  return useQuery([CACHE_KEYS.InfoTTSetting, filter], () => getTiktokSetting(filter));
};

export const usePostFBSetting = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => postSetting(data), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.InfoFBSetting]);
    },
    onError: () => {},
  });
};

export const usePostTWSetting = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => postSetting(data), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.InfoTWSetting]);
    },
    onError: () => {},
  });
};

export const usePostTTSetting = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => postSetting(data), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.InfoTTSetting]);
    },
    onError: () => {},
  });
};

//
export const useAdminMonitor = (filter: any) => {
  return useQuery([CACHE_KEYS.InfoAccountMonitorFB, filter], () => getAdminMonitor(filter));
};

export const usePostAccountMonitor = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => postAccountMonitor(data), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.InfoAccountMonitorFB]);
    },
    onError: () => {},
  });
};

export const useMutationDeleteAccountMonitor = (
  options?: UseMutationOptions<unknown, unknown, any>,
) => {
  return useMutation((id: any) => {
    return deleteAccountMonitor(id);
  }, options);
};

export const useMutationUpdateAccountMonitor = (
  options?: UseMutationOptions<unknown, unknown, any>,
) => {
  return useMutation((data: any) => {
    return updateAccountMonitor(data);
  }, options);
};

export const useAccountMonitor = (filter: any) => {
  return useQuery([CACHE_KEYS.InfoFBSetting, filter], () => getAccountMonitorSocialMedia(filter));
};
