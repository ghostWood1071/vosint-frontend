type TEvents = {
  data: TEvent[];
  total: number;
};

type TEvent = {
  event_name: string;
  event_content: string;
  date_created: string;
  new_list: any[];
  system_created: string;
  chu_the: string;
  khach_the: string;
};

// type TEventSummary = string;

interface IEventDTO {
  _id?: string;
  event_name?: string;
  event_content?: string;
  date_created?: string;
  new_list?: any[];
  system_created?: boolean;
  chu_the?: string;
  khach_the?: string;
}

// interface IEventSummaryDTO {
//   k: string;
//   title: string;
//   description: string;
//   paras: string;
// }

export type { TEvents, TEvent, IEventDTO };
