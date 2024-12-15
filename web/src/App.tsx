import { Heading } from "@chakra-ui/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Stopwatch from "./components/Stopwatch";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";

function App() {
  return (
    <div className="app">
      <Heading>Invisalign Tracker</Heading>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Stopwatch />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
