import { useState } from "react";
import { supabase } from "../api/supabase";
import "./editchild.css";

export default function EditChildModal({ child, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: child.name || "",
    parent: child.parent || "",
    age: child.age || "",
    phone: child.phone || "",
    notes: child.notes || ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveChanges() {
    const { error } = await supabase
      .from("children")
      .update({
        name: form.name,
        parent: form.parent,
        age: form.age,
        phone: form.phone,
        notes: form.notes
      })
      .eq("id", child.id);

    if (error) {
      alert(error.message);
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Editează copil</h3>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nume copil"
        />

        <input
          name="parent"
          value={form.parent}
          onChange={handleChange}
          placeholder="Nume părinte"
        />

        <input
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Vârstă"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Telefon"
        />

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Note"
        />

        <div className="modal-actions">
          <button onClick={saveChanges}>Salvează</button>
          <button onClick={onClose}>Anulează</button>
        </div>
      </div>
    </div>
  );
}
