import {
  ILogHistory,
  IPipelineRunAllJob,
  IPipelineRunJob,
  IPipelineVerify,
} from "@/models/pipeline.type";
import type { IPipelineSource } from "@/models/source-config.type";
import {
  getHistory,
  getLogHistoryLast,
  startAllJob,
  startJobById,
  stopAllJob,
  stopJobById,
  verifyPipeline,
} from "@/services/job.service";
import {
  clonePipeline,
  deletePipeline,
  getActionInfos,
  getPipelineDetail,
  getPipelines,
  putPipeline,
} from "@/services/pipeline.service";
import { getPipelineSource } from "@/services/source.service";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import type { UseMutationOptions, UseQueryOptions } from "react-query";

export const CACHE_KEYS = {
  Pipelines: "PIPELINES",
  PipelineActionInfos: "PIPELINE_ACTION_INFOS",
  PipelineDetail: "PIPELINE_DETAIL",
  PipelineUpdate: "PIPELINE_UPDATE",
  PipelineVerify: "PIPELINE_VERIFY",
  PipelineHistory: "PipelineHistory",
  PipelineSource: "PIPELINE_SOURCE",
  PipelineLogHistoryLast: "PIPELINE_LOG_HISTORY_LAST",
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

export const usePutPipeline = (options?: UseMutationOptions<unknown, unknown, any>) => {
  return useMutation((data) => putPipeline(data), options);
};

export const useVerifyPipeline = (
  options?: UseMutationOptions<
    IPipelineVerify,
    unknown,
    {
      id: string;
      mode_test?: boolean;
    }
  >,
) => {
  return useMutation(({ id, mode_test }) => verifyPipeline(id, mode_test), options);
};

export const usePipelineSource = (options?: UseQueryOptions<IPipelineSource[]>) => {
  return useQuery<IPipelineSource[]>(CACHE_KEYS.PipelineSource, getPipelineSource, options);
};

export const useClonePipeline = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => clonePipeline(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.Pipelines]);
      message.success("Nhân bản pipeline thành công");
    },
  });
};

export const useDeletePipeline = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deletePipeline(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.Pipelines]);
      message.success("Xoá pipeline thành công");
    },
  });
};

export const useMutateRunOrStopJob = (
  options?: UseMutationOptions<unknown, unknown, IPipelineRunJob>,
) => {
  return useMutation(({ _id, activated }) => {
    if (activated) {
      return startJobById(_id);
    } else {
      return stopJobById(_id);
    }
  }, options);
};

export const useMutateRunOrStopAllJob = (
  options?: UseMutationOptions<unknown, unknown, IPipelineRunAllJob>,
) => {
  return useMutation(({ status }) => {
    if (status === "start") {
      return startAllJob();
    }

    if (status === "stop") {
      return stopAllJob();
    }

    throw new Error("not found status");
  }, options);
};

export const usePipelineLogHistoryLastLazy = (
  options?: UseMutationOptions<ILogHistory, unknown, string>,
) => {
  return useMutation((id) => getLogHistoryLast(id), options);
};
