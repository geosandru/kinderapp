import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaFileExcel, FaTrash } from "react-icons/fa";
import "./history.css";

export default function History() {
  const [rows, setRows] = useState([]);
  
const today = new Date().toLocaleDateString("en-CA");

  async function fetchHistory() {
    const { data } = await supabase
      .from("visits")
      .select("date, minutes, price, children(name)")
      .not("end_time", "is", null)
      .order("date", { ascending: false });

    setRows(data || []);
  }

  useEffect(() => {
    fetchHistory();

    const channel = supabase
      .channel("history-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "visits" },
        fetchHistory
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function resetToday() {
  if (!confirm("Sigur vrei să ștergi toate vizitele de azi?")) return;

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const { error } = await supabase
    .from("visits")
    .delete()
    .gte("date", start.toISOString())
    .lte("date", end.toISOString());

  if (error) {
    alert(error.message);
    return;
  }

  alert("Ziua a fost resetată.");
}


  function exportExcel() {
    const data = rows.map(r => ({
      Data: r.date,
      Copil: r.children?.name,
      Minute: r.minutes,
      Suma: r.price
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Istoric");

    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([buf]), "istoric_plati.xlsx");
  }

  return (
    <div>
      <div className="history-actions">
        <button className="history-btn history-reset" onClick={resetToday}>
          <FaTrash />
          Reset zi
        </button>

        <button className="history-btn history-export" onClick={exportExcel}>
          <FaFileExcel />
          Export Excel
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Nume copil</th>
            <th>Minute</th>
            <th>Sumă</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td>{r.children?.name}</td>
              <td>{r.minutes}</td>
              <td>{r.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
