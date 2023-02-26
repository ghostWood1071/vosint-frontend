import create from "zustand";

export enum ECateTag {
  TO_CHUC = "to_chuc",
  QUOC_GIA = "quoc_gia",
  DOI_TUONG = "doi_tuong",
}

export enum ECateAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

type CateState = {
  tag: ECateTag | null;
  action: ECateAction | null;
  data: Record<string, any> | null;
};

type CateAction = {
  setValues: (data: CateState) => void;
} & CateState;

export const useCateStore = create<CateAction>((set) => ({
  tag: null,
  action: null,
  data: null,
  setValues: (data) => set(data),
}));
