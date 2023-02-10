export type APIResponse<T> = {
  payload: T;
  metadata?: {
    total_records: number;
  };
  Success?: boolean;
};
