import { create } from "zustand";

interface NewsState {
  selected: string[];
  setSelected: (selected: string[]) => void;
  show: boolean;
  setShow: (show: boolean) => void;
}

export const useOrganizationsStore = create<NewsState>((set) => ({
  selected: [],
  setSelected: (selected) => set(() => ({ selected })),
  show: false,
  setShow: (show) => set(() => ({ show })),
}));
