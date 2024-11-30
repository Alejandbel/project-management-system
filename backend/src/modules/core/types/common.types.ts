export type ParamsId = { id: number };

export const SORT_DIRECTION = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];

export type ItemListOptions<TSortFiled extends string> = {
  sortField: TSortFiled;
  sortDirection: SortDirection;
  limit: number;
  offset: number;
};
