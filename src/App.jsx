import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./layout/AppLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";
import Profile from "./pages/Profile";
import Leads from "./pages/Leads";
import FollowUps from "./pages/FollowUps";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,

          style: {
            background: "#275C4D",
            color: "#E8F3EF",
            border: "1px solid #21483E",
          },

          success: {
            iconTheme: {
              primary: "#A9DDCC",
              secondary: "#071614",
            },
          },

          error: {
            iconTheme: {
              primary: "#F87171",
              secondary: "#071614",
            },
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="leads" element={<Leads />} />
            <Route path="/follow-ups" element={<FollowUps />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
