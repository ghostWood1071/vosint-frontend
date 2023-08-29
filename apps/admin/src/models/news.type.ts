type TNews = {
  _id: string;
  "data:title": string;
  "data:author": string;
  "data:time": string;
  "data:content": string;
  "data:url": string;
  "data:class": any[];
  "data:html": string;
  pub_date: string;
  created_at: string;
  modified_at: string;
};

type TNewsSummary = string;

interface INewsSummaryDTO {
  k: string;
  title: string;
  description: string;
  paras: string;
}

export type { TNews, TNewsSummary, INewsSummaryDTO }
