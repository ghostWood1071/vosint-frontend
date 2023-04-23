import { IEventDto } from "@/services/report-type";
import { create } from "zustand";

interface ReportModalState {
  event: IEventDto | null;
  setEvent: (event: IEventDto | null) => void;
  selectedHeading: number | null;
  setSelectedHeading: (selectedHeading: number | null) => void;
}

export const useReportModalState = create<ReportModalState>((set) => ({
  event: null,
  setEvent: (event) => set({ event }),
  selectedHeading: null,
  setSelectedHeading: (selectedHeading) => set({ selectedHeading }),
}));
