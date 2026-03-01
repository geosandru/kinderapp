import { useEffect, useState, useMemo } from "react";
import { supabase } from "../api/supabase";
import SessionTypeModal from "./SessionTypeModal";
import {
  FaTrash,
  FaEdit,
  FaFileExcel,
  FaTimes,
  FaSearch,
  FaPlay,
  FaStop
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import EditChildModal from "./EditChildModal.jsx";
import "./childrensidebar.css";

export default function ChildrenSidebar({ onClose }) {
  const [children, setChildren] = useState([]);
  const [visits, setVisits] = useState([]);
  const [editingChild, setEditingChild] = useState(null);
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(Date.now());
  const [selectedChild, setSelectedChild] = useState(null);

  /* ================= FETCH CHILDREN ================= */

  async function fetchChildren() {
    const { data } = await supabase
      .from("children")
      .select("*")
      .order("name");

    setChildren(data || []);
  }

  /* ================= FETCH ACTIVE VISITS ================= */

  async function fetchActiveVisits() {
    const { data } = await supabase
      .from("visits")
      .select("*")
      .is("end_time", null);

    setVisits(data || []);
  }

  /* ================= REALTIME ================= */

  useEffect(() => {
    fetchChildren();
    fetchActiveVisits();

    const channel = supabase
      .channel("visits-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "visits" },
        fetchActiveVisits
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  /* ================= CLOCK ================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ================= SEARCH ================= */

  const filtered = useMemo(() => {
    if (!query) return children;

    const q = query.toLowerCase();

    return children.filter(c =>
      (c.name || "").toLowerCase().includes(q) ||
      (c.parent || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q)
    );
  }, [query, children]);

  /* ================= VISIT ACTIONS ================= */

  async function startVisit(child, type) {
    const nowISO = new Date().toISOString();
    const today = nowISO.slice(0, 10);

    let price = 0;
    let maxMinutes = null;

    if (type === "double") {
      price = 100;
      maxMinutes = 180;
    }

    await supabase.from("visits").insert({
      child_id: child.id,
      start_time: nowISO,
      end_time: null,
      minutes: 0,
      price,
      date: today,
      session_type: type,
      max_minutes: maxMinutes
    });
  }

  async function stopVisit(visitId) {
    await supabase
      .from("visits")
      .update({ end_time: new Date().toISOString() })
      .eq("id", visitId);
  }

  /* ================= CRUD ================= */

  async function deleteChild(id) {
    if (!confirm("Sigur vrei să ștergi copilul?")) return;
    await supabase.from("children").delete().eq("id", id);
    fetchChildren();
  }

  /* ================= EXPORT ================= */

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Copii");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "lista_copii.xlsx");
  }

  /* ================= RENDER ================= */

  return (
    <div className="sidebar-overlay">
      <div className="sidebar">

        <div className="sidebar-header">
          <h2>Lista copii</h2>

          <div className="sidebar-actions">
            <button className="btn-export" onClick={exportExcel}>
              <FaFileExcel /> Export
            </button>

            <button className="btn-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="sidebar-search">
          <FaSearch />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Caută copil..."
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Nume</th>
              <th>Părinte</th>
              <th>Vârstă</th>
              <th>Telefon</th>
              <th>Timer</th>
              <th>Acțiuni</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(child => {
              const active = visits.find(v => v.child_id === child.id);

              let minutes = 0;
              let percent = 0;

              if (active) {
                const seconds = Math.floor(
                  (now - new Date(active.start_time)) / 1000
                );

                minutes = Math.floor(seconds / 60);

                if (active.max_minutes && minutes >= active.max_minutes) {
                  stopVisit(active.id);
                  minutes = active.max_minutes;
                }

                percent = active.max_minutes
                  ? Math.min((minutes / active.max_minutes) * 100, 100)
                  : Math.min((minutes / 180) * 100, 100);
              }

              return (
                <tr key={child.id}>
                  <td>{child.name}</td>
                  <td>{child.parent}</td>
                  <td>{child.age}</td>
                  <td>{child.phone}</td>

                  <td>
                    {active ? (
                      <div>
                        <div className="progress-wrapper">
                          <div
                            className="progress-bar"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span>{minutes} min</span>
                        <button
                          className="icon-btn"
                          onClick={() => stopVisit(active.id)}
                        >
                          <FaStop />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="icon-btn"
                        onClick={() => setSelectedChild(child)}
                      >
                        <FaPlay />
                      </button>
                    )}
                  </td>

                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => setEditingChild(child)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() => deleteChild(child.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {selectedChild && (
          <SessionTypeModal
            child={selectedChild}
            onSelect={(type) => {
              startVisit(selectedChild, type);
              setSelectedChild(null);
            }}
            onClose={() => setSelectedChild(null)}
          />
        )}

        {editingChild && (
          <EditChildModal
            child={editingChild}
            onClose={() => setEditingChild(null)}
            onSaved={fetchChildren}
          />
        )}

      </div>
    </div>
  );
}
