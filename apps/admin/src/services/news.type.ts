export type TNews = {
  _id: string;
  "data:title": string;
  "data:author": string;
  "data:time": string;
  "data:content": string;
  "data:url": string;
  "data:class": any[];
  created_at: string;
  modified_at: string;
};

export interface INewsSummaryDto {
  k: string;
  title: string;
  description: string;
  paras: string;
}

export type TNewsSummary = string;

export interface NewsletterDto {
  title?: string;
  exclusion_keyword?: string;
  required_keyword?: string[];
  news_samples?: string[] | TNews[];
  parent_id?: string;
  _id?: string;
  action?: any;
  tag?: any;
  newsletter_ids?: string[];
}
