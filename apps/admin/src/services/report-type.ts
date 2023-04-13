export type TEvent = {
  event_name: string;
  event_content: string;
  date: string;
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
  event_name?: string;
  event_content?: string;
  date?: string;
  new_list?: any[];
  system_created?: boolean;
  chu_the?: string;
  khach_the?: string;
}

export type TReport = {
  _id: string;
  title: string;
  content: string;
};

export type TReports = {
  data: TReport[];
  total: number;
};

export interface IReportDto {
  title?: string;
  content?: string;
}
