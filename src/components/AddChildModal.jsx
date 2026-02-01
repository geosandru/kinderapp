import { useState } from "react";
import { supabase } from "../api/supabase";
import { useToast } from "../context/ToastContext.jsx";
import "./addchild.css";

export default function AddChildModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    parent: "",
    age: "",
    phone: ""
  });

  const { showToast } = useToast();

  async function saveChild() {
    const { error } = await supabase.from("children").insert(form);

    if (!error) {
      showToast("Copil adăugat cu succes");
      onClose();
    } else {
      showToast("Eroare la salvare", "error");
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Adaugă copil</h2>

        <input
          placeholder="Nume copil"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Părinte"
          value={form.parent}
          onChange={e => setForm({ ...form, parent: e.target.value })}
        />

        <input
          placeholder="Vârstă"
          value={form.age}
          onChange={e => setForm({ ...form, age: e.target.value })}
        />

        <input
          placeholder="Telefon"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>Renunță</button>
          <button className="btn-save" onClick={saveChild}>Salvează</button>
        </div>
      </div>
    </div>
  );
}
