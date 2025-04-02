"use client"

import type React from "react"

import { useState } from "react"
import { Check, ChevronRight, ChevronLeft, Plus, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Task = {
  id: string
  text: string
  completed: boolean
}

type Checkpoint = {
  id: string
  title: string
  description: string
}

type TableData = {
  rows: string[]
  columns: string[]
  cells: { [key: string]: string }
}

export default function WorkflowManagement() {
  const [activeTab, setActiveTab] = useState("checkpoints")
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0)
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([
    { id: "1", title: "Planning", description: "Define project scope and requirements" },
    { id: "2", title: "Design", description: "Create mockups and wireframes" },
    { id: "3", title: "Development", description: "Implement the core functionality" },
    { id: "4", title: "Testing", description: "Ensure quality and fix bugs" },
    { id: "5", title: "Deployment", description: "Release to production" },
  ])

  const [tasks, setTasks] = useState<Task[]>([
    { id: "task1", text: "Define project requirements", completed: true },
    { id: "task2", text: "Create wireframes", completed: false },
    { id: "task3", text: "Implement core features", completed: false },
    { id: "task4", text: "Write test cases", completed: false },
    { id: "task5", text: "Deploy to staging", completed: false },
  ])

  const [tableData, setTableData] = useState<TableData>({
    rows: ["Row 1", "Row 2", "Row 3"],
    columns: ["Column 1", "Column 2", "Column 3"],
    cells: {},
  })

  const [newTaskText, setNewTaskText] = useState("")
  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null)

  // Navigate between checkpoints
  const goToNextCheckpoint = () => {
    if (currentCheckpoint < checkpoints.length - 1) {
      setCurrentCheckpoint(currentCheckpoint + 1)
    }
  }

  const goToPrevCheckpoint = () => {
    if (currentCheckpoint > 0) {
      setCurrentCheckpoint(currentCheckpoint - 1)
    }
  }

  // Task management
  const addTask = () => {
    if (newTaskText.trim() === "") return

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
    }

    setTasks([...tasks, newTask])
    setNewTaskText("")
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  // Task drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedTaskIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedTaskIndex === null || draggedTaskIndex === index) return

    const newTasks = [...tasks]
    const draggedTask = newTasks[draggedTaskIndex]

    // Remove the dragged task
    newTasks.splice(draggedTaskIndex, 1)
    // Insert it at the new position
    newTasks.splice(index, 0, draggedTask)

    setTasks(newTasks)
    setDraggedTaskIndex(index)
  }

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
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Workflow Management System</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="checkpoints">Workflow Checkpoints</TabsTrigger>
          <TabsTrigger value="tasks">Task List</TabsTrigger>
          <TabsTrigger value="table">Dynamic Table</TabsTrigger>
        </TabsList>

        {/* Workflow Checkpoints */}
        <TabsContent value="checkpoints" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <Button variant="outline" onClick={goToPrevCheckpoint} disabled={currentCheckpoint === 0}>
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
                <Button onClick={goToNextCheckpoint} disabled={currentCheckpoint === checkpoints.length - 1}>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="relative mb-8">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2" />
                <div className="flex justify-between relative">
                  {checkpoints.map((checkpoint, index) => (
                    <div
                      key={checkpoint.id}
                      className="flex flex-col items-center"
                      onClick={() => setCurrentCheckpoint(index)}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center z-10 cursor-pointer transition-colors",
                          index <= currentCheckpoint
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {index < currentCheckpoint ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                      </div>
                      <div className="mt-2 text-center">
                        <div
                          className={cn(
                            "font-medium text-sm",
                            index === currentCheckpoint ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {checkpoint.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">{checkpoints[currentCheckpoint].title}</h3>
                <p className="text-muted-foreground">{checkpoints[currentCheckpoint].description}</p>
                <div className="mt-4">
                  <Badge variant="outline">
                    Step {currentCheckpoint + 1} of {checkpoints.length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Task List */}
        <TabsContent value="tasks" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Draggable Task List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-6">
                <Input
                  placeholder="Add a new task..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTask()
                  }}
                />
                <Button onClick={addTask} size="icon">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-2">
                {tasks.map((task, index) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={() => setDraggedTaskIndex(null)}
                    className={cn(
                      "flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors",
                      draggedTaskIndex === index ? "opacity-50" : "",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="cursor-move">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                        className="h-4 w-4"
                      />
                      <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.text}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} aria-label="Delete task">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-muted-foreground">Drag and drop tasks to reorder them</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dynamic Table */}
        <TabsContent value="table" className="mt-0">
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
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeColumn(index)}
                              className="h-6 w-6 ml-1"
                            >
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
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeRow(rowIndex)}
                              className="h-6 w-6 ml-1"
                            >
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
