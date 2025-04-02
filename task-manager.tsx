"use client"

import { useState } from "react"
import { PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

type Task = {
  id: string
  text: string
  completed: boolean
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskText, setNewTaskText] = useState("")
  const [activeTab, setActiveTab] = useState("all")

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

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "active") return !task.completed
    if (activeTab === "completed") return task.completed
    return true
  })

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Task Manager</CardTitle>
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
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <TaskList tasks={filteredTasks} onToggle={toggleTaskCompletion} onDelete={deleteTask} />
          </TabsContent>
          <TabsContent value="active" className="mt-0">
            <TaskList tasks={filteredTasks} onToggle={toggleTaskCompletion} onDelete={deleteTask} />
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <TaskList tasks={filteredTasks} onToggle={toggleTaskCompletion} onDelete={deleteTask} />
          </TabsContent>
        </Tabs>

        <div className="text-sm text-muted-foreground mt-4 text-center">
          {tasks.filter((t) => !t.completed).length} tasks remaining
        </div>
      </CardContent>
    </Card>
  )
}

type TaskListProps = {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No tasks found</div>
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => onToggle(task.id)} />
            <label
              htmlFor={`task-${task.id}`}
              className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}
            >
              {task.text}
            </label>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} aria-label="Delete task">
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}
