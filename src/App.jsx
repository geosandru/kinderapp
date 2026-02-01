import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import ActionBar from "./components/ActionBar.jsx";
import VisitsBoard from "./components/VisitsBoard.jsx";
import Footer from "./components/Footer.jsx";
import History from "./pages/History.jsx";
import CalendarPage from "./pages/Calendar.jsx";
import "./styles/main.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <ActionBar />
        <Routes>
          <Route path="/" element={<VisitsBoard />} />
          <Route path="/history" element={<History />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
