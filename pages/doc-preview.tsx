import React, { useState, useEffect } from 'react';
import { TableData } from '@/lib/types';

const DocPreviewPage: React.FC = () => {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const tableDataString = localStorage.getItem('tableData');
      console.log(tableDataString);
      if (tableDataString) {
        try {
          setTableData(JSON.parse(tableDataString));
          localStorage.removeItem('tableData');
        } catch (error) {
          console.error('Error parsing tableData:', error);
        }
      }
    }
  }, [isClient]);

  if (!isClient) {
    return <div>Loading...</div>; // Or any placeholder
  }

  if (!tableData) {
    return <div>No table data provided.</div>;
  }

  const { columns, rows, cells } = tableData;

  return (
    <div>
      <h1>Table Preview</h1>
      <table border={1}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              {columns.map((column) => {
                const cellKey = `${row}-${column}`;
                const cellValue = cells[cellKey] || '';
                console.log("Row: " + row + " column: " + column);
                return <td key={column}>{cellValue}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocPreviewPage;