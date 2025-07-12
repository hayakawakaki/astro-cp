export type PaginationOption = {
  page: number;
  pageSize: number;
};

export type PaginationReturn<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
