import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Stopwatch from "./components/Stopwatch";
import { PocketProvider } from "./lib/PocketContext";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";

function App() {
  return (
    <div className="app">
      <PocketProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Stopwatch />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </PocketProvider>
    </div>
  );
}

export default App;
