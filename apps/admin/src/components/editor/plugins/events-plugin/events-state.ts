import moment from "moment";
import type { Dispatch } from "react";
import { create } from "zustand";

interface EventsState {
  dateTimeFilter: [string, string];
  setDateTimeFilter: Dispatch<[string, string]>;
}

export const useEventsState = create<EventsState>((set) => ({
  dateTimeFilter: [
    moment().subtract(7, "days").format("DD/MM/YYYY"),
    moment().format("DD/MM/YYYY"),
  ],
  setDateTimeFilter: (dateTimeFilter) => set({ dateTimeFilter }),
}));
