import { getSourceConfig } from "@/services/source-config.service";
import { useQuery } from "react-query";

export const CACHE_KEYS = {
  SourceNewsConfig: "SOURCE_NEWS_CONFIG",
};

export const useSourceNewsConfigList = () => {
  return useQuery([CACHE_KEYS.SourceNewsConfig], () => getSourceConfig());
};
