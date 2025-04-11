import React from "react";
import type { TableData } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface SisInputProps {
  tableData: TableData;
}

const SisInput: React.FC<SisInputProps> = ({ tableData }) => {
  const handlePreviewClick = () => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
    const newWindow = window.open("/doc-preview", "_blank");

    if (newWindow) {
      newWindow.focus();
    } else {
      alert("Please allow popups for this site.");
    }
  };
  return (
    <div className="flex justify-end space-x-4">
      <Button style={{ background: "#dad2bd", color: "#23366f"}} onClick={handlePreviewClick}>
        Preview
      </Button>
      <Button style={{ background: "#dad2bd", color: "#23366f" }}>Confirm Manual Booking</Button>
      <Button style={{ background: "#dad2bd", color: "#23366f" }}>Send Email</Button>
    </div>
  );
};

export default SisInput;
