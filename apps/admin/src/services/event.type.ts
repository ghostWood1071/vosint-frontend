
export type TEvents = {
  data: TEvent[];
  total: number;
};

export type TEvent = {
  event_name: string;
  event_content: string;
  date_created: string;
  new_list: any[];
  system_created: string;
  chu_the: string;
  khach_the: string;
};

export interface IEventDTO {
  _id?: string;
  event_name?: string;
  event_content?: string;
  date_created?: string;
  new_list?: any[];
  system_created?: boolean;
  chu_the?: string;
  khach_the?: string;
}

export type TEventSummary = string;

export interface IEventSummaryDTO {
  // k: string;
  // event_name: string;
  // // description: string;
  // event_content: string;
  k: string;
  title: string;
  description: string;
  paras: string;
}