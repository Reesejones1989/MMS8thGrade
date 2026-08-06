import type { ReactElement } from "react";
//import "./Roster.css";

import players from "../data/roster";

const sortedPlayers = [...players].sort(
  (a, b) => (a.number ?? 999) - (b.number ?? 999)
);

export default function Roster(): ReactElement {
  const handlePrint = (): void => {
    window.print();
  };

  const handleDownload = (): void => {
    const txtRows = sortedPlayers
      .map(
        (player) =>
          `${player.number !== null ? `#${player.number} ` : ""}${player.first} ${player.last}`
      )
      .join("\n");

    const txtContent =
      "Mason 8th Grade Roster\n\n" + txtRows;

    const blob = new Blob([txtContent], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "mason_roster.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="roster">
      <h1>Mason 8th Grade Roster</h1>

      <button
        className="print-btn"
        onClick={handlePrint}
      >
        🖨️ Print Roster
      </button>

      <button
        className="download-btn"
        onClick={handleDownload}
      >
        💾 Download Roster
      </button>

      <ul>
        {sortedPlayers.map((player, index) => (
          <li key={index}>
            {player.number !== null && (
              <span className="number">
                #{player.number}
              </span>
            )}

            {" "}
            {player.first} {player.last}
          </li>
        ))}
      </ul>
    </div>
  );
}