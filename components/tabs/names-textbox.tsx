import React from "react";

interface TextDisplayProps {
  label: string;
  value: string;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ label, value }) => {
  return (
    <div
      className="text-display"
      style={{
        display: "flex",
        alignItems: "center",
        margin: "10px",
        flex: 1, // Make each TextDisplay take equal space
      }}
    >
      <label style={{ color: "#2b3e74", fontSize: "0.8rem" }}>{label}:</label>
      <div
        style={{
          backgroundColor: "white",
          padding: "12px",
          borderRadius: "6px",
          minWidth: "0", // Allow rectangles to shrink
          width: "100%", // Make the rectangle fill its flex container
          textAlign: "left",
          wordWrap: "break-word",
          border: "2px solid lightgray",
        }}
      >
        {value}
      </div>
    </div>
  );
};

const NamesAndTextBoxes: React.FC = () => {
  const [accountName, setAccountName] = React.useState("");
  const [newRenew, setNewRenew] = React.useState("");
  const [sisPolicy, setSisPolicy] = React.useState("");
  const [zhLobId, setZhLobId] = React.useState("");
  const [gppVersion, setGppVersion] = React.useState("");
  const [gppTransaction, setGppTransaction] = React.useState("");

  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexWrap: "wrap",
        backgroundColor: "transparent",
      }}
    >
      <div style={{ display: "flex", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 3 }}>
          <TextDisplay label="Account Name" value={accountName} />
        </div>
        <TextDisplay label="New/Renew" value={newRenew} />
      </div>

      <div style={{ display: "flex", width: "100%" }}>
        <TextDisplay label="SIS Policy" value={sisPolicy} />
        <TextDisplay label="ZH Technical LoB ID" value={zhLobId} />
        <TextDisplay label="GPP Version" value={gppVersion} />
        <TextDisplay label="GPP Transaction #" value={gppTransaction} />
      </div>
    </div>
  );
};

export default NamesAndTextBoxes;
