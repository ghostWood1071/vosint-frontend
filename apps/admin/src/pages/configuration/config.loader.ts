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
  getProxyPipelineOptions,
  getSettingFilter,
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
import { IProxyPipelineOptions } from "@/services/cate-config.type";
import { message } from "antd";
import { AxiosError } from "axios";
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

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
  ProxyPipelineOptions: "PROXY_PIPELINE_OPTIONS",
};

export const useObjectCate = (filter: any) => {
  return useQuery([CACHE_KEYS.ObjectCate, filter], () => getObjectCateConfig(filter));
};

export const useProxyConfig = (filter: any) => {
  return useQuery([CACHE_KEYS.ProxyConfig, filter], () => getProxyConfig(filter));
};

export const useProxyPipelineOptions = (
  options?: UseQueryOptions<IProxyPipelineOptions, AxiosError>,
) => {
  return useQuery<IProxyPipelineOptions, AxiosError>(
    CACHE_KEYS.ProxyPipelineOptions,
    () => getProxyPipelineOptions(),
    options,
  );
};

export const useSocialObjectList = (filter: any) => {
  return useQuery([CACHE_KEYS.SocialObjectList, filter], () => getSocialObjectList(filter));
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

      if (action === "change-status") {
        return updateObjectCateConfig(_id, data);
      }

      if (action === "add") {
        return addNewObjectCateConfig(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(CACHE_KEYS.ObjectCate);
      },
      onError: (data, variables) => {
        message.error({
          content:
            "Tên" +
            (variables.object_type !== undefined
              ? variables.object_type === "Đối tượng"
                ? " đối tượng"
                : variables.object_type === "Tổ chức"
                ? " tổ chức"
                : " quốc gia"
              : "") +
            " đã tồn tại. Nhập lại!",
          key: CACHE_KEYS.ObjectCate,
        });
      },
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
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries(CACHE_KEYS.ProxyConfig);
        message.success({
          content:
            (variables.action === "add" ? "Thêm" : variables.action === "update" ? "Sửa" : "Xoá") +
            " proxy thành công!",
          key: CACHE_KEYS.ProxyConfig,
        });
      },
      onError: (data: any) => {
        console.log(data);
        message.error({
          content: "Địa chỉ IP đã tồn tại. Hãy nhập lại!",
          key: CACHE_KEYS.ProxyConfig,
        });
      },
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

export const useSettingFilter = (filter: any) => {
  return useQuery([CACHE_KEYS.InfoFBSetting, filter], () => getSettingFilter(filter));
};

export const usePostFBSetting = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => postSetting(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.InfoFBSetting);
      message.success({
        content: "Thành công!",
        key: CACHE_KEYS.InfoFBSetting,
      });
    },
    onError: () => {
      message.error({
        content: "Tài khoản đã tồn tại!",
        key: CACHE_KEYS.InfoFBSetting,
      });
    },
  });
};

export const usePostTWSetting = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => postSetting(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.InfoTWSetting);
      message.success({
        content: "Thành công!",
        key: CACHE_KEYS.InfoTWSetting,
      });
    },
    onError: () => {
      message.error({
        content: "Tài khoản đã tồn tại!",
        key: CACHE_KEYS.InfoTWSetting,
      });
    },
  });
};

export const usePostTTSetting = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => postSetting(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.InfoTTSetting);
      message.success({
        content: "Thành công!",
        key: CACHE_KEYS.InfoTTSetting,
      });
    },
    onError: () => {
      message.error({
        content: "Tài khoản đã tồn tại!",
        key: CACHE_KEYS.InfoTTSetting,
      });
    },
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
