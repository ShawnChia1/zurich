import React, { useState, useEffect, useRef } from "react";
import { TableData } from "@/lib/types";
import "@/app/globals.css";
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DocPreviewPage: React.FC = () => {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const tableDataString = localStorage.getItem("tableData");
      console.log(tableDataString);
      if (tableDataString) {
        try {
          setTableData(JSON.parse(tableDataString));
          localStorage.removeItem("tableData");
        } catch (error) {
          console.error("Error parsing tableData:", error);
        }
      }
    }
  }, [isClient]);

  const handleDownloadPdf = () => {
    if (docRef.current) {
      html2canvas(docRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const padding = 10; // Padding in mm
        const contentWidth = imgWidth - 2 * padding;
        const contentHeight = (canvas.height * contentWidth) / canvas.width;
        let heightLeft = contentHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', padding, position + padding, contentWidth, contentHeight);
        heightLeft -= pageHeight - 2 * padding;

        while (heightLeft > 0) {
          position = heightLeft - contentHeight + padding;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', padding, position, contentWidth, contentHeight);
          heightLeft -= pageHeight - 2 * padding;
        }

        pdf.save('document.pdf');
      });
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (!tableData) {
    return <div>No table data provided.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">SCHEDULE</h1>
      </div>

      <div ref={docRef}>
        {/* Policy Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="font-semibold">Policy Class:</div>
          <div className="md:col-span-2">GROUP PERSONAL ACCIDENT</div>

          <div className="font-semibold">Policy No.:</div>
          <div className="md:col-span-2">ZXXXXXXXXXN</div>

          <div className="font-semibold">The Insured:</div>
          <div className="md:col-span-2">XXX CEXXXE LIMITED</div>

          <div className="font-semibold">Postal Address:</div>
          <div className="md:col-span-2">
            1 RAFFLES PLACE
            <br />
            #00-00 XXX CENTRE
            <br />
            SINGAPORE 000000
          </div>

          <div className="font-semibold">
            Business / Occupation
            <br />
            (And No Other For The Purpose
            <br />
            Of This Insurance):
          </div>
          <div className="md:col-span-2">FAST APPLICATION SERVICE</div>

          <div className="font-semibold">
            Period Of Insurance
            <br />
            (DD/MM/YYYY):
          </div>
          <div className="md:col-span-2">
            FROM 01/01/2024 TO 31/12/2024 (BOTH DATES INCLUSIVE)
          </div>

          <div className="font-semibold">Interest Insured:</div>
          <div className="md:col-span-2">
            AS PER DETAILS IN CONTINUATION SCHEDULE AND / OR POLICY
          </div>

          <div className="font-semibold">
            Total Sum Insured
            <br />
            Limit Of Liability
            <br />
            Estimated Total Earnings /<br />
            Total Contract Sum:
          </div>
          <div className="md:col-span-2">
            AS PER DETAILS IN CONTINUATION SCHEDULE AND / OR POLICY
          </div>

          <div className="font-semibold">Annual Premium:</div>
          <div className="md:col-span-2">SGD 64500.00</div>

          <div className="font-semibold">Premium:</div>
          <div className="md:col-span-2">SGD 6045.00</div>

          <div className="font-semibold">Add GST 9%:</div>
          <div className="md:col-span-2">SGD 5800.05</div>

          <div className="font-semibold">Total Payable:</div>
          <div className="md:col-span-2">SGD 700003.05</div>

          <div className="font-semibold">Source:</div>
          <div className="md:col-span-2">
            BROKERNAME XXX (SINGAPORE) PTE LTD
          </div>
        </div>

        {/* Signature */}
        <div className="border-t pt-4 mb-8">
          <div className="font-semibold mb-2">SIGNED FOR THE INSURERS</div>
          <div className="mb-2">
            ZURICH INSURANCE
            <br />
            COMPANY LTD
            <br />
            (SINGAPORE BRANCH)
          </div>
          <div className="font-semibold">AUTHORIZED SIGNATURE</div>
        </div>

        {/* Page 2 - Cover Details */}
        <div className="border-t pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="font-semibold">COVER:</div>
            <div className="md:col-span-2">
              AGAINST DEATH OR BODILY INJURY ARISING OUT OF AN ACCIDENT
            </div>

            <div className="font-semibold">OPERATIVE TIME:</div>
            <div className="md:col-span-2">24 HOURS</div>

            <div className="font-semibold">LAW & JURISDICTION:</div>
            <div className="md:col-span-2">SINGAPORE / COURTS OF SINGAPORE</div>
          </div>

          {/* Table of Benefits */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              TABLE OF BENEFITS / SUM INSURED PER INSURED PERSON
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">S/N</th>
                    <th className="border border-gray-300 px-4 py-2">
                      BENEFITS
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      BENEFIT (SGD) - UP TO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">1</td>
                    <td className="border border-gray-300 px-4 py-2">
                      ACCIDENTAL DEATH PERMANENT DISABLEMENT
                      <br />
                      (ENHANCED 150% SCALE & INCLUDING 2ND & 3RD DEGREE BURNS)
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      A - 5120,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-2">RPA STRING</div>
          </div>
        </div>

        {/* Page 3 - Insured Person */}
        <div className="border-t pt-8 mb-8">
          <h2 className="text-xl font-bold mb-4">INSURED PERSON</h2>
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">CATEGORY</th>
                  <th className="border border-gray-300 px-4 py-2">
                    BENEFIT LEVEL
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    NUMBER OF LIVES
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    TOTAL SUM INSURED (SGD)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    GENERAL MANAGERS
                  </td>
                  <td className="border border-gray-300 px-4 py-2">A</td>
                  <td className="border border-gray-300 px-4 py-2">1</td>
                  <td className="border border-gray-300 px-4 py-2">100,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Rate Table */}
          <h2 className="text-xl font-bold mb-4">RATE TABLE</h2>
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">
                    ANNUAL PREMIUM RATE (SGD)
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    PREMIUM RATE BASIS
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">0.00</td>
                  <td className="border border-gray-300 px-4 py-2">
                    PER SGD 0,000 SUM INSURED
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Additional Policy Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="font-semibold">
              MINIMUM ANNUAL (DEPOSIT) PREMIUM:
            </div>
            <div className="md:col-span-2">SGD 050</div>

            <div className="font-semibold">OCCURRENCE LIMIT:</div>
            <div className="md:col-span-2">SGD 3100,000</div>

            <div className="font-semibold">CONVEYANCE LIMIT:</div>
            <div className="md:col-span-2">SGD 100,000</div>

            <div className="font-semibold">AGGREGATE TERRORISM LIMIT:</div>
            <div className="md:col-span-2">SGD 0,00,000</div>

            <div className="font-semibold">GEOGRAPHICAL LIMIT:</div>
            <div className="md:col-span-2">WORLDWIDE</div>

            <div className="font-semibold">LISTING DETAILS:</div>
            <div className="md:col-span-2">NOT APPLICABLE</div>

            <div className="font-semibold">POLICY ADMINISTRATION:</div>
            <div className="md:col-span-2">ON HEADCOUNT BASIS</div>
          </div>
        </div>

        {/* Page 4 - Extensions */}
        <div className="border-t pt-8">
          <h2 className="text-xl font-bold mb-4">EXTENSIONS</h2>
          <p className="mb-4">
            IT IS HEREBY DECLARED AND AGREED THAT THE FOLLOWING EXTENSIONS ARE
            APPLICABLE TO THIS POLICY AND NOT OTHERWISE STATED. THE EXTENSIONS
            ARE APPLICABLE TO EACH INSURED PERSON ONCE PER INJURY. IF THE SAME
            EXTENSIONS ARE PROVIDED UNDER MORE THAN ONE POLICY, THE HIGHER LIMIT
            FOR EACH EXTENSION SHALL APPLY.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">S/N</th>
                  <th className="border border-gray-300 px-4 py-2">
                    EXTENSIONS
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    SUM INSURED (SGD) – UP TO
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">1</td>
                  <td className="border border-gray-300 px-4 py-2">
                    ACCIDENTAL DEATH BENEFIT DUE TO NATURAL CATASTROPHE
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    00% OF THE CAPITAL SUM INSURED OR 00,000 OR ITS EQUIVALENT,
                    WHICHEVER IS LOWER.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-4">ADDITIONAL EXTENSION:</h3>
          </div>

          {/* Dynamic Table from props */}
          {tableData && (
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    {tableData.columns.map((column) => (
                      <th
                        key={column}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row) => (
                    <tr key={row}>
                      {tableData.columns.map((column) => {
                        const cellKey = `${row}-${column}`;
                        const cellValue = tableData.cells[cellKey] || "";
                        return (
                          <td
                            key={column}
                            className="border border-gray-300 px-4 py-2"
                          >
                            {cellValue}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Button style={{ background: "#23366f" }} onClick={handleDownloadPdf}>
        Download PDF
      </Button>
    </div>
  );
};

export default DocPreviewPage;
