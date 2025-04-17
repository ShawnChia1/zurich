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


export interface Extension {
  Item?: string;
  EventName?: string;
  Venue?: string;
  EventDate?: string;
  SumInsuredPerPerson?: string;
  NoOfParticipants?: string;
  PremiumRatePerParticipant?: string;
  TotalPremium?: string;
  ColumnOrder: string;
}