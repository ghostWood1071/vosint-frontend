import { IActionParamInfo, IPipelineSchema } from "@/services/pipeline.type";
import { UniqueIdentifier } from "@dnd-kit/core";

export interface TreeItem extends IPipelineSchema {
  name: string;
  readme?: string;
  display_name?: string;
  is_ctrl_flow?: boolean;
  param_infos?: IActionParamInfo[];
  collapsed?: boolean;
  params:
    | Record<string, string>
    | {
        actions: TreeItems;
      };
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}
