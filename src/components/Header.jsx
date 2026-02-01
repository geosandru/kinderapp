import dayjs from "dayjs";
import { MdCalendarToday } from "react-icons/md";
import "./header.css";

export default function Header() {
  const today = dayjs().format("DD MMMM YYYY");

  return (
    <header className="header">
      <h1>KINDERAPP TIME MANAGEMENT</h1>
      <div className="header-date">
        <MdCalendarToday size={22} />
        <span>{today}</span>
      </div>
    </header>
  );
}
