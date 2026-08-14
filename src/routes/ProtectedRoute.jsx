import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getMe } from "../services/authService";

export default function ProtectedRoute() {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await getMe();

        localStorage.setItem("user", JSON.stringify(response.data.user));

        setAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return (
      <div
        className="
        flex min-h-screen
        items-center justify-center
        bg-[#071614]
      "
      >
        <div className="flex items-center gap-3">
          <div
            className="
            h-5 w-5
            animate-spin
            rounded-full
            border-2
            border-[#21483E]
            border-t-[#A9DDCC]"
          />

          <span className="text-sm text-[#A8C2B9]">
            Checking authentication...
          </span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
