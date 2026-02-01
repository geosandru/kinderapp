import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import VisitCard from "./VisitCard.jsx";

export default function VisitsList() {
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
      .channel("visits-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "visits" },
        () => fetchVisits()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "visits" },
        () => fetchVisits()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      {visits.map(v => (
        <VisitCard key={v.id} visit={v} />
      ))}
    </div>
  );
}
