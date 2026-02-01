import { FaUserPlus, FaList, FaMoneyBill, FaLock, FaCalendarAlt, FaHome, FaChartBar } from "react-icons/fa";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import AddChildModal from "./AddChildModal.jsx";
import ChildrenSidebar from "./ChildrenSidebar.jsx";
import { useState } from "react";
import "./actionbar.css";

export default function ActionBar() {
  const [showAdd, setShowAdd] = useState(false);
  const [showList, setShowList] = useState(false);

  return (
    <>
      <div className="action-wrapper">
        <div className="action-row">
          <div className="buttons">

            <Link to="/" className="nav-link">
              <button className="nav-btn">
                <FaHome /> Dashboard
              </button>
            </Link>

            <button className="nav-btn" onClick={() => setShowAdd(true)}>
              <FaUserPlus /> Adaugă copil
            </button>

            <button className="nav-btn" onClick={() => setShowList(true)}>
              <FaList /> Lista copii
            </button>

            <Link to="/history" className="nav-link">
              <button className="nav-btn">
                <FaMoneyBill /> Istoric încasări
              </button>
            </Link>

            <Link to="/calendar" className="nav-link">
              <button className="nav-btn">
                <FaCalendarAlt /> Calendar
              </button>
            </Link>
          </div>

          <SearchBar />
        </div>
      </div>

      {showAdd && <AddChildModal onClose={() => setShowAdd(false)} />}
      {showList && <ChildrenSidebar onClose={() => setShowList(false)} />}
    </>
  );
}
