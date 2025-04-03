import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Checkpoint, Task, TableData } from "@/lib/types";
import TasksTab from "@/components/tabs/tasks-tab";
import TableTab from "@/components/tabs/table-tab";

interface CheckpointsTabProps {
  checkpoints: Checkpoint[];
  currentCheckpoint: number;
  setCurrentCheckpoint: (index: number) => void;
}

export default function CheckpointsTab({
  checkpoints,
  currentCheckpoint,
  setCurrentCheckpoint,
}: CheckpointsTabProps) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "task1", text: "Define project requirements", completed: true },
    { id: "task2", text: "Create wireframes", completed: false },
    { id: "task3", text: "Implement core features", completed: false },
    { id: "task4", text: "Write test cases", completed: false },
    { id: "task5", text: "Deploy to staging", completed: false },
  ]);

  const [tableData, setTableData] = useState<TableData>({
    rows: ["Row 1", "Row 2", "Row 3"],
    columns: ["Column 1", "Column 2", "Column 3"],
    cells: {},
  });

  // Dummy components for demonstration
  const ComponentA = () => <div>Component A Content</div>;
  const ComponentB = () => (
    <div>
      <TasksTab tasks={tasks} setTasks={setTasks} />
    </div>
  );
  const ComponentC = () => (
    <div>
        <TableTab tableData={tableData} setTableData={setTableData} />
    </div>
  )

  // Component mapping
  const checkpointComponents = {
    0: ComponentA,
    1: ComponentA,
    2: ComponentA,
    3: ComponentA,
    4: ComponentC,
    5: ComponentB,
    // Add more mappings as needed
  };

  // Get the component for the current checkpoint
  const CurrentCheckpointComponent =
    checkpointComponents[
      currentCheckpoint as keyof typeof checkpointComponents
    ] || (() => <div>Component not found</div>);

  // Navigate between checkpoints
  const goToNextCheckpoint = () => {
    if (currentCheckpoint < checkpoints.length - 1) {
      setCurrentCheckpoint(currentCheckpoint + 1);
    }
  };

  const goToPrevCheckpoint = () => {
    if (currentCheckpoint > 0) {
      setCurrentCheckpoint(currentCheckpoint - 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={goToPrevCheckpoint}
            disabled={currentCheckpoint === 0}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={goToNextCheckpoint}
            disabled={currentCheckpoint === checkpoints.length - 1}
          >
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
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index < currentCheckpoint ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "font-medium text-sm",
                      index === currentCheckpoint
                        ? "text-primary"
                        : "text-muted-foreground"
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
          <h3 className="text-xl font-medium mb-2">
            {checkpoints[currentCheckpoint].title}
          </h3>
          <p className="text-muted-foreground">
            {checkpoints[currentCheckpoint].description}
          </p>
          <div className="mt-4">
            <Badge variant="outline">
              Step {currentCheckpoint + 1} of {checkpoints.length}
            </Badge>
          </div>
          {/* Render the component for the current checkpoint */}
          <CurrentCheckpointComponent />
        </div>
      </CardContent>
    </Card>
  );
}
