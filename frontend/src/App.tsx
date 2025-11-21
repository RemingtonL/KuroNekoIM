import "./App.css";
import "@arco-design/web-react/dist/css/arco.css";
import Login from "./pages/login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register/Register.tsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    
  );
}

export default App;
