import { IEventDTO } from "@/models/event.type";
import { create } from "zustand";

interface QuickReportModalState {
  events: Array<IEventDTO> | null;
  setEvent: (event: Array<IEventDTO> | null) => void;
  selectedHeading: string | null;
  setSelectedHeading: (selectedHeading: string | null) => void;
}

export const useQuickReportModalState = create<QuickReportModalState>((set) => ({
  events: null,
  setEvent: (events) => set({ events }),
  selectedHeading: null,
  setSelectedHeading: (selectedHeading) => set({ selectedHeading }),
}));
