import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#071614] text-[#E8F3EF]">

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Header */}
      <Header
        sidebarCollapsed={sidebarCollapsed}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <main
        className={`
          min-h-screen
          pt-[76px]
          ml-0
          transition-all
          duration-300

          ${
            sidebarCollapsed
              ? "md:ml-[76px]"
              : "md:ml-[250px]"
          }
        `}
      >
        <div className="
          min-h-[calc(100vh-76px)]
          p-4
          sm:p-6
          lg:p-8
        ">
          <Outlet />
        </div>
      </main>

    </div>
  );
}