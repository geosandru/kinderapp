import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import VisitCard from "./VisitCard.jsx";
import "./visitsboard.css";

export default function VisitsBoard() {
  const [visits, setVisits] = useState([]);

  async function fetchVisits() {
    const { data, error } = await supabase
      .from("visits")
      .select("*, children(name)")
      .is("end_time", null)
      .order("start_time", { ascending: true });

    if (!error) setVisits(data || []);
  }

  useEffect(() => {
    fetchVisits();

    const channel = supabase
      .channel("visits-board-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "visits" },
        () => {
          fetchVisits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="visits-board">
      <h2 className="visits-title">Vizite active</h2>

      <div className="visits-grid">
        {visits.map(v => (
          <VisitCard key={v.id} visit={v} />
        ))}
      </div>
    </div>
  );
}
