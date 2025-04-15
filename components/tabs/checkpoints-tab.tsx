import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Extension } from "@/lib/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Checkpoint, Task, TableData } from "@/lib/types";
import TasksTab from "@/components/tabs/extensions-tab";
import TableTab from "@/components/tabs/table-tab";
import SisInput from "@/components/tabs/sis-input";

interface CheckpointsTabProps {
  checkpoints: Checkpoint[];
  currentCheckpoint: number;
  setCurrentCheckpoint: (index: number) => void;
}

type ResponseData = {
  insertedIds?: number[];
  error?: string;
};

function convertTableDataToExtensions(tableData: TableData): Extension[] {
  // console.log(tableData);
  const extensions: Extension[] = [];
  tableData.rows.forEach((row) => {
    const Item = tableData.cells[`${row}-Item`] ?? "";
    const EventName = tableData.cells[`${row}-Event Name`] ?? "";
    const Venue = tableData.cells[`${row}-Venue`] ?? "";
    const EventDate = tableData.cells[`${row}-Event Date`] ?? "";
    const SumInsuredPerPerson =
      tableData.cells[`${row}-Sum Insured Per Person`] ?? "";

    extensions.push({ Item, EventName, Venue, EventDate, SumInsuredPerPerson });
  });

  return extensions;
}

export default function CheckpointsTab({
  checkpoints,
  currentCheckpoint,
  setCurrentCheckpoint,
}: CheckpointsTabProps) {
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task1",
      sn: "1",
      extensions: "Accidental Death Benefit Due to Natural Catastrophe",
      sumInsured:
        "15% of the capital sum insured or up to 75,000 or its equivalent, whichever is lower.",
    },
    {
      id: "task2",
      sn: "2",
      extensions: "Accidental Death Benefit Due to Gun Shot",
      sumInsured:
        "15% of the capital sum insured or up to 50,000 or its equivalent, whichever is lower.",
    },
    {
      id: "task3",
      sn: "3",
      extensions:
        "Assault, Hijack, Murder, Strike, Riot, Civil Commotion and Terrorism",
      sumInsured: "Covered",
    },
    {
      id: "task4",
      sn: "4",
      extensions: "Comatose State Benefit",
      sumInsured:
        "10% of the capital sum insured or up to 50,000 or its equivalent, whichever is lower.",
    },
    {
      id: "task5",
      sn: "5",
      extensions: "Credit Card Indemnity",
      sumInsured: "5,000",
    },
  ]);

  const [tableData, setTableData] = useState<TableData>({
    rows: ["1", "2", "3"],
    columns: [
      "Item",
      "Event Name",
      "Venue",
      "Event Date",
      "Sum Insured Per Person (SGD)",
    ],
    cells: {},
  });

  const handlePreviewClick = () => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
    const newWindow = window.open("/doc-preview", "_blank");

    if (newWindow) {
      newWindow.focus();
    } else {
      alert("Please allow popups for this site.");
    }
  };

  const handleSaveClick = async () => {
    const extensions: Extension[] = convertTableDataToExtensions(tableData);
    try {
      const res = await fetch("/api/extensions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(extensions),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
      if (res.status === 201) {
        toast.success("Your data has been saved");
      }
    } catch (error) {
      console.error("Error posting extensions:", error);
      if (error instanceof Error) {
        setResponse({ error: error.message });
      } else {
        setResponse({ error: "An unknown error occurred" });
      }
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
      
      <TableTab tableData={tableData} setTableData={setTableData} />
      <br />
      <div className="flex justify-between">
        <Button style={{ background: "#23366f" }} onClick={handlePreviewClick}>
          Preview
        </Button>
        <Button style={{ background: "#23366f" }} onClick={handleSaveClick}>
          Save
        </Button>
      </div>
      
    </div>
  );

  const ComponentD = () => (
    <div>
      <SisInput tableData={tableData} />
    </div>
  );

  // Component mapping
  const checkpointComponents = {
    0: ComponentA,
    1: ComponentA,
    2: ComponentA,
    3: ComponentA,
    4: ComponentB,
    5: ComponentC,
    7: ComponentD,
    // Add more mappings as needed
  };

  // Get the component for the current checkpoint
  const CurrentCheckpointComponent =
    checkpointComponents[
      currentCheckpoint as keyof typeof checkpointComponents
    ] || (() => <div>Component not found</div>);

  return (
    <Card>
      <ToastContainer />
      <CardContent>
        <div className="bg-muted/30 p-6 rounded-lg">
          {/* Render the component for the current checkpoint */}
          <CurrentCheckpointComponent />
        </div>
      </CardContent>
    </Card>
  );
}
