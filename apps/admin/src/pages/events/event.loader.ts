import {
  deleteEventCreatedByUser,
  getAllEventCreatedByUser,
  updateEventCreatedByUser,
} from "@/services/event.service";
import { message } from "antd";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";

export const CACHE_KEYS = {
  ListEvents: "LIST_EVENT",
};

export const useInfiniteEventsList = (filter: any) => {
  return useInfiniteQuery<any>([CACHE_KEYS.ListEvents], (data) =>
    getAllEventCreatedByUser(
      data.pageParam !== undefined
        ? { ...data.pageParam, ...filter }
        : { skip: 1, limit: 30, ...filter },
    ),
  );
};

export const useMutationEvents = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, _id, data }: any) => {
      if (action === "update") {
        return updateEventCreatedByUser(_id, data);
      }

      if (action === "delete") {
        return deleteEventCreatedByUser(_id);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([CACHE_KEYS.ListEvents]);
        message.success({
          content: (variables.action === "update" ? "Sửa" : "Xoá") + " sự kiện thành công",
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
