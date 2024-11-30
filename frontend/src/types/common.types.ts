export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const NumberToSortDirection: Record<number, SortDirection> = {
  1: SortDirection.ASC,
  [-1]: SortDirection.DESC,
};

export const SortDirectionToNumber: Record<SortDirection, number> = {
  [SortDirection.ASC]: 1,
  [SortDirection.DESC]: -1,
};
