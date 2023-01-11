export type APIResponse<T> = {
  payload: T;
  Metadata?: {
    Total_Records: number;
  };
  Success?: boolean;
};
