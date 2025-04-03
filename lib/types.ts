export type Task = {
    id: string
    text: string
    completed: boolean
  }
  
  export type Checkpoint = {
    id: string
    title: string
    description: string
  }
  
  export type TableData = {
    rows: string[]
    columns: string[]
    cells: { [key: string]: string }
  }
  
  