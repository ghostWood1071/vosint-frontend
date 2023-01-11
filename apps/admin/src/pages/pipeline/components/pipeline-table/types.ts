export interface IPipelineTable {
  data: IPipelineTableData[];
  total: number;
}

export interface IPipelineTableData {
  _id: string;
  name: string;
  pipe_data: any[];
  created_at: number;
  status: number;
  active: number;
  state: string;
  host?: string;
}

export interface PipeDaum {
  name: string;
  params: Param[];
}

export interface Param {
  name: string;
  require: boolean;
  value: any;
  data_list?: string[];
  type: string;
}
