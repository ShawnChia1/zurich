export type Task = {
  id: string;
  sn?: string;
  extensions?: string;
  sumInsured?: string;
};

export type Checkpoint = {
  id: string;
  title: string;
};

export interface TableData {
  columns: string[]
  rows: string[]
  cells: Record<string, string>
  mergedCellsData?: Record<string, any>
  isFullScreen?: boolean
  sortingState?: { id: string; desc: boolean }[]
}
