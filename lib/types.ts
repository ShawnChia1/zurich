export type Task = {
  id: string;
  text: string;
  completed: boolean;
  sn?: string;
  extensions?: string;
  sumInsured?: string;
};

export type Checkpoint = {
  id: string;
  title: string;
  description: string;
};

export type TableData = {
  rows: string[];
  columns: string[];
  cells: { [key: string]: string };
};
