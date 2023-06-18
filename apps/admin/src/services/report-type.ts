import { HeadingsData } from "@/pages/reports/components/headings";

export type TEvent = {
  event_name: string;
  event_content: string;
  date_created: string;
  new_list: any[];
  system_created: string;
  chu_the: string;
  khach_the: string;
};

export type TEvents = {
  data: TEvent[];
  total: number;
};

export interface IEventDto {
  _id?: string;
  event_name?: string;
  event_content?: string;
  date_created?: string;
  new_list?: any[];
  system_created?: boolean;
  chu_the?: string;
  khach_the?: string;
}

export type TReport = {
  _id: string;
  title: string;
  headings: HeadingsData[];
};

export type TReports = {
  data: TReport[];
  total: number;
};

export interface IReportDto {
  title?: string;
  headings?: HeadingsData[];
  event_list?: Array<string | undefined> | null;
}

export type TReportContent = {
  root: {
    children: {
      children?: {
        detail: number;
        format: number;
        mode: string;
        style: string;
        text: string;
        type: string;
        version: number;
      }[];
      direction?: string;
      format?: string;
      indent?: number;
      type: string;
      version: number;
      tag?: string;
      events_id?: string;
    }[];
    direction: string;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
};

export type TReportEventsDto = {
  event_ids?: string[];
};
