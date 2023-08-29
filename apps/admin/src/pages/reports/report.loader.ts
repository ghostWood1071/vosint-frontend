import { IEventDTO, TEvent, TEvents } from "@/models/event.type";
import {
  IQuickReportDTO,
  IReportDTO,
  TQuickReport,
  TReport,
  TReportEventsDTO,
  TReports,
  UpdateReportAndEventType,
} from "@/models/report.type";
import {
  createEvent,
  getEvent,
  getEvents,
  removeNewsInEvent,
  updateEvent,
} from "@/services/event.service";
import {
  UpdateReportAndEvent,
  addEventIdsToReport,
  createQuickReport,
  createReport,
  createReportEvents,
  getQuickReports,
  getReport,
  getReportEvents,
  getReports,
  removeEventIdsToReport,
  removeReport,
  updateReport,
} from "@/services/report.service";
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

export const CACHE_KEYS = {
  EVENTS: "EVENTS",
  EVENT: "EVENT",
  REPORTS: "REPORTS",
  REPORT: "REPORT",
  REPORT_EVENT: "REPORT_EVENT",
  QUICK_REPORT: "QUICK_REPORT",
};

export const useEvent = (id: string, options?: UseQueryOptions<TEvent, unknown>) => {
  return useQuery<TEvent>([CACHE_KEYS.EVENT, id], () => getEvent(id), options);
};

export const useEvents = (filter: Record<string, any>, options?: UseQueryOptions<any, unknown>) => {
  return useQuery<TEvents>([CACHE_KEYS.EVENTS, filter], () => getEvents(filter), options);
};

export const useCreateEvent = (options?: UseMutationOptions<string, unknown, IEventDTO>) => {
  return useMutation((data: IEventDTO) => createEvent(data), options);
};

export const useUpdateEvent = (
  id: string,
  options?: UseMutationOptions<
    string,
    unknown,
    IEventDTO,
    { previousData?: IEventDTO; newData?: IEventDTO }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<string, unknown, IEventDTO, { previousData?: IEventDTO; newData?: IEventDTO }>(
    (data: IEventDTO) => updateEvent(id, data),
    {
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: [CACHE_KEYS.EVENT, id] });
        const previousData = queryClient.getQueryData<IEventDTO>([CACHE_KEYS.EVENT, id]);

        queryClient.setQueryData([CACHE_KEYS.EVENT, id], newData);
        return { previousData, newData };
      },
      onError: (_, __, context) => {
        if (!context) return;
        queryClient.setQueryData([CACHE_KEYS.EVENT, id], context.previousData);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.EVENT, id] });
      },

      ...options,
    },
  );
};

export const useRemoveNewsInEvent = (
  id: string,
  options?: UseMutationOptions<
    string[],
    unknown,
    string[],
    { previousData?: IEventDTO; newData?: IEventDTO }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation((data) => removeNewsInEvent(id, data), {
    onMutate: async (removedNews) => {
      await queryClient.cancelQueries({ queryKey: [CACHE_KEYS.EVENT, id] });
      const previousData = queryClient.getQueryData<IEventDTO>([CACHE_KEYS.EVENT, id]);
      queryClient.setQueriesData<IEventDTO | undefined>([CACHE_KEYS.EVENT, id], (oldData) => {
        if (!oldData) return oldData;
        if (oldData.new_list) {
          oldData.new_list = oldData.new_list.filter((item) => !removedNews.includes(item._id));
        }

        return oldData;
      });
      return { previousData, removedNews };
    },
    onError: (_, __, context) => {
      if (!context) return;
      queryClient.setQueryData([CACHE_KEYS.EVENT, id], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.EVENT, id] });
    },
    ...options,
  });
};

export const useReports = (
  filter: Record<string, any>,
  options?: UseQueryOptions<any, unknown>,
) => {
  return useQuery<TReports>([CACHE_KEYS.REPORTS, filter], () => getReports(filter), options);
};

export const useReport = (id: string, options?: UseQueryOptions<TReport, unknown>) => {
  return useQuery<TReport>([CACHE_KEYS.REPORT, id], () => getReport(id), options);
};

export const useQuickReport = (
  id: string,
  options?: UseQueryOptions<TQuickReport & { is_not_remove: boolean }, unknown>,
) => {
  return useQuery<TQuickReport & { is_not_remove: boolean }>(
    [CACHE_KEYS.QUICK_REPORT, id],
    () => getReport(id),
    options,
  );
};

export const useCreateReport = (options?: UseMutationOptions<string, unknown, IReportDTO>) => {
  return useMutation((data: IReportDTO) => createReport(data), options);
};

export const useCreateQuickReport = (
  options?: UseMutationOptions<string, unknown, IQuickReportDTO>,
) => {
  return useMutation((data: IQuickReportDTO) => createQuickReport(data), options);
};

export const useUpdateReport = (
  id: string,
  options?: UseMutationOptions<
    string,
    unknown,
    IReportDTO | IQuickReportDTO,
    { previousData?: IReportDTO; newData?: IReportDTO }
  >,
) => {
  return useMutation((data: IReportDTO) => updateReport(id, data), options);
};

export const useUpdateReportAndEvent = () => {
  return useMutation((data: UpdateReportAndEventType) => UpdateReportAndEvent(data));
};

export const useGetReportEvents = (
  id: string,
  options?: UseQueryOptions<TReportEventsDTO, unknown>,
) => {
  return useQuery<TReportEventsDTO>(
    [CACHE_KEYS.REPORT_EVENT, id],
    () => getReportEvents(id),
    options,
  );
};

export const useCreateReportEvents = (
  options?: UseMutationOptions<string, unknown, TReportEventsDTO>,
) => {
  return useMutation((data: TReportEventsDTO) => createReportEvents(data), options);
};

export const useAddEventIdsToReport = (
  options?: UseMutationOptions<string, unknown, { id: string; data: Array<string> }>,
) => {
  return useMutation(({ id, data }) => addEventIdsToReport(id, data), options);
};

export const useRemoveEventIdsToReport = (
  options?: UseMutationOptions<string, unknown, { id: string; data: string[] }>,
) => {
  return useMutation(({ id, data }) => removeEventIdsToReport(id, data), options);
};

export const useDeleteReport = (
  options?: UseMutationOptions<string, unknown, string, { previousData?: any; newData?: any }>,
) => {
  return useMutation((id) => removeReport(id), options);
};

// export const useReports = (
//   filter: Record<string, any>,
//   options?: UseQueryOptions<any, unknown>,
// ) => {
//   return useQuery<TReports>([CACHE_KEYS.REPORTS, filter], () => getReports(filter), options);
// };
export const useQuickReports = (
  filter: Record<string, any>,
  options?: UseQueryOptions<any, unknown>,
) => {
  return useQuery<TReports>(
    [CACHE_KEYS.QUICK_REPORT, filter],
    () => getQuickReports(filter),
    options,
  );
};
