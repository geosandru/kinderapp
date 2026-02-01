import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { supabase } from "../api/supabase";
import "./searchbar.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [children, setChildren] = useState([]);

  useEffect(() => {
    if (!query) {
      setChildren([]);
      return;
    }

    const fetchChildren = async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .ilike("name", `%${query}%`);

      if (!error) setChildren(data || []);
    };

    fetchChildren();
  }, [query]);

  async function startVisit(child) {
  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  const { error } = await supabase.from("visits").insert({
    child_id: child.id,
    start_time: now,
    end_time: null,
    minutes: 0,
    price: 0,
    date: today   // 🔥 OBLIGATORIU
  });

  if (error) {
    alert(error.message);
    return;
  }

  setQuery("");
  setChildren([]);
}



  return (
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <FaSearch />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Caută copil..."
        />
      </div>

      {children.length > 0 && (
        <div className="search-results">
          {children.map(c => (
            <div
              key={c.id}
              className="search-item"
              onClick={() => startVisit(c)}
            >
              {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
