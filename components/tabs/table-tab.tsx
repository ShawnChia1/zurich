"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import type { TableData } from "@/lib/types"

interface TableTabProps {
  tableData: TableData
  setTableData: React.Dispatch<React.SetStateAction<TableData>>
}

export default function TableTab({ tableData, setTableData }: TableTabProps) {
  // Table management
  const addColumn = () => {
    const newColumnName = `Column ${tableData.columns.length + 1}`
    setTableData({
      ...tableData,
      columns: [...tableData.columns, newColumnName],
    })
  }

  const addRow = () => {
    const newRowName = `Row ${tableData.rows.length + 1}`
    setTableData({
      ...tableData,
      rows: [...tableData.rows, newRowName],
    })
  }

  const removeColumn = (index: number) => {
    const newColumns = [...tableData.columns]
    newColumns.splice(index, 1)

    // Remove cells associated with this column
    const newCells = { ...tableData.cells }
    tableData.rows.forEach((row) => {
      delete newCells[`${row}-${tableData.columns[index]}`]
    })

    setTableData({
      ...tableData,
      columns: newColumns,
      cells: newCells,
    })
  }

  const removeRow = (index: number) => {
    const newRows = [...tableData.rows]
    const rowToRemove = newRows[index]
    newRows.splice(index, 1)

    // Remove cells associated with this row
    const newCells = { ...tableData.cells }
    tableData.columns.forEach((column) => {
      delete newCells[`${rowToRemove}-${column}`]
    })

    setTableData({
      ...tableData,
      rows: newRows,
      cells: newCells,
    })
  }

  const updateCell = (row: string, column: string, value: string) => {
    setTableData({
      ...tableData,
      cells: {
        ...tableData.cells,
        [`${row}-${column}`]: value,
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dynamic Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Button onClick={addRow} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Row
          </Button>
          <Button onClick={addColumn} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Column
          </Button>
        </div>

        <div className="overflow-auto border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-2 border-r"></th>
                {tableData.columns.map((column, index) => (
                  <th key={column} className="p-2 border-r">
                    <div className="flex items-center justify-between">
                      <Input
                        value={column}
                        onChange={(e) => {
                          const newColumns = [...tableData.columns]
                          newColumns[index] = e.target.value
                          setTableData({ ...tableData, columns: newColumns })
                        }}
                        className="h-8 min-w-[100px]"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeColumn(index)} className="h-6 w-6 ml-1">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIndex) => (
                <tr key={row} className="border-t">
                  <td className="p-2 border-r bg-muted/30">
                    <div className="flex items-center justify-between">
                      <Input
                        value={row}
                        onChange={(e) => {
                          const newRows = [...tableData.rows]
                          newRows[rowIndex] = e.target.value
                          setTableData({ ...tableData, rows: newRows })
                        }}
                        className="h-8 min-w-[100px]"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeRow(rowIndex)} className="h-6 w-6 ml-1">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                  {tableData.columns.map((column) => (
                    <td key={`${row}-${column}`} className="p-2 border-r">
                      <Input
                        value={tableData.cells[`${row}-${column}`] || ""}
                        onChange={(e) => updateCell(row, column, e.target.value)}
                        className="h-8"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

