import { ETreeAction, ETreeTag } from "@/components/news/news-state";

export type TNews = {
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
  news_samples?: any[];
  parent_id?: string;
  keyword_vi?: any;
  keyword_en?: any;
  keyword_cn?: any;
  keyword_ru?: any;
  is_sample?: boolean;
  _id?: string;
  action?: ETreeAction | null;
  tag?: ETreeTag | null;
  newsletter_ids?: string[];
}
