import { IEventDto } from "@/services/report-type";
import { create } from "zustand";

interface QuickReportModalState {
  events: Array<IEventDto> | null;
  setEvent: (event: Array<IEventDto> | null) => void;
  selectedHeading: string | null;
  setSelectedHeading: (selectedHeading: string | null) => void;
}

export const useQuickReportModalState = create<QuickReportModalState>((set) => ({
  events: null,
  setEvent: (events) => set({ events }),
  selectedHeading: null,
  setSelectedHeading: (selectedHeading) => set({ selectedHeading }),
}));
