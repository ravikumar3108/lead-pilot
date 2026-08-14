import {
  LayoutDashboard,
  Users,
  CalendarClock,
  BarChart3,
  UserRound,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Leads",
    icon: Users,
    path: "/leads",
  },
  {
    label: "Follow-ups",
    icon: CalendarClock,
    path: "/follow-ups",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    label: "Team",
    icon: UserRound,
    path: "/team",
  },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-sm
            md:hidden
          "
        />
      )}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          flex-col
          border-r
          border-[#21483E]
          bg-[#275C4D]
          transition-all
          duration-300

          ${
            mobileOpen
              ? "w-[250px] translate-x-0"
              : "w-[250px] -translate-x-full"
          }

          md:translate-x-0

          ${collapsed ? "md:w-[76px]" : "md:w-[250px]"}
        `}
      >
        {/* =====================================
            LOGO
        ====================================== */}

        <div
          className={`
            flex
            h-[76px]
            shrink-0
            items-center
            justify-between
            border-b
            border-[#21483E]
            px-5

            ${collapsed ? "md:justify-center" : ""}
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#A9DDCC]
                text-[#071614]
              "
            >
              <Sparkles size={20} />
            </div>

            <div
              className={`
                ${collapsed ? "md:hidden" : "block"}
              `}
            >
              <h1 className="text-base font-semibold text-[#E8F3EF]">
                LeadPilot
              </h1>

              <p className="text-[11px] text-[#A9DDCC]">AI CRM</p>
            </div>
          </div>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="
              rounded-lg
              p-2
              text-[#A8C2B9]
              transition
              hover:bg-[#21483E]
              hover:text-[#E8F3EF]
              md:hidden
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* =====================================
            NAVIGATION
        ====================================== */}

        <nav className="scrollbar-hide flex-1 overflow-y-auto px-3 py-6">
          <p
            className={`
              mb-3
              px-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#6F9186]

              ${collapsed ? "md:hidden" : "block"}
            `}
          >
            Workspace
          </p>

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              /*
                Exact match for normal pages.
                This also keeps /leads active when
                we later add /leads/:id.
              */
              const active =
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    transition

                    ${
                      active
                        ? "bg-[#3F8E78] text-[#A9DDCC]"
                        : "text-[#A8C2B9] hover:bg-[#21483E]/70 hover:text-[#E8F3EF]"
                    }

                    ${collapsed ? "md:justify-center" : ""}
                  `}
                >
                  <Icon size={19} className="shrink-0" />

                  <span
                    className={`
                      ${collapsed ? "md:hidden" : "block"}
                    `}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* =====================================
              AI SECTION
          ====================================== */}

          <div className="mt-8">
            <p
              className={`
                mb-3
                px-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#6F9186]

                ${collapsed ? "md:hidden" : "block"}
              `}
            >
              AI
            </p>

            <button
              type="button"
              className={`
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-[#3F8E78]/60
                bg-[#071614]/20
                px-3
                py-2.5
                text-sm
                font-medium
                text-[#A9DDCC]

                ${collapsed ? "md:justify-center" : ""}
              `}
            >
              <Sparkles size={19} className="shrink-0" />

              <div
                className={`
                  text-left
                  ${collapsed ? "md:hidden" : "block"}
                `}
              >
                <p>AI Assistant</p>

                <p className="mt-0.5 text-[10px] text-[#6F9186]">
                  Ask anything
                </p>
              </div>
            </button>
          </div>
        </nav>

        {/* =====================================
            BOTTOM
        ====================================== */}

        <div className="shrink-0 border-t border-[#21483E] p-3">
          {/* Settings */}

          <Link
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-sm
              font-medium
              text-[#A8C2B9]
              transition
              hover:bg-[#21483E]/70
              hover:text-[#E8F3EF]

              ${collapsed ? "md:justify-center" : ""}
            `}
          >
            <Settings size={19} className="shrink-0" />

            <span
              className={`
                ${collapsed ? "md:hidden" : "block"}
              `}
            >
              Settings
            </span>
          </Link>

          {/* Desktop Collapse */}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="
              mt-2
              hidden
              w-full
              items-center
              justify-center
              rounded-xl
              py-2
              text-[#6F9186]
              transition
              hover:bg-[#21483E]/70
              hover:text-[#A9DDCC]
              md:flex
            "
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
