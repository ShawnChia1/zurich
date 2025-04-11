import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Checkpoint, Task, TableData } from "@/lib/types";
import TasksTab from "@/components/tabs/extensions-tab";
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
        {
          id: "task1",
          sn: "1",
          extensions: "Accidental Death Benefit Due to Natural Catastrophe",
          sumInsured: "15% of the capital sum insured or up to 75,000 or its equivalent, whichever is lower.",
        },
        {
          id: "task2",
          sn: "2",
          extensions: "Accidental Death Benefit Due to Gun Shot",
          sumInsured: "15% of the capital sum insured or up to 50,000 or its equivalent, whichever is lower.",
        },
        {
          id: "task3",
          sn: "3",
          extensions: "Assault, Hijack, Murder, Strike, Riot, Civil Commotion and Terrorism",
          sumInsured: "Covered",
        },
        {
          id: "task4",
          sn: "4",
          extensions: "Comatose State Benefit",
          sumInsured: "10% of the capital sum insured or up to 50,000 or its equivalent, whichever is lower.",
        },
        {
          id: "task5",
          sn: "5",
          extensions: "Credit Card Indemnity",
          sumInsured: "5,000",
        },
      ])

  const [tableData, setTableData] = useState<TableData>({
    rows: ["1", "2", "3"],
    columns: ["Item", "Event Name", "Venue", "Event Date", "Sum Insured Per Person (SGD)"],
    cells: {},
  });

  const handlePreviewClick = () => {
    localStorage.setItem('tableData', JSON.stringify(tableData));
    const newWindow = window.open('/doc-preview', '_blank');

    if (newWindow) {
      newWindow.focus();
    } else {
      alert('Please allow popups for this site.');
    }
  };

  // Dummy components for demonstration
  const ComponentA = () => <div>Component A Content</div>;
  const ComponentB = () => (
    <div>
      <TasksTab tasks={tasks} setTasks={setTasks} />
    </div>
  );
  const ComponentC = () => (
    <div>
        <TableTab tableData={tableData} setTableData={setTableData}/>
        <br />
        <Button style={{background: "#23366f"}} onClick={handlePreviewClick}>
          Preview
        </Button>
    </div>
  )

  // Component mapping
  const checkpointComponents = {
    0: ComponentA,
    1: ComponentA,
    2: ComponentA,
    3: ComponentA,
    4: ComponentB,
    5: ComponentC,
    // Add more mappings as needed
  };

  // Get the component for the current checkpoint
  const CurrentCheckpointComponent =
    checkpointComponents[
      currentCheckpoint as keyof typeof checkpointComponents
    ] || (() => <div>Component not found</div>);

  return (
    <Card>
      <CardContent>
        <div className="bg-muted/30 p-6 rounded-lg">
          {/* Render the component for the current checkpoint */}
          <CurrentCheckpointComponent />
        </div>
      </CardContent>
    </Card>
  );
}
