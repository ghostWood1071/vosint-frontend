import { getSourceConfig } from "@/services/source-config.service";
import { useQuery } from "react-query";

export const CACHE_KEYS = {
  InfoSource: "INFO_SOURCE",
};

export const useSourceConfig = () => {
  return useQuery([CACHE_KEYS.InfoSource], () => getSourceConfig());
};
