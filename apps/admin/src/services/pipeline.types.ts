import { UniqueIdentifier } from "@dnd-kit/core";

export type IPipelines = {
  _id: string;
  actived: boolean;
  created_at: string;
  enabled: boolean;
  modified_at: string;
  name: string;
};

export type IPipeline = {
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

export type IPipelineSchema = {
  id: UniqueIdentifier;
  name: string;
  params:
    | Record<string, string>
    | {
        actions: IPipelineSchema[];
      };
};

export type IActionInfos = {
  action_type: string;
  display_name: string;
  is_ctrl_flow: boolean;
  name: string;
  param_infos: IActionParamInfo[];
  readme: string;
  z_index: number;
  id: UniqueIdentifier;
};

export interface IActionParamInfo {
  default_val: any;
  display_name: string;
  name: string;
  val_type: string;
  validators: string[];
  z_index: number;
  options?: string[];
}
