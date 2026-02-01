import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { FaTrash, FaEdit, FaFileExcel, FaTimes, FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import EditChildModal from "./EditChildModal.jsx";
import "./childrensidebar.css";

export default function ChildrenSidebar({ onClose }) {
  const [children, setChildren] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingChild, setEditingChild] = useState(null);
  const [query, setQuery] = useState("");

  async function fetchChildren() {
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .order("name");

    if (!error) {
      setChildren(data || []);
      setFiltered(data || []);
    }
  }

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (!query) {
      setFiltered(children);
      return;
    }

    const q = query.toLowerCase();

    const result = children.filter(c =>
      (c.name || "").toLowerCase().includes(q) ||
      (c.parent || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q)
    );

    setFiltered(result);
  }, [query, children]);

  async function deleteChild(id) {
    if (!confirm("Sigur vrei să ștergi copilul?")) return;
    await supabase.from("children").delete().eq("id", id);
    fetchChildren();
  }

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Copii");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "lista_copii.xlsx");
  }

  return (
    <div className="sidebar-overlay">
      <div className="sidebar">

        {/* HEADER */}
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

        {/* SEARCH */}
        <div className="sidebar-search">
          <FaSearch />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Caută copil, părinte sau telefon..."
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Nume</th>
              <th>Părinte</th>
              <th>Vârstă</th>
              <th>Telefon</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.parent}</td>
                <td>{c.age}</td>
                <td>{c.phone}</td>
                <td>
                  <button
                    className="icon-btn"
                    onClick={() => setEditingChild(c)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="icon-btn"
                    onClick={() => deleteChild(c.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
