"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Checkpoint } from "@/lib/types"

interface CheckpointsTabProps {
  checkpoints: Checkpoint[]
  currentCheckpoint: number
  setCurrentCheckpoint: (index: number) => void
}

export default function CheckpointsTab({ checkpoints, currentCheckpoint, setCurrentCheckpoint }: CheckpointsTabProps) {
  // Navigate between checkpoints
  const goToNextCheckpoint = () => {
    if (currentCheckpoint < checkpoints.length - 1) {
      setCurrentCheckpoint(currentCheckpoint + 1)
    }
  }

  const goToPrevCheckpoint = () => {
    if (currentCheckpoint > 0) {
      setCurrentCheckpoint(currentCheckpoint - 1)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={goToPrevCheckpoint} disabled={currentCheckpoint === 0}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <Button onClick={goToNextCheckpoint} disabled={currentCheckpoint === checkpoints.length - 1}>
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
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {index < currentCheckpoint ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "font-medium text-sm",
                      index === currentCheckpoint ? "text-primary" : "text-muted-foreground",
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
          <h3 className="text-xl font-medium mb-2">{checkpoints[currentCheckpoint].title}</h3>
          <p className="text-muted-foreground">{checkpoints[currentCheckpoint].description}</p>
          <div className="mt-4">
            <Badge variant="outline">
              Step {currentCheckpoint + 1} of {checkpoints.length}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

