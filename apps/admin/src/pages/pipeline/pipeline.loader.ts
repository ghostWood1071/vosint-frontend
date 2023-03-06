import {
  clonePipeline,
  deletePipeline,
  getActionInfos,
  getHistory,
  getPipelineDetail,
  getPipelines,
  putPipeline,
  startAllJob,
  startJobById,
  stopAllJob,
  stopJobById,
  verifyPipeline,
} from "@/services/pipeline.service";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const CACHE_KEYS = {
  Pipelines: "PIPELINES",
  PipelineActionInfos: "PIPELINE_ACTION_INFOS",
  PipelineDetail: "PIPELINE_DETAIL",
  PipelineUpdate: "PIPELINE_UPDATE",
  PipelineVerify: "PIPELINE_VERIFY",
  PipelineHistory: "PipelineHistory",
};

export const usePipelineActionInfos = () => {
  return useQuery([CACHE_KEYS.PipelineActionInfos], () => getActionInfos());
};

export const usePipelines = (filter: any) => {
  return useQuery([CACHE_KEYS.Pipelines, filter], () => getPipelines(filter));
};

export const usePipelineDetail = (id: string, enabled: boolean) => {
  return useQuery([CACHE_KEYS.PipelineDetail, id], () => getPipelineDetail(id), { enabled });
};

export const usePipelineHistory = (id: string, filter: Record<string, any>) => {
  return useQuery([CACHE_KEYS.PipelineHistory, id, filter], () => getHistory(id, filter), {
    enabled: !!id,
  });
};

export const usePutPipeline = ({ onSuccess = () => {}, onError = () => {} }) => {
  const queryClient = useQueryClient();

  return useMutation((data: any) => putPipeline(data), {
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries([CACHE_KEYS.Pipelines]);
    },
    onError,
  });
};

export const useVerifyPipeline = ({ onSuccess = () => {}, onError = () => {} }) => {
  return useMutation((id: string) => verifyPipeline(id), {
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

export const useMutateRunOrStopJob = () => {
  return useMutation<unknown, unknown, { _id: string; enabled: boolean }>(({ _id, enabled }) => {
    if (enabled) {
      return startJobById(_id);
    } else {
      return stopJobById(_id);
    }
  });
};

export const useMutateRunOrStopAllJob = () => {
  return useMutation<unknown, unknown, { status: "start" | "stop" }>(({ status }) => {
    if (status === "start") {
      return startAllJob();
    }

    if (status === "stop") {
      return stopAllJob();
    }

    throw new Error("not found status");
  });
};
