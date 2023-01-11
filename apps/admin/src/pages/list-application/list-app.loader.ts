import { getListApp } from "@/services/list-app.service";
import { useQuery } from "react-query";

export const INFOR_SOURCE = "list_app";
export const useListApp = () => {
  return useQuery([INFOR_SOURCE], () => getListApp());
};
