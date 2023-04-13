import { IEventDto, IReportDto, TEvent, TEvents, TReport, TReports } from "@/services/report-type";
import { createReport, getReport, updateReport } from "@/services/report.service";
import {
  createEvent,
  getEvent,
  getEvents,
  getReports,
  removeNewsInEvent,
  updateEvent,
} from "@/services/report.service";
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "react-query";

export const CACHE_KEYS = {
  EVENTS: "EVENTS",
  EVENT: "EVENT",
  REPORTS: "REPORTS",
  REPORT: "REPORT",
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
  return useMutation((data: IEventDto) => updateEvent(id, data), options);
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
  return useMutation((data) => removeNewsInEvent(id, data), options);
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

export const useCreateReport = (options?: UseMutationOptions<string, unknown, IReportDto>) => {
  return useMutation((data: IReportDto) => createReport(data), options);
};

export const useUpdateReport = (
  id: string,
  options?: UseMutationOptions<
    string,
    unknown,
    IReportDto,
    { previousData?: IReportDto; newData?: IReportDto }
  >,
) => {
  return useMutation((data: IReportDto) => updateReport(id, data), options);
};
