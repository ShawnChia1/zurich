"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, GripVertical, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"

interface TasksTabProps {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export default function TasksTab({ tasks, setTasks }: TasksTabProps) {
  const [searchText, setSearchText] = useState("")
  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    sn: "",
    extensions: "",
    sumInsured: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [matchedTaskIds, setMatchedTaskIds] = useState<Set<string>>(new Set())
  const matchRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Search functionality
  useEffect(() => {
    if (searchText.trim() === "") {
      setMatchedTaskIds(new Set())
      return
    }

    const searchLower = searchText.toLowerCase()
    const matches = new Set<string>()

    tasks.forEach((task) => {
      const snMatch = task.sn?.toLowerCase().includes(searchLower)
      const extensionsMatch = task.extensions?.toLowerCase().includes(searchLower)
      const sumInsuredMatch = task.sumInsured?.toLowerCase().includes(searchLower)

      if (snMatch || extensionsMatch || sumInsuredMatch) {
        matches.add(task.id)
      }
    })

    setMatchedTaskIds(matches)

    // Scroll to first match
    if (matches.size > 0) {
      const firstMatchId = Array.from(matches)[0]
      const element = matchRefs.current.get(firstMatchId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [searchText, tasks])

  // Task management
  const addTask = () => {

    const taskToAdd: Task = {
      id: Date.now().toString(),
      sn: newTask.sn || "",
      extensions: newTask.extensions || "",
      sumInsured: newTask.sumInsured || "",
    }

    setTasks([...tasks, taskToAdd])
    setNewTask({
      sn: "",
      extensions: "",
      sumInsured: "",
    })
    setIsDialogOpen(false)
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  // Task drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedTaskIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedTaskIndex === null || draggedTaskIndex === dropIndex) return

    const newTasks = [...tasks]
    const draggedTask = newTasks[draggedTaskIndex]

    // Remove the dragged task
    newTasks.splice(draggedTaskIndex, 1)
    // Insert it at the drop position
    newTasks.splice(dropIndex, 0, draggedTask)

    setTasks(newTasks)
    setDraggedTaskIndex(null)
  }

  // Highlight matching text
  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm.trim() || !text) return text

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  return (
    <Card style={{color:'#203469'}}>
      <CardHeader>
        <CardTitle>Table of Extensions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search extensions..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Extension</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-sn">SN</Label>
                  <Input
                    id="task-sn"
                    value={newTask.sn || ""}
                    onChange={(e) => setNewTask({ ...newTask, sn: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="task-extensions">Extensions</Label>
                  <textarea
                    id="task-extensions"
                    value={newTask.extensions || ""}
                    onChange={(e) => setNewTask({ ...newTask, extensions: e.target.value })}
                    className="w-full border rounded p-2 resize-vertical"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="task-sum-insured">Sum Insured</Label>
                  <textarea
                    id="task-sum-insured"
                    value={newTask.sumInsured || ""}
                    onChange={(e) => setNewTask({ ...newTask, sumInsured: e.target.value })}
                    className="w-full border rounded p-2 resize-vertical"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addTask}>Add Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-4 mb-2 pl-10 font-medium text-sm">
          <div className="col-span-1">SN</div>
          <div className="col-span-6">Extensions</div>
          <div className="col-span-5">Sum Insured</div>
        </div>

        <div className="space-y-2">
          {tasks.map((task, index) => {
            const isMatch = matchedTaskIds.has(task.id)

            return (
              <div
                key={task.id}
                ref={(el) => {
                  if (el && isMatch) {
                    matchRefs.current.set(task.id, el)
                  } else if (!isMatch) {
                    matchRefs.current.delete(task.id)
                  }
                }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => setDraggedTaskIndex(null)}
                className={cn(
                  "flex items-start justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors",
                  draggedTaskIndex === index ? "opacity-50" : "",
                  isMatch && searchText ? "ring-2 ring-yellow-400 dark:ring-yellow-600" : "",
                )}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="cursor-move mt-1">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-4">
                    <div className="col-span-1 break-words">
                      {searchText ? highlightMatch(task.sn || "", searchText) : task.sn}
                    </div>

                    <div className="col-span-6 break-words" style={{ marginLeft: '0px' }}>
                      {searchText ? highlightMatch(task.extensions || "", searchText) : task.extensions}
                    </div>

                    <div className="col-span-5 break-words" style={{ marginLeft: '30px' }}>
                      {searchText ? highlightMatch(task.sumInsured || "", searchText) : task.sumInsured}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete task"
                  className="mt-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {searchText && matchedTaskIds.size > 0
            ? `Found ${matchedTaskIds.size} matching tasks`
            : searchText && matchedTaskIds.size === 0
              ? "No matching tasks found"
              : "Drag and drop tasks to reorder them"}
        </div>
      </CardContent>
    </Card>
  )
}





