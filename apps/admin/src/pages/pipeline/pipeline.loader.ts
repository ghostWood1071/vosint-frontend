import {
  clonePipeline,
  deletePipeline,
  getActionInfos,
  getPipelineDetail,
  getPipelines,
  putPipeline,
} from "@/services/pipeline.service";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const CACHE_KEYS = {
  Pipelines: "PIPELINES",
  PipelineActionInfos: "PIPELINE_ACTION_INFOS",
  PipelineDetail: "PIPELINE_DETAIL",
};

export const usePipelineActionInfos = () => {
  return useQuery([CACHE_KEYS.PipelineActionInfos], () => getActionInfos());
};

export const usePipelines = () => {
  return useQuery([CACHE_KEYS.Pipelines], () => getPipelines());
};

export const usePipelineDetail = (id: string, enabled: boolean) => {
  return useQuery([CACHE_KEYS.PipelineDetail, id], () => getPipelineDetail(id), { enabled });
};

export const usePutPipeline = ({ onSuccess = () => {}, onError = () => {} }) => {
  return useMutation((data: any) => putPipeline(data), {
    onSuccess,
    onError,
  });
};

export const useClonePipeline = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => clonePipeline(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.Pipelines]);
      message.success("Cloned pipeline");
    },
  });
};

export const useDeletePipeline = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deletePipeline(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.Pipelines]);
      message.success("Deleted pipeline");
    },
  });
};
