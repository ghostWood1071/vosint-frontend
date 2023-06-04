import { TNews } from "@/services/news.type";
import { compact } from "lodash";
import React, { Dispatch } from "react";
import { create } from "zustand";

interface NewsState {
  news: NewsType;
  setNews: Dispatch<NewsType>;
  reset: () => void;
  newsSelectId: React.Key | null;
  setNewsSelectId: Dispatch<React.Key | null>;
}
export const useNewsState = create<NewsState>((set) => ({
  news: {
    action: null,
    data: null,
    tag: null,
  },
  setNews: (news) => set({ news }),
  reset: () =>
    set({
      news: {
        action: null,
        data: null,
        tag: null,
      },
    }),
  newsSelectId: null,
  setNewsSelectId: (newsSelectId) => set({ newsSelectId }),
}));

interface NewsSamplesState {
  newsSamples: TNews[];
  setNewsSamples: Dispatch<TNews[]>;
}
export const useNewsSamplesState = create<NewsSamplesState>((set) => ({
  newsSamples: [],
  setNewsSamples: (newsSamples) => set({ newsSamples: newsSamples }),
}));

interface NewsSamplesTopicState {
  newsSamples: any[];
  setNewsSamples: Dispatch<any[]>;
}

export const useNewsSamplesTopicState = create<NewsSamplesTopicState>((set) => ({
  newsSamples: [],
  setNewsSamples: (newsSamples) => set({ newsSamples: newsSamples }),
}));

interface NewsSelectionState {
  open: boolean;
  setOpen: Dispatch<boolean>;
  newsSelection: TNews[];
  setNewsSelection: Dispatch<TNews[]>;
}
export const useNewsSelection = create<NewsSelectionState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),

  newsSelection: [],
  setNewsSelection: (newsSelection) => set({ newsSelection: compact(newsSelection) }),
}));

export type NewsType = {
  tag: null | ETreeTag;
  action: null | ETreeAction;
  data: {
    title?: string;
    exclusion_keyword?: string;
    required_keyword?: string[];
    keyword_vi?: any;
    keyword_en?: any;
    keyword_cn?: any;
    keyword_ru?: any;
    is_sample?: boolean;
    news_samples?: any[];
    parent_id?: string;
    _id?: string;
  } | null;
};

export enum ETreeTag {
  CHU_DE = "chu_de",
  LINH_VUC = "linh_vuc",
  GIO_TIN = "gio_tin",
  QUAN_TRONG = "quan_trong",
  DANH_DAU = "danh_dau",
  NGUON_TIN = "source",
  NHOM_NGUON_TIN = "source_group",
}

export enum ETreeAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  SELECT = "select",
}

export const MTreeAction: Record<ETreeAction, string> = {
  [ETreeAction.CREATE]: "Thêm",
  [ETreeAction.UPDATE]: "Sửa",
  [ETreeAction.DELETE]: "Xóa",
  [ETreeAction.SELECT]: "Chọn",
};

export const MTreeTag: Record<ETreeTag, string> = {
  [ETreeTag.CHU_DE]: "chủ đề",
  [ETreeTag.LINH_VUC]: "lĩnh vực",
  [ETreeTag.GIO_TIN]: "giỏ tin",
  [ETreeTag.QUAN_TRONG]: "quan trọng",
  [ETreeTag.DANH_DAU]: "đánh dấu",
  [ETreeTag.NGUON_TIN]: "nguồn tin",
  [ETreeTag.NHOM_NGUON_TIN]: "nhóm nguồn tin",
};
