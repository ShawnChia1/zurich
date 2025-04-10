"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CheckpointsTab from "@/components/tabs/checkpoints-tab";
import TasksTab from "@/components/tabs/extensions-tab";
import TableTab from "@/components/tabs/table-tab";
import NamesAndTextBoxes from "@/components/tabs/names-textbox";
import type { Checkpoint, Task, TableData } from "@/lib/types";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WorkflowManagement() {
  const [activeTab, setActiveTab] = useState("extensions");
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);

  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([
    { id: "1", title: "Insured Details" },
    { id: "2", title: "Basis of Cover" },
    { id: "3", title: "Benefits" },
    { id: "4", title: "Financials" },
    { id: "5", title: "Extensions" },
    { id: "6", title: "Additional Clauses" },
    { id: "7", title: "Quote Subjectivities" },
    { id: "8", title: "SIS Input" },
  ]);

  return (
    <div className="container mx-auto">
      <NamesAndTextBoxes />
      <br />
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
                  "w-6 h-6 rounded-full flex items-center justify-center z-10 cursor-pointer transition-colors"
                )}
                style={{ backgroundColor: "#1fb1e6" }}
              />
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    "font-medium text-sm",
                    index === currentCheckpoint
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  style={{
                    color: index === currentCheckpoint ? '#23366f' : undefined,
                  }}
                >
                  {checkpoint.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Checkpoints */}
      <CheckpointsTab
        checkpoints={checkpoints}
        currentCheckpoint={currentCheckpoint}
        setCurrentCheckpoint={setCurrentCheckpoint}
      />
    </div>
  );
}
