import { create } from "zustand";

type News = any;

interface NewsState {
  open: string | null;
  setOpen: (open: string | null) => void;
  newsList: News[];
  setNewsList: (newsList: News[]) => void;
}

export const useNews = create<NewsState>()((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  newsList: [],
  setNewsList: (newsList) => set({ newsList }),
}));
