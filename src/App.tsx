import { Route, Routes } from "react-router-dom";
import { makeServer } from "../server";
import "./App.css";
import { Match } from "./components/Match";
import { Scorer } from "./components/Scorer";
import { Viewer } from "./components/Viewer";

makeServer();

function App() {
  return (
    <Routes>
      <Route path="/" element={<Match />} />
      <Route path="/scorer" element={<Scorer />} />
      <Route path="/match/:id" element={<Viewer />} />
    </Routes>
  );
}

export default App;
