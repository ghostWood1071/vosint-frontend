import {
  cloneSystemEventToUserEvent,
  createEventFromUser,
  deleteEventCreatedByUser,
  exportEvents,
  getAllEventCreatedByUser,
  getEventSummary,
  updateEventCreatedByUser,
} from "@/services/event.service";
import { IEventSummaryDTO, TEventSummary } from "@/services/event.type";
import { getEventsByNewsletterWithApiJob } from "@/services/news.service";
import { message } from "antd";
import { UseMutationOptions, useInfiniteQuery, useMutation, useQueryClient } from "react-query";

export const EVENT_CACHE_KEYS = {
  ListEvents: "LIST_EVENT",
  Summary: "SUMMARY",
};

export const useGetEventSummaryLazy = (
  options?: UseMutationOptions<TEventSummary, unknown, IEventSummaryDTO>,
) => {
  return useMutation(
    [EVENT_CACHE_KEYS.Summary],
    (data: IEventSummaryDTO) => getEventSummary(data),
    options,
  );
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

export const useInfiniteEventFormElt = (id: string, filter: any, tag: string) => {
  return useInfiniteQuery([EVENT_CACHE_KEYS.ListEvents, id], ({ pageParam }) => {
    return getEventsByNewsletterWithApiJob({
      page_number: pageParam?.page_number || 1,
      page_size: pageParam?.page_size || 50,
      start_date: filter?.start_date || "01/01/2021",
      end_date: filter?.end_date || "24/08/2023",
      news_letter_id: tag === "chu_de" || tag === "linh_vuc" || tag === "gio_tin" || tag === "source_group" ? id : "",
    });
  });
};

export const useMutationExportEvents = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ data }: any) => {
        return exportEvents(data);
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([EVENT_CACHE_KEYS.ListEvents]);
        message.success({
          content: "Xuất file thành công",
        });
      },
      onError: () => {
        message.error({
          content: "lỗi!",
        });
      },
    },
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

      if (action === "export") {
        return exportEvents(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: (data: any, variables) => {
        queryClient.invalidateQueries([EVENT_CACHE_KEYS.ListEvents]);
        message.success({
          content:
          (variables.action == "export") ? "Xuất file thành công" : 
            ((variables.action === "update"
              ? "Sửa"
              : variables.action === "add"
              ? "Thêm mới"
              : "Xoá") + " sự kiện thành công"),
        });
      },
      onError: () => {
        message.error({
          // content: "Tên sự kiện đã tồn tại. Hãy nhập lại!",
          content: "Lỗi",
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

