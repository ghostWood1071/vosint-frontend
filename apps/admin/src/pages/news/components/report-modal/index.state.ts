import { IEventDto } from "@/services/report-type";
import { create } from "zustand";

interface ReportModalState {
  events: Array<IEventDto> | null;
  setEvent: (event: Array<IEventDto> | null) => void;
  selectedHeading: string | null;
  setSelectedHeading: (selectedHeading: string | null) => void;
}

export const useReportModalState = create<ReportModalState>((set) => ({
  events: null,
  setEvent: (events) => set({ events }),
  selectedHeading: null,
  setSelectedHeading: (selectedHeading) => set({ selectedHeading }),
}));
