import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Nav from "./components/Nav";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ScheduleView from "./pages/ScheduleView";
import Roster from "./pages/Roster";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Nav />

        <div className="content-area">
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route
                path="/green"
                element={<ScheduleView team="green" />}
              />

              <Route
                path="/white"
                element={<ScheduleView team="white" />}
              />

              <Route path="/roster" element={<Roster />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
