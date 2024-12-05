export interface IFilter {
  search: string;
}
export interface ISort {
  field: string;
  order: SortOrderEnum;
}
export interface IPagination {
  limit: number;
  page: number;
}
