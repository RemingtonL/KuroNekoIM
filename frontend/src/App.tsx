import "./App.css";
import "@arco-design/web-react/dist/css/arco.css";
import Login from "./pages/login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register/Register.tsx";
import Chat from "./pages/chat/Chat.tsx";
import { Navigate } from "react-router-dom";
import { useLoginStatus } from "./store/loginStatus.ts";

//must login before chat
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLogin = useLoginStatus((s) => s.loginInfo.isLogin);

  if (!isLogin) {
    return <Navigate to="/login" replace />
  }

  return children;
}
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
