import create from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  pinned: boolean;
  setPinned: (pinned: boolean) => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      pinned: false,
      setPinned: (pinned) => set({ pinned }),
    }),
    {
      name: "explorer-sidebar",
    },
  ),
);
