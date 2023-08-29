import { UniqueIdentifier } from "@dnd-kit/core";
import { TNews } from "./news.type";

type IPipelines = {
  _id: string;
  actived: boolean;
  created_at: string;
  enabled: boolean;
  modified_at: string;
  name: string;
};

type IPipeline = {
  _id: string;
  actived: boolean;
  created_at: string;
  cron_expr: string;
  enabled: boolean;
  logs: any[];
  modified_at: string;
  name: string;
  schema: IPipelineSchema[];
};

type IPipelineSchema = {
  id: UniqueIdentifier;
  name: string;
  params:
    | Record<string, string>
    | {
        actions: IPipelineSchema[];
      };
};

type IActionInfos = {
  action_type: string;
  display_name: string;
  is_ctrl_flow: boolean;
  name: string;
  param_infos: IActionParamInfo[];
  readme: string;
  z_index: number;
  id: UniqueIdentifier;
};

interface IActionParamInfo {
  default_val: any;
  display_name: string;
  name: string;
  val_type: string;
  validators: string[];
  z_index: number;
  options?: string[];
}

interface IPipelineRunJob {
  _id: string;
  activated: boolean;
}

interface IPipelineRunAllJob {
  status: "start" | "stop";
}

interface ILogHistory {
  actione: string;
  log: string;
  link: string;
  id_schema: string;
  message_error: string;
  created_at: string;
  modified_at: string;
}

interface IPipelineVerify {
  success: boolean;
  result: TNews | string;
}

export type {
  IPipelines,
  IPipeline,
  IPipelineSchema,
  IActionInfos,
  IActionParamInfo,
  IPipelineRunJob,
  IPipelineRunAllJob,
  ILogHistory,
  IPipelineVerify,
}