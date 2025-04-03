"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CheckpointsTab from "@/components/tabs/checkpoints-tab";
import TasksTab from "@/components/tabs/tasks-tab";
import TableTab from "@/components/tabs/table-tab";
import NamesAndTextBoxes from "@/components/tabs/names-textbox";
import type { Checkpoint, Task, TableData } from "@/lib/types";

export default function WorkflowManagement() {
  const [activeTab, setActiveTab] = useState("extensions");
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);

  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([
    { id: "1", title: "Insured Details", description: "Define project scope and requirements", },
    { id: "2", title: "Basis of Cover", description: "Create mockups and wireframes" },
    { id: "3", title: "Benefits", description: "Implement the core functionality", },
    { id: "4", title: "Financials", description: "Ensure quality and fix bugs" },
    { id: "5", title: "Extensions", description: "Release to production" },
    { id: "6", title: "Additional Clauses", description: "Release to production" },
    { id: "7", title: "Quote Subjectivities", description: "Release to production" },
    { id: "8", title: "SIS Input", description: "Release to production" },
  ]);

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Workflow Management System
      </h1>
      <NamesAndTextBoxes />
      <br />

      {/* Workflow Checkpoints */}
      <CheckpointsTab
        checkpoints={checkpoints}
        currentCheckpoint={currentCheckpoint}
        setCurrentCheckpoint={setCurrentCheckpoint}
      />
    </div>
  );
}
