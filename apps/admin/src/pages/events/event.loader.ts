import { ETreeTag } from "@/components/news/news-state";
import { ISummary, ISummaryDTO } from "@/models/summary.type";
import {
  SetNotSeenEvent,
  SetSeenEvent,
  cloneSystemEventToUserEvent,
  createEventFromUser,
  deleteEventCreatedByUser,
  exportEvents,
  getAllEventCreatedByUser,
  updateEventCreatedByUser,
} from "@/services/event.service";
import { getEventFormElt, getEventsByNewsletterWithApiJob } from "@/services/job.service";
import { getSummary } from "@/services/summary.service";
import { message } from "antd";
import { UseMutationOptions, useInfiniteQuery, useMutation, useQueryClient } from "react-query";

export const EVENT_CACHE_KEYS = {
  ListEvents: "LIST_EVENT",
  NewsListEvents: "NEW_LIST_EVENT",
  Summary: "SUMMARY",
};

export const useGetEventSummaryLazy = (
  options?: UseMutationOptions<ISummary, unknown, ISummaryDTO>,
) => {
  return useMutation([EVENT_CACHE_KEYS.Summary], (data: ISummaryDTO) => getSummary(data), options);
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

// export const useInfiniteEventsByTimeline = (filter: any) => {
//   return useInfiniteQuery<any>([EVENT_CACHE_KEYS.ListEvents], (data) =>
//     getEventByTimeline(
//       data.pageParam !== undefined
//         ? { ...data.pageParam, ...filter }
//         : { skip: 1, limit: 50, ...filter },
//     ),
//   );
// };

// export const useInfiniteEventFormElt = (id: string, filter: any, tag: string) => {
//   return useInfiniteQuery([EVENT_CACHE_KEYS.ListEvents, id], ({ pageParam }) => {
//     return getEventsByNewsletterWithApiJob({
//       page_number: pageParam?.page_number || 1,
//       page_size: pageParam?.page_size || 50,
//       start_date: filter?.start_date || "01/01/2021",
//       end_date: filter?.end_date || "24/08/2023",
//       news_letter_id:
//         tag === "chu_de" || tag === "linh_vuc" || tag === "gio_tin" || tag === "source_group"
//           ? id
//           : "",
//     });
//   });
// };

export const useInfiniteEventFormElt = (id: string, filter: any, tag: string) => {
  return useInfiniteQuery([EVENT_CACHE_KEYS.NewsListEvents, id], ({ pageParam }) => {
    return getEventFormElt({
      page_number: pageParam?.page_number || 1,
      page_size: pageParam?.page_size || 50,
      groupType: id === ETreeTag.QUAN_TRONG ? "vital" : id === ETreeTag.DANH_DAU ? "bookmarks" : "",
      search_Query: filter.text_search,
      startDate: filter.startDate,
      endDate: filter.endDate,
      langs: filter?.langs ? filter.langs.join(",") : "",
      sentiment: filter?.sentiment,
      id_nguon_nhom_nguon: tag === "source" || tag === "source_group" ? id : "",
      type: tag === "source" || tag === "source_group" ? tag : "",
      newsletter_id: tag === "chu_de" || tag === "linh_vuc" || tag === "gio_tin" ? id : "",
    });
    // event/id/tag
    // if /event/organization/ id == organization => ...
    // if /event/12312313/organization/
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
            variables.action == "export"
              ? "Xuất file thành công"
              : (variables.action === "update"
                  ? "Cập nhật"
                  : variables.action === "add"
                  ? "Thêm mới"
                  : "Xoá") + " sự kiện thành công",
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

export const useMutationChangeStatusSeenEvent = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ action, data }: any) => {
      if (action === "set-seen") {
        return SetSeenEvent(data);
      }

      if (action === "set-unseen") {
        return SetNotSeenEvent(data);
      }

      throw new Error("action invalid");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([EVENT_CACHE_KEYS.ListEvents]);
      },
      onError: () => {},
    },
  );
};