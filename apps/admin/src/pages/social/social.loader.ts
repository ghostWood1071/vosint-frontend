import { getSocialPage } from "@/services/job.service";
import {
  addPriorityObject,
  deletePriorityObject,
  gePriorityObject, //   updatePriorityObject,
} from "@/services/user.service";
import { message } from "antd";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";

export const CACHE_KEYS_SOCIAL = {
  PrioritySocial: "@PRIORITY_OBJECT",
  SocialPage: "@SOCIAL_PAGE",
};

export const usePriorityObjectList = (filter: any) => {
  return useQuery([CACHE_KEYS_SOCIAL.PrioritySocial, filter], () => gePriorityObject(filter));
};

export const useMutationPriorityObject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, ...data }: any) => {
      if (action === "delete") {
        return deletePriorityObject(data.id);
      }

      //   if (action === "update") {
      //     return updatePriorityObject(data._id, data);
      //   }

      if (action === "add") {
        return addPriorityObject(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(CACHE_KEYS_SOCIAL.PrioritySocial);
        message.success({
          content:
            (variables.action === "add" ? "Thêm" : variables.action === "update" ? "Sửa" : "Xoá") +
            " đối tượng ưu tiên hành công!",
        });
      },
      onError: () => {
        message.error({
          content: "Tài khoản đã tồn tại. Hãy nhập lại!",
        });
      },
    },
  );
};

export interface DataFilterSocialPage {
  name: string;
}

export const useInfiniteSocialPageList = (filter: DataFilterSocialPage) => {
  return useInfiniteQuery<any>([CACHE_KEYS_SOCIAL.SocialPage], (data) =>
    getSocialPage(
      data.pageParam !== undefined
        ? { ...data.pageParam, ...filter }
        : { page_number: 1, page_size: 50, ...filter },
    ),
  );
};
