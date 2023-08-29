import { ETreeAction, ETreeTag } from "@/components/news/news-state";

interface NewsletterDTO {
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
export type { NewsletterDTO }
