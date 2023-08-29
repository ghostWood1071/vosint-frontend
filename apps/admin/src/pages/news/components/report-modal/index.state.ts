import { IEventDTO } from "@/models/event.type";
import { create } from "zustand";

interface ReportModalState {
  events: Array<IEventDTO> | null;
  setEvent: (event: Array<IEventDTO> | null) => void;
  selectedHeading: string | null;
  setSelectedHeading: (selectedHeading: string | null) => void;
}

export const useReportModalState = create<ReportModalState>((set) => ({
  events: null,
  setEvent: (events) => set({ events }),
  selectedHeading: null,
  setSelectedHeading: (selectedHeading) => set({ selectedHeading }),
}));
