type PaginationOption = {
  page: number;
  pageSize: number;
};

type PaginationReturn<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export default class Pagination<T> {
  private data: Map<any, T>;
  private keys: any[] = [];

  constructor(data: Map<any, T>) {
    this.data = data;
    this.keys = Array.from(data.keys());
  }

  public paginize(options: PaginationOption): PaginationReturn<T> {
    const totalItems = this.keys.length;
    const totalPages = Math.ceil(totalItems / options.pageSize);
    const startIndex = (options.page - 1) * options.pageSize;
    const endIndex = startIndex + options.pageSize;

    // Get current page data
    const pageKeys = this.keys.slice(startIndex, endIndex);
    const items = pageKeys.map(key => this.data.get(key)!) as T[];

    return {
      items,
      page: options.page,
      pageSize: options.pageSize,
      totalItems,
      totalPages,
      hasNext: options.page < totalPages,
      hasPrev: options.page > 1,
    };
  }
}
