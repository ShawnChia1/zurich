"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CheckpointsTab from "./tabs/checkpoints-tab"
import TasksTab from "./tabs/tasks-tab"
import TableTab from "./tabs/table-tab"
import type { Checkpoint, Task, TableData } from "@/lib/types"

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
          <CheckpointsTab
            checkpoints={checkpoints}
            currentCheckpoint={currentCheckpoint}
            setCurrentCheckpoint={setCurrentCheckpoint}
          />
        </TabsContent>

        {/* Task List */}
        <TabsContent value="tasks" className="mt-0">
          <TasksTab tasks={tasks} setTasks={setTasks} />
        </TabsContent>

        {/* Dynamic Table */}
        <TabsContent value="table" className="mt-0">
          <TableTab tableData={tableData} setTableData={setTableData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}


