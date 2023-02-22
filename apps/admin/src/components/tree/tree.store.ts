import create from "zustand";

export enum ETreeTag {
  CHU_DE = "chu_de",
  LINH_VUC = "linh_vuc",
  GIO_TIN = "gio_tin",
  QUAN_TRONG = "quan_trong",
  DANH_DAU = "danh_dau",
}

export enum ETreeAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  SELECT = "select",
}

type TreeState = {
  tag: ETreeTag | null;
  action: ETreeAction | null;
  data: Record<string, any> | null;
};

type TreeAction = {
  setValues: (data: TreeState) => void;
} & TreeState;

export const useTreeStore = create<TreeAction>((set) => ({
  tag: null,
  action: null,
  data: null,
  setValues: (data) => set(data),
}));
