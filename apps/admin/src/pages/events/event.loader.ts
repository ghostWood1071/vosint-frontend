import {
  cloneSystemEventToUserEvent,
  createEventFromUser,
  deleteEventCreatedByUser,
  getAllEventCreatedByUser,
  updateEventCreatedByUser,
} from "@/services/event.service";
import { message } from "antd";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";

export const EVENT_CACHE_KEYS = {
  ListEvents: "LIST_EVENT",
};

export const useInfiniteEventsList = (filter: any) => {
  return useInfiniteQuery<any>([EVENT_CACHE_KEYS.ListEvents], (data) =>
    getAllEventCreatedByUser(
      data.pageParam !== undefined
        ? { ...data.pageParam, ...filter }
        : { skip: 1, limit: 50, ...filter },
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

      if (action === "add") {
        return createEventFromUser(data);
      }

      if (action === "delete") {
        return deleteEventCreatedByUser(_id);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([EVENT_CACHE_KEYS.ListEvents]);
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

export const useMutationSystemEvents = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ event_id }: any) => {
      return cloneSystemEventToUserEvent(event_id);
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([EVENT_CACHE_KEYS.ListEvents]);
        message.success({
          content: "Thêm vào danh sách các sự kiện do người dùng tạo thành công",
        });
      },
      onError: () => {
        message.error({
          content: "Đã xảy ra lỗi!",
        });
      },
    },
  );
};
