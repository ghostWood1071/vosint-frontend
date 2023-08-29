import { HeadingsData } from "@/pages/reports/components/headings";
import { IQuickHeading } from "@/pages/reports/components/quick-heading";

type TReport = {
  _id: string;
  title: string;
  headings: HeadingsData[];
};

type TQuickReport = {
  _id: string;
  title: string;
  headings: IQuickHeading[];
};

type TReports = {
  data: TReport[];
  total: number;
};


type TReportContent = {
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

type TReportEventsDTO = {
  event_ids?: string[];
};

interface IReportDTO {
  title?: string;
  headings?: HeadingsData[];
  event_list?: Array<string | undefined> | null;
}

interface IQuickReportDTO {
  title?: string;
  headings?: IQuickHeading[];
  event_list?: Array<string | undefined> | null;
}

interface UpdateReportAndEventType {
  id_report: string | undefined;
  id_heading: string | undefined;
}

export type {
  TReport,
  TQuickReport,
  TReports,
  IReportDTO,
  IQuickReportDTO,
  TReportContent,
  TReportEventsDTO,
  UpdateReportAndEventType
}