import {
  addGroupSource,
  deleteGroupSource,
  getGroupSource,
  updateGroupSource,
} from "@/services/group-source.service";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const GROUP_SOURCE = "@GROUP_SOURCE";

export const useGroupSourceList = (filter: any) => {
  return useQuery([GROUP_SOURCE, filter], () => getGroupSource(filter));
};

export const useMutationGroupSource = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, ...data }: any) => {
      if (action === "delete") {
        return deleteGroupSource(data._id);
      }

      if (action === "update") {
        return updateGroupSource(data._id, data);
      }

      if (action === "add") {
        return addGroupSource(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GROUP_SOURCE);
        message.success({
          content: "Thành công!",
          key: GROUP_SOURCE,
        });
      },
      onError: () => {
        message.error({
          content: "Nhóm nguồn tin đã tồn tại!",
          key: GROUP_SOURCE,
        });
      },
    },
  );
};
