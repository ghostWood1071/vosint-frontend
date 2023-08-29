import { TNews } from "@/models/news.type";
import { ILogHistory } from "@/models/pipeline.type";
import { create } from "zustand";

interface PipelineState {
  error: null | ILogHistory;
  setError: (error: ILogHistory | null) => void;
  data: null | TNews | string;
  setData: (data: TNews | null | string) => void;
}

export const usePipelineState = create<PipelineState>((set) => ({
  error: null,
  setError: (error) => set({ error: error }),
  data: null,
  setData: (data) => set({ data: data }),
}));
