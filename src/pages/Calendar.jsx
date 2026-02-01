import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import "./calendar.css";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ date: "", child_name: "", notes: "" });

  async function fetchEvents() {
    const { data } = await supabase.from("events").select("*").order("date");
    setEvents(data || []);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  async function addEvent() {
    if (!form.date || !form.child_name) return alert("Completează data și numele copilului.");
    await supabase.from("events").insert(form);
    setForm({ date: "", child_name: "", notes: "" });
    fetchEvents();
  }

  return (
    <div className="calendar-page">
      <h2>Calendar evenimente</h2>

      <div className="calendar-form">
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <input placeholder="Nume copil" value={form.child_name} onChange={e => setForm({ ...form, child_name: e.target.value })} />
        <input placeholder="Notițe" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
        <button onClick={addEvent}>Salvează</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Copil</th>
            <th>Notițe</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e.id}>
              <td>{e.date}</td>
              <td>{e.child_name}</td>
              <td>{e.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
