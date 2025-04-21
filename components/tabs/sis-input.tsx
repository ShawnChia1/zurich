import React from "react";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import type { TableData } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface SisInputProps {
  tableData: TableData;
}

const SisInput: React.FC<SisInputProps> = ({ tableData }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState<string>('To: someEmail@zurich.com.sg');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textAreaValue, setTextAreaValue] = useState(`Hi there

A new SIS booking has been sent from Somebody in Workbench.

INSUREDNAME: 
AXXS HXXXE LTD.

PRODUCT: 
GROUP PERSONAL ACCIDENT

Please review this in Workbench: https://apps.powerapps.com

This is an automated email. Please do not reply to this email.`);

  useEffect(() => {
    if (textAreaRef.current) {
      adjustTextAreaHeight(textAreaRef.current);
    }
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

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextAreaValue(event.target.value);
    adjustTextAreaHeight(event.target);
  };

  const adjustTextAreaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments([...attachments, ...Array.from(event.target.files)]);
    }
  };

  const handleAddAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-end space-x-4">
        <button
          className="bg-[#dad2bd] text-[#23366f] py-2 px-4 rounded"
          onClick={handlePreviewClick}
        >
          Preview
        </button>
        <button className="bg-[#dad2bd] text-[#23366f] py-2 px-4 rounded">
          Confirm Manual Booking
        </button>
        <button className="bg-[#dad2bd] text-[#23366f] py-2 px-4 rounded">
          Send Email
        </button>
      </div>
      <input className="p-2 border rounded w-full" type="text" value={inputValue}
      onChange={handleInputChange} />
      <textarea
        ref={textAreaRef}
        value={textAreaValue}
        onChange={handleTextAreaChange}
        className="p-2 border rounded w-full resize-none"
        style={{ overflow: "hidden" }}
      />
      <div>
        <button
            className="bg-[#dad2bd] text-[#23366f] py-2 px-4 rounded"
            onClick={handleAddAttachmentClick}
          >
            Add Attachment
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
        <div>
          {attachments.map((file, index) => (
            <div key={index} className="mt-2">
              {file.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SisInput;
