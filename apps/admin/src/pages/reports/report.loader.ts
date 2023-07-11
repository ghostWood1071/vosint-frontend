import {
  IEventDto,
  IQuickReportDto,
  IReportDto,
  TEvent,
  TEvents,
  TQuickReport,
  TReport,
  TReportEventsDto,
  TReports,
} from "@/services/report-type";
import {
  UpdateReportAndEvent,
  UpdateReportAndEventType,
  addEventIdsToReport,
  createQuickReport,
  createReport,
  createReportEvents,
  getQuickReports,
  getReport,
  getReportEvents,
  removeEventIdsToReport,
  removeReport,
  updateReport,
} from "@/services/report.service";
import {
  createEvent,
  getEvent,
  getEvents,
  getReports,
  removeNewsInEvent,
  updateEvent,
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

export const useCreateEvent = (options?: UseMutationOptions<string, unknown, IEventDto>) => {
  return useMutation((data: IEventDto) => createEvent(data), options);
};

export const useUpdateEvent = (
  id: string,
  options?: UseMutationOptions<
    string,
    unknown,
    IEventDto,
    { previousData?: IEventDto; newData?: IEventDto }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<string, unknown, IEventDto, { previousData?: IEventDto; newData?: IEventDto }>(
    (data: IEventDto) => updateEvent(id, data),
    {
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: [CACHE_KEYS.EVENT, id] });
        const previousData = queryClient.getQueryData<IEventDto>([CACHE_KEYS.EVENT, id]);

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
    { previousData?: IEventDto; newData?: IEventDto }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation((data) => removeNewsInEvent(id, data), {
    onMutate: async (removedNews) => {
      await queryClient.cancelQueries({ queryKey: [CACHE_KEYS.EVENT, id] });
      const previousData = queryClient.getQueryData<IEventDto>([CACHE_KEYS.EVENT, id]);
      queryClient.setQueriesData<IEventDto | undefined>([CACHE_KEYS.EVENT, id], (oldData) => {
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

export const useQuickReport = (id: string, options?: UseQueryOptions<TQuickReport, unknown>) => {
  return useQuery<TQuickReport>([CACHE_KEYS.QUICK_REPORT, id], () => getReport(id), options);
};

export const useCreateReport = (options?: UseMutationOptions<string, unknown, IReportDto>) => {
  return useMutation((data: IReportDto) => createReport(data), options);
};

export const useCreateQuickReport = (
  options?: UseMutationOptions<string, unknown, IQuickReportDto>,
) => {
  return useMutation((data: IQuickReportDto) => createQuickReport(data), options);
};

export const useUpdateReport = (
  id: string,
  options?: UseMutationOptions<
    string,
    unknown,
    IReportDto | IQuickReportDto,
    { previousData?: IReportDto; newData?: IReportDto }
  >,
) => {
  return useMutation((data: IReportDto) => updateReport(id, data), options);
};

export const useUpdateReportAndEvent = () => {
  return useMutation((data: UpdateReportAndEventType) => UpdateReportAndEvent(data));
};

export const useGetReportEvents = (
  id: string,
  options?: UseQueryOptions<TReportEventsDto, unknown>,
) => {
  return useQuery<TReportEventsDto>(
    [CACHE_KEYS.REPORT_EVENT, id],
    () => getReportEvents(id),
    options,
  );
};

export const useCreateReportEvents = (
  options?: UseMutationOptions<string, unknown, TReportEventsDto>,
) => {
  return useMutation((data: TReportEventsDto) => createReportEvents(data), options);
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
