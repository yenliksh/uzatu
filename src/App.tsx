import { Routes, Route } from "react-router-dom";
import Invitation from "./pages/Invitation";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Invitation />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
