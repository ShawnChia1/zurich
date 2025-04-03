"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"

interface TasksTabProps {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export default function TasksTab({ tasks, setTasks }: TasksTabProps) {
  const [newTaskText, setNewTaskText] = useState("")
  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null)

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

  return (
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
  )
}

