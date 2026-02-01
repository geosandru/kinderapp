import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import "./footer.css";

export default function Footer() {
  const [activeVisits, setActiveVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);

  const today = new Date().toISOString().slice(0, 10);

  async function fetchStats() {
    // vizite active
    const { count: activeCount } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .is("end_time", null);

    // vizite terminate azi
    const { data: todayData } = await supabase
      .from("visits")
      .select("price")
      .eq("date", today)
      .not("end_time", "is", null);

    const total = (todayData || []).reduce(
      (sum, v) => sum + (v.price || 0),
      0
    );

    setActiveVisits(activeCount || 0);
    setTodayVisits(todayData?.length || 0);
    setTodayTotal(total || 0);
  }

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel("footer-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "visits" },
        fetchStats
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="footer">
      <div>Vizite active: {activeVisits}</div>
      <div>Vizite azi: {todayVisits}</div>
      <div>Total azi: {todayTotal} lei</div>
    </div>
  );
}
