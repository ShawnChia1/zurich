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
    const ColumnOrder = "N/A";

    extensions.push({ Item, EventName, Venue, EventDate, SumInsuredPerPerson, ColumnOrder });
  });

  return extensions;
}

export default function CheckpointsTab({
  checkpoints,
  currentCheckpoint,
  setCurrentCheckpoint,
}: CheckpointsTabProps) {
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [tableData, setTableData] = useState<TableData>({
    rows: [],
    columns: [],
    cells: {},
  });

  useEffect(()=>{
    console.log("tabledata: " + JSON.stringify(tableData.cells));
  },[tableData]);

  useEffect(() => {
    console.log("colOrder: " + columnOrder);
  },[columnOrder]);

  useEffect(() => {
    (async function fetchSampleData() {
      try {
        const response = await fetch('/api/sample', {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log(response.status);
        // console.log('Parsed JSON Data:', data);
        setTasks(data);
      } catch (err) {
        console.error('Error:', err);
      }
    })();
  }, []);

  useEffect(() => {
    (async function getAllExtensions() {
      try {
        const response = await fetch('/api/extensions', {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        const rows:string[] = [];
        let cells:Record<string, string> = {};
        for (let row = 0; row < data.length; row++) {
          rows.push(`${row}`);
          Object.entries(data[row]).forEach(([key, value]) => {
            if (key != 'ColumnOrder') {
              cells[`${row}-${key.replace(/([A-Z])/g, ' $1').trim()}`] = value as string;
            }
          });
        }
        setColumnOrder(data[0].ColumnOrder.split(","));
        setTableData({
          rows: rows,
          columns: data[0].ColumnOrder.split(","),
          cells: cells
        });
        
      } catch (err) {
        console.error('Error:', err);
      }
    })();
  }, []);

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
      
      <TableTab tableData={tableData} setTableData={setTableData} columnOrder={columnOrder} setColumnOrder={setColumnOrder} />
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
