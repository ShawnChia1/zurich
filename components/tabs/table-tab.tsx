"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Trash2,
  Search,
  Columns,
  MergeIcon,
  SquareSplitVerticalIcon as SplitVertical,
  RowsIcon,
  ChevronDown,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Maximize2,
  Minimize2,
  X,
  FilterX,
} from "lucide-react"
import type { TableData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { stringify } from "querystring"

interface TableTabProps {
  tableData: TableData
  setTableData: React.Dispatch<React.SetStateAction<TableData>>
  columnOrder: string[]
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>
}

interface MergedCell {
  rowSpan: number
  colSpan: number
  startRow: string
  startCol: string
  coveredCells: string[]
}

// Interface for cell rendering information
interface CellInfo {
  rowId: string
  colId: string
  rowSpan: number
  colSpan: number
  content: string
  isVisible: boolean
}

export default function TableEditor({ tableData, setTableData, columnOrder, setColumnOrder }: TableTabProps) {
  const [searchText, setSearchText] = useState("")
  const [selectedCells, setSelectedCells] = useState<string[]>([])
  const [mergedCells, setMergedCells] = useState<Record<string, MergedCell>>({})
  const [availableColumns, setAvailableColumns] = useState<string[]>([
    "Item",
    "Event Name",
    "Venue",
    "Event Date",
    "Sum Insured Per Person",
    "No Of Participants",
    "Premium Rate Per Participant",
    "Total Premium",
  ])
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)

  const tableRef = useRef<HTMLDivElement>(null)
  const fullScreenRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize column widths
  useEffect(() => {
    const initialWidths: Record<string, number> = {}
    tableData.columns.forEach((column) => {
      if (!columnWidths[column]) {
        initialWidths[column] = 150 // Default width
      }
    })
    if (Object.keys(initialWidths).length > 0) {
      setColumnWidths((prev) => ({ ...prev, ...initialWidths }))
    }
  }, [tableData.columns, columnWidths])

  // Handle mouse move for column resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn) {
        const diff = e.clientX - startX
        const newWidth = Math.max(50, startWidth + diff) // Minimum width of 50px
        setColumnWidths((prev) => ({
          ...prev,
          [resizingColumn]: newWidth,
        }))
      }
    }

    const handleMouseUp = () => {
      setResizingColumn(null)
    }

    if (resizingColumn) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [resizingColumn, startX, startWidth])

  // Start column resize
  const startResize = (column: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setResizingColumn(column)
    setStartX(e.clientX)
    setStartWidth(columnWidths[column] || 150)
  }

  // Memoize data to prevent recreation on each render
  const data = useMemo(() => {
    return tableData.rows.map((row) => {
      const rowData: Record<string, any> = { id: row }
      tableData.columns.forEach((column) => {
        const cellId = `${row}-${column}`
        rowData[column] = tableData.cells[cellId] || ""
      })
      return rowData
    })
  }, [tableData.rows, tableData.columns, tableData.cells])

  // Memoize columns to prevent recreation on each render
  const columns = useMemo<ColumnDef<any>[]>(() => {
    return tableData.columns.map((column) => ({
      accessorKey: column,
      header: () => (
        <div className="flex items-center justify-between">
          <span className="font-medium">{column}</span>
        </div>
      ),
      cell: ({ row }) => {
        // We're not using TanStack Table's cell rendering
        // This is just a placeholder to make TanStack Table happy
        return <div></div>
      },
      enableSorting: true,
    }))
  }, [tableData.columns])

  // Initialize TanStack Table with memoized values
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: searchText,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearchText,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // Handle ESC key to exit full screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullScreen])

  // Focus textarea when editing cell
  useEffect(() => {
    if (editingCell && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [editingCell])

  // Cell selection and editing
  const handleCellClick = useCallback(
    (cellId: string) => {
      if (editingCell) return

      // Toggle cell selection
      setSelectedCells((prev) => {
        if (prev.includes(cellId)) {
          return prev.filter((id) => id !== cellId)
        } else {
          return [...prev, cellId]
        }
      })
    },
    [editingCell],
  )

  // Start editing a cell
  const startEditing = useCallback(
    (cellId: string) => {
      const cellValue = tableData.cells[cellId] || ""
      setEditingCell(cellId)
      setEditingValue(cellValue)
      setSelectedCells([]) // Clear selection when editing
    },
    [tableData.cells],
  )

  // Add a function to check if a column has merged cells underneath it
  // Add this after the isColumnInTable function
  const hasColumnMergedCells = useCallback(
    (column: string) => {
      // Check if any merged cell spans across this column
      return Object.values(mergedCells).some((mergedCell) => {
        const [startRow, startCol] = mergedCell.startRow ? [mergedCell.startRow, mergedCell.startCol] : ["", ""]
        const startColIndex = tableData.columns.indexOf(startCol)

        // If this merged cell has colSpan > 1, check if it affects the given column
        if (mergedCell.colSpan > 1) {
          const endColIndex = startColIndex + mergedCell.colSpan - 1
          const columnIndex = tableData.columns.indexOf(column)
          return columnIndex >= startColIndex && columnIndex <= endColIndex
        }

        // If this is the starting column of a merged cell
        return startCol === column
      })
    },
    [mergedCells, tableData.columns],
  )

  // Modify the finishEditing function to properly maintain sort order after editing
  // Replace the current finishEditing function with this improved version:

  const finishEditing = useCallback(() => {
    if (editingCell) {
      // Store the current sorting state
      const currentSorting = [...sorting]

      setTableData((prevData) => {
        const newData = {
          ...prevData,
          cells: {
            ...prevData.cells,
            [editingCell]: editingValue,
          },
          // Store mergedCells in tableData to persist across rerenders
          mergedCellsData: mergedCells,
          // Store fullscreen state in tableData to persist across rerenders
          isFullScreen: isFullScreen,
          // Store the current sorting state in tableData
          sortingState: currentSorting,
        }

        return newData
      })

      // Ensure the table maintains its sort order
      // We need to force a re-sort by temporarily clearing and then re-applying the sort
      if (currentSorting.length > 0) {
        // Use setTimeout to ensure this happens after the state update
        setTimeout(() => {
          // Force re-sort by applying the same sorting configuration
          setSorting([...currentSorting])
        }, 0)
      }

      setEditingCell(null)
      setEditingValue("")
    }
  }, [editingCell, editingValue, setTableData, mergedCells, isFullScreen, sorting])

  // Add a new column
  const addColumn = useCallback(() => {
    let newColumns: string[] = []

    if (selectedColumns.length === 0) {
      const newColumnName = `Column ${tableData.columns.length + 1}`
      newColumns = [newColumnName]
    } else {
      newColumns = selectedColumns
      setSelectedColumns([])
    }

    setTableData((prev) => {
      const updatedColumns = [...prev.columns, ...newColumns];
      const updatedCells = {...prev.cells};

      prev.rows.forEach((row) => {
        newColumns.forEach((column) => {
          const cellId = `${row}-${column}`;
          updatedCells[cellId] = "";
        })
      })

      return {...prev, columns: updatedColumns, cells: updatedCells};
    })

    setColumnOrder(columnOrder.concat(newColumns));
  }, [selectedColumns, tableData.columns.length, setTableData])

  // Add a new row
  const addRow = useCallback(() => {
    const newRowName = `Row ${tableData.rows.length + 1}`
    setTableData((prev) => ({
      ...prev,
      rows: [...prev.rows, newRowName],
    }))
  }, [tableData.rows.length, setTableData])

  // Remove a column
  const removeColumn = useCallback(
    (columnName: string) => {
      setTableData((prev) => {
        const newColumns = prev.columns.filter((col) => col !== columnName)

        // Remove cells associated with this column
        const newCells = { ...prev.cells }
        prev.rows.forEach((row) => {
          delete newCells[`${row}-${columnName}`]
        })

        return {
          ...prev,
          columns: newColumns,
          cells: newCells,
        }
      })

      setColumnOrder((prev) => {
        return prev.filter(column => column !== columnName);
      })
    },
    [setTableData],
  )

  // Remove a row
  const removeRow = useCallback(
    (rowName: string) => {
      setTableData((prev) => {
        const newRows = prev.rows.filter((row) => row !== rowName)

        // Remove cells associated with this row
        const newCells = { ...prev.cells }
        prev.columns.forEach((column) => {
          delete newCells[`${rowName}-${column}`]
        })

        return {
          ...prev,
          rows: newRows,
          cells: newCells,
        }
      })
    },
    [setTableData],
  )

  // Cell merging functionality
  const canMergeCells = useCallback(() => {
    if (selectedCells.length < 2) return false

    // Extract row and column indices
    const cellPositions = selectedCells.map((cellId) => {
      const [row, col] = cellId.split("-")
      return {
        rowIndex: tableData.rows.indexOf(row),
        colIndex: tableData.columns.indexOf(col),
      }
    })

    // Check if selected cells form a rectangle
    const rowIndices = cellPositions.map((pos) => pos.rowIndex)
    const colIndices = cellPositions.map((pos) => pos.colIndex)

    const minRow = Math.min(...rowIndices)
    const maxRow = Math.max(...rowIndices)
    const minCol = Math.min(...colIndices)
    const maxCol = Math.max(...colIndices)

    // Check if all cells in the rectangle are selected
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const cellId = `${tableData.rows[r]}-${tableData.columns[c]}`
        if (!selectedCells.includes(cellId)) {
          return false
        }
      }
    }

    return true
  }, [selectedCells, tableData.rows, tableData.columns])

  // Merge selected cells
  const mergeCells = useCallback(() => {
    if (!canMergeCells()) return

    // Extract row and column indices
    const cellPositions = selectedCells.map((cellId) => {
      const [row, col] = cellId.split("-")
      return {
        rowIndex: tableData.rows.indexOf(row),
        colIndex: tableData.columns.indexOf(col),
        row,
        col,
      }
    })

    // Find the boundaries of the merged area
    const rowIndices = cellPositions.map((pos) => pos.rowIndex)
    const colIndices = cellPositions.map((pos) => pos.colIndex)

    const minRow = Math.min(...rowIndices)
    const maxRow = Math.max(...rowIndices)
    const minCol = Math.min(...colIndices)
    const maxCol = Math.max(...colIndices)

    const startRow = tableData.rows[minRow]
    const startCol = tableData.columns[minCol]
    const topLeftCellId = `${startRow}-${startCol}`

    // Calculate rowSpan and colSpan
    const rowSpan = maxRow - minRow + 1
    const colSpan = maxCol - minCol + 1

    // Check if any of the affected columns are currently sorted
    const affectedColumns = tableData.columns.slice(minCol, maxCol + 1)
    const hasSortedColumns = sorting.some((sort) => affectedColumns.includes(sort.id))

    // If we're creating a merge that spans multiple columns and any are sorted, clear the sorting
    if (colSpan > 1 && hasSortedColumns) {
      setSorting([])
    }

    // Collect all cells that will be covered by this merge
    const coveredCells: string[] = []
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const cellId = `${tableData.rows[r]}-${tableData.columns[c]}`
        if (cellId !== topLeftCellId) {
          coveredCells.push(cellId)
        }
      }
    }

    // Combine content from all cells
    let mergedContent = ""
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const cellId = `${tableData.rows[r]}-${tableData.columns[c]}`
        if (tableData.cells[cellId]) {
          if (mergedContent) mergedContent += " "
          mergedContent += tableData.cells[cellId]
        }
      }
    }

    // Create the merged cell
    const newMergedCells = { ...mergedCells }
    newMergedCells[topLeftCellId] = {
      rowSpan,
      colSpan,
      startRow,
      startCol,
      coveredCells,
    }

    // Update the table data
    const newCells = { ...tableData.cells }
    newCells[topLeftCellId] = mergedContent

    // Clear cells that are now covered by the merged cell
    coveredCells.forEach((cellId) => {
      delete newCells[cellId]
    })

    // Update state
    setTableData((prev) => ({
      ...prev,
      cells: newCells,
      mergedCellsData: newMergedCells,
    }))
    setMergedCells(newMergedCells)
    setSelectedCells([])
  }, [canMergeCells, selectedCells, tableData, mergedCells, setTableData, sorting])

  // Unmerge cells
  const unmergeCells = useCallback(() => {
    if (selectedCells.length !== 1) return

    const cellId = selectedCells[0]
    const mergedCell = mergedCells[cellId]
    if (!mergedCell) return

    // Remove the merged cell from the mergedCells state
    const newMergedCells = { ...mergedCells }
    delete newMergedCells[cellId]

    setMergedCells(newMergedCells)
    setTableData((prev) => ({
      ...prev,
      mergedCellsData: newMergedCells,
    }))
    setSelectedCells([])
  }, [selectedCells, mergedCells, setTableData])

  // Toggle fullscreen mode
  const toggleFullScreen = useCallback(() => {
    setIsFullScreen((prev) => !prev)
  }, [])

  // Toggle column selection for adding
  const toggleColumnSelection = useCallback((column: string) => {
    setSelectedColumns((prev) => {
      if (prev.includes(column)) {
        return prev.filter((c) => c !== column)
      } else {
        return [...prev, column]
      }
    })
  }, [])

  // Check if a column is already in the table
  const isColumnInTable = useCallback(
    (column: string) => {
      return tableData.columns.includes(column)
    },
    [tableData.columns],
  )

  // Modified Sort column function to clear previous sorts when sorting a new column
  const sortColumn = useCallback((columnId: string, direction: "asc" | "desc" | null) => {
    setSorting((prev) => {
      // If direction is null, we're clearing the sort for this column
      if (direction === null) {
        return prev.filter((sort) => sort.id !== columnId)
      }

      // Check if we're sorting the same column that's already being sorted
      const existingSort = prev.find((sort) => sort.id === columnId)

      if (existingSort) {
        // If we're sorting the same column, just update its direction
        return prev.map((sort) => (sort.id === columnId ? { ...sort, desc: direction === "desc" } : sort))
      } else {
        // If we're sorting a new column, replace any existing sorts with this one
        return [{ id: columnId, desc: direction === "desc" }]
      }
    })
  }, [])

  // Filter column
  const filterColumn = useCallback((columnId: string, value: string) => {
    setColumnFilters((prev) => {
      if (value === "") {
        return prev.filter((filter) => filter.id !== columnId)
      }

      const existingFilter = prev.find((filter) => filter.id === columnId)
      if (existingFilter) {
        return prev.map((filter) => (filter.id === columnId ? { ...filter, value } : filter))
      }

      return [...prev, { id: columnId, value }]
    })
  }, [])

  // Clear filter
  const clearFilter = useCallback((columnId: string) => {
    setColumnFilters((prev) => prev.filter((filter) => filter.id !== columnId))
  }, [])

  // Add this useEffect after the other useEffect hooks
  useEffect(() => {
    if (tableData.mergedCellsData && Object.keys(tableData.mergedCellsData).length > 0) {
      setMergedCells(tableData.mergedCellsData)
    }
  }, [tableData.mergedCellsData])

  // Add this useEffect to restore fullscreen state from tableData
  useEffect(() => {
    if (tableData.isFullScreen !== undefined) {
      setIsFullScreen(tableData.isFullScreen)
    }
  }, [tableData.isFullScreen])

  // Add this useEffect to restore sorting state from tableData
  // Add this after the other useEffect hooks:

  useEffect(() => {
    if (tableData.sortingState && tableData.sortingState.length > 0) {
      setSorting(tableData.sortingState)
    }
  }, [tableData.sortingState])

  const handleDragStart = useCallback((event:React.DragEvent, columnIndex:any) => {
    event.dataTransfer.setData('columnIndex', columnIndex);
  }, []);

  const handleDragOver = useCallback((event:React.DragEvent) => {
    event.preventDefault(); // Allow drop
  }, []);

  const handleDrop = useCallback((event:React.DragEvent, targetIndex:number) => {
    const draggedIndex = parseInt(event.dataTransfer.getData('columnIndex'));
    const newColumns = [...tableData.columns];
    const [draggedColumn] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedColumn);

    setColumnOrder(newColumns);
    setTableData(prevData => ({ ...prevData, columns: newColumns }));
  }, [tableData.columns, setTableData]);

  // Render the table content
  const renderTableContent = () => {
    // Get the sorted and filtered rows from TanStack Table
    const rows = table.getRowModel().rows
    return (
      <>
        <div className="flex flex-col space-y-4 mb-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search table..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-8"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Columns className="h-4 w-4 mr-1" />
                  Add Columns
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {availableColumns.map((column) => {
                  const alreadyInTable = isColumnInTable(column)
                  return (
                    <DropdownMenuCheckboxItem
                      key={column}
                      checked={selectedColumns.includes(column)}
                      onCheckedChange={() => !alreadyInTable && toggleColumnSelection(column)}
                      onSelect={(e) => e.preventDefault()}
                      disabled={alreadyInTable}
                      className={alreadyInTable ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      {column}
                      {alreadyInTable && <span className="ml-2 text-xs text-muted-foreground">(already in table)</span>}
                    </DropdownMenuCheckboxItem>
                  )
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={selectedColumns.length === 0}
                  onClick={addColumn}
                  className="justify-center font-medium"
                >
                  Add Selected Columns
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={toggleFullScreen} className="flex items-center gap-1">
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button onClick={addRow} variant="outline" size="sm" className="flex items-center">
              <RowsIcon className="h-4 w-4 mr-1" /> Add Row
            </Button>
            <Button
              onClick={mergeCells}
              variant="outline"
              size="sm"
              disabled={!canMergeCells()}
              className="flex items-center"
            >
              <MergeIcon className="h-4 w-4 mr-1" /> Merge Cells
            </Button>
            <Button
              onClick={unmergeCells}
              variant="outline"
              size="sm"
              disabled={selectedCells.length !== 1 || !mergedCells[selectedCells[0]]}
              className="flex items-center"
            >
              <SplitVertical className="h-4 w-4 mr-1" /> Unmerge
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto w-full" ref={tableRef}>
          <table className="w-full" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th className="p-2 border-b bg-gray-50 text-center w-10 sticky left-0 z-10">{/* Removed + sign */}</th>
                {tableData.columns.map((column, index) => (
                  <th
                    key={`header-${column}-${index}`}
                    draggable="true"
                    onDragStart={(event) => handleDragStart(event, index)}
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDrop(event, index)}
                    className="p-0 border-b border-r relative"
                    style={{
                      width: `${columnWidths[column] || 150}px`,
                      minWidth: `${columnWidths[column] || 150}px`,
                    }}
                  >
                    <div className="flex items-center justify-between p-2">
                      <span className="font-medium">{column}</span>
                      <div className="flex items-center space-x-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-6 w-6",
                                hasColumnMergedCells(column) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100",
                              )}
                              disabled={hasColumnMergedCells(column)}
                            >
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {hasColumnMergedCells(column) ? (
                              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                                Sorting disabled for columns with merged cells
                              </div>
                            ) : (
                              <>
                                <DropdownMenuItem
                                  onClick={() => sortColumn(column, "asc")}
                                  className="flex justify-between"
                                >
                                  <span>Sort Ascending</span>
                                  {sorting.some((s) => s.id === column && !s.desc) && <ArrowUp className="h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => sortColumn(column, "desc")}
                                  className="flex justify-between"
                                >
                                  <span>Sort Descending</span>
                                  {sorting.some((s) => s.id === column && s.desc) && <ArrowDown className="h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => sortColumn(column, null)}
                                  className="flex justify-between"
                                >
                                  <span>Clear Sort</span>
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <div className="p-2">
                              <p className="text-xs font-medium mb-1">Filter</p>
                              <div className="flex items-center gap-1">
                                <Input
                                  placeholder="Filter value..."
                                  className="h-7 text-xs"
                                  value={(columnFilters.find((f) => f.id === column)?.value as string) || ""}
                                  onChange={(e) => filterColumn(column, e.target.value)}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => clearFilter(column)}
                                  disabled={!columnFilters.some((f) => f.id === column)}
                                >
                                  <FilterX className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeColumn(column)}
                          className="h-6 w-6 hover:bg-gray-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {/* Column resize handle */}
                    <div
                      className="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-gray-400"
                      onMouseDown={(e) => startResize(column, e)}
                    />
                    {/* Filter indicator */}
                    {columnFilters.some((f) => f.id === column) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const rowId = row.original.id
                // Create a map to track which cells have been rendered
                // This helps us skip cells that are covered by merged cells
                const renderedCells = new Set<string>()

                return (
                  <tr key={row.id}>
                    <td className="p-0 border-b bg-gray-50 w-10 text-center sticky left-0 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRow(rowId)}
                        className="h-6 w-6 hover:bg-gray-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>

                    {tableData.columns.map((column, colIndex) => {
                      const cellId = `${rowId}-${column}`
                      // Skip if this cell has already been rendered as part of a merged cell
                      if (renderedCells.has(cellId)) {
                        return null
                      }

                      // Check if this cell is covered by any merged cell
                      const isCoveredByMerge = Object.values(mergedCells).some((mc) => mc.coveredCells.includes(cellId))

                      // Skip if this cell is covered by a merged cell
                      if (isCoveredByMerge) {
                        renderedCells.add(cellId)
                        return null
                      }

                      // Get merged cell properties if this is a merged cell
                      const mergedCell = mergedCells[cellId]
                      const isSelected = selectedCells.includes(cellId)

                      // If this is a merged cell, mark all covered cells as rendered
                      if (mergedCell) {
                        mergedCell.coveredCells.forEach((coveredCellId) => {
                          renderedCells.add(coveredCellId)
                        })
                      }

                      return (
                        <td
                          key={`cell-${rowId}-${column}-${colIndex}`}
                          className={cn("p-0 border-b border-r relative", isSelected && "bg-blue-50")}
                          rowSpan={mergedCell?.rowSpan || 1}
                          colSpan={mergedCell?.colSpan || 1}
                          onClick={() => handleCellClick(cellId)}
                          onDoubleClick={() => startEditing(cellId)}
                          style={{
                            width: `${columnWidths[column] || 150}px`,
                            minWidth: `${columnWidths[column] || 150}px`,
                          }}
                        >
                          {editingCell === cellId ? (
                            <textarea
                              ref={textareaRef}
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="w-full h-full border-0 bg-transparent focus:outline-none focus:ring-0 px-2 py-1 min-h-[32px] resize-none"
                              onClick={(e) => e.stopPropagation()}
                              onBlur={finishEditing}
                              autoFocus
                            />
                          ) : (
                            <div className="p-2 min-h-[32px] whitespace-pre-wrap break-words">
                              {tableData.cells[cellId] || ""}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-2 text-sm text-muted-foreground space-y-1">
          {selectedCells.length > 0 && <div>{selectedCells.length} cell(s) selected</div>}
          {columnFilters.length > 0 && (
            <div>Filters: {columnFilters.map((f) => `${f.id}="${f.value}"`).join(", ")}</div>
          )}
          <div className="text-xs text-gray-500">
            Double-click a cell to edit its content. Click once to select for merging.
          </div>
        </div>
      </>
    )
  }

  // Render the full screen overlay if in full screen mode
  if (isFullScreen) {
    return (
      <div
        ref={fullScreenRef}
        className="fixed inset-0 z-50 bg-white overflow-auto p-6"
        style={{ width: "100vw", height: "100vh", color: "#23366f" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Table Editor</h2>
          <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {renderTableContent()}
      </div>
    )
  }

  // Normal view
  return (
    <Card style={{color: "#23366f"}}>
      <CardHeader>
        <CardTitle>Dynamic Table</CardTitle>
      </CardHeader>
      <CardContent>{renderTableContent()}</CardContent>
    </Card>
  )
}