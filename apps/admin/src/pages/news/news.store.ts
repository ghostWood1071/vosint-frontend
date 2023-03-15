import { create } from "zustand";

interface NewsState {
  news: any[];
  setNews: (selected: any[]) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  newsletterId: string;
  setNewsletterId: (newsletter: string) => void;
}

// Handle modal app filter
export const useNewsStore = create<NewsState>((set) => ({
  news: [],
  setNews: (selected) => set(() => ({ news: selected })),
  show: false,
  setShow: (show) => set(() => ({ show })),
  newsletterId: "",
  setNewsletterId: (newsletterId) => set(() => ({ newsletterId })),
}));

interface NewsLetter {
  tag: "newsletter" | "field" | "topic";
  setTag: (tag: "newsletter" | "field" | "topic") => void;
  newsletter: any;
  setNewsletter: (data: any) => void;
  open: null | "create" | "update" | "delete";
  setOpen: (open: null | "create" | "update" | "delete") => void;
}

// Handle modal sidebar
export const useNewsletterStore = create<NewsLetter>((set) => ({
  open: null,
  setOpen: (open) => set(() => ({ open })),
  newsletter: null,
  setNewsletter: (newsletter) => set(() => ({ newsletter })),
  tag: "newsletter",
  setTag: (tag) => set(() => ({ tag })),
}));
