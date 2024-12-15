import { Heading } from "@chakra-ui/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Stopwatch from "./components/Stopwatch";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div className="app">
      <Heading>Invisalign Tracker</Heading>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Stopwatch />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
