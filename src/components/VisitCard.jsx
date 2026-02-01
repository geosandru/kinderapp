import { useEffect, useState, useRef } from "react";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import dayjs from "dayjs";
import { supabase } from "../api/supabase";
import { calculatePrice } from "../api/price";
import { useSound } from "../context/SoundContext.jsx";
import "./visitcard.css";

export default function VisitCard({ visit }) {
  const [minutes, setMinutes] = useState(0);
  const [isPaused, setIsPaused] = useState(!!visit.paused_at);
  const alarmPlayed = useRef(false);
  const { play } = useSound();

  useEffect(() => {
    if (!visit.start_time) return;
    if (visit.end_time) return;
    if (isPaused) return;

    const interval = setInterval(() => {
      const start = dayjs(visit.start_time);
      const now = dayjs();
      const diff = now.diff(start, "minute");
      setMinutes(diff);

      if (diff >= 90 && !alarmPlayed.current) {
        play("error");
        alarmPlayed.current = true;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [visit.start_time, visit.end_time, isPaused, play]);

  const price = calculatePrice(minutes);
  const progress = Math.min((minutes / 480) * 100, 100);

  async function pauseVisit() {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("visits")
      .update({ paused_at: now })
      .eq("id", visit.id);

    if (error) {
      console.error("PAUSE ERROR:", error);
      alert(error.message);
      return;
    }

    setIsPaused(true);
  }

  async function resumeVisit() {
    const pausedAt = dayjs(visit.paused_at);
    const now = dayjs();
    const pausedMinutes = now.diff(pausedAt, "minute");
    const newStart = dayjs(visit.start_time).add(pausedMinutes, "minute");

    const { error } = await supabase
      .from("visits")
      .update({
        start_time: newStart.toISOString(),
        paused_at: null
      })
      .eq("id", visit.id);

    if (error) {
      console.error("RESUME ERROR:", error);
      alert(error.message);
      return;
    }

    setIsPaused(false);
    play("start");
  }

  async function stopVisit() {
  const now = new Date().toISOString();
  const finalMinutes = minutes;
  const finalPrice = calculatePrice(finalMinutes);

  const { error } = await supabase
    .from("visits")
    .update({
      end_time: now,
      minutes: finalMinutes,
      price: finalPrice
      // ❌ NU mai scrii "date" aici
    })
    .eq("id", visit.id);

  if (error) {
    alert(error.message);
  }
}




  return (
    <div className="visit-card">
      <h3>{visit.children?.name}</h3>

      <p>{minutes} minute</p>
      <p>{price} lei</p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="visit-buttons">
        {!isPaused ? (
          <button onClick={pauseVisit}>
            <FaPause /> Pauză
          </button>
        ) : (
          <button onClick={resumeVisit}>
            <FaPlay /> Continuă
          </button>
        )}

        <button onClick={stopVisit}>
          <FaStop /> Stop
        </button>
      </div>
    </div>
  );
}
