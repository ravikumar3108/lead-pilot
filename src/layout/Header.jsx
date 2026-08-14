import { useEffect, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser } from "../services/authService";

export default function Header({ sidebarCollapsed = false, setMobileOpen }) {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    setProfileOpen(false);
    toast.success("Logged out successfully");
    navigate("/login", {
      replace: true,
    });
  };

  const handleProfile = () => {
    setProfileOpen(false);
    navigate("/profile");
  };

  const getInitials = () => {
    if (!user?.name) return "U";

    return user.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header
      className={`
        fixed
        left-0
        right-0
        top-0
        z-40
        h-[76px]
        border-b
        border-[#21483E]
        bg-[#071614]/95
        backdrop-blur-xl
        transition-all
        duration-300

        ${sidebarCollapsed ? "md:left-[76px]" : "md:left-[250px]"}
      `}
    >
      <div
        className="
        flex h-full
        items-center
        justify-between
        gap-3
        px-4
        sm:px-6
        lg:px-8
      "
      >
        {/* =====================================
            LEFT SECTION
        ====================================== */}

        <div
          className="
          flex min-w-0
          items-center
          gap-3
        "
        >
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMobileOpen?.(true)}
            className="
              flex h-10 w-10
              shrink-0
              items-center justify-center
              rounded-xl
              border border-[#21483E]
              bg-[#10251F]
              text-[#A8C2B9]
              transition
              hover:border-[#3F8E78]
              hover:bg-[#275C4D]/40
              hover:text-[#E8F3EF]
              md:hidden
            "
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Page Area */}
          <div className="hidden sm:block">
            <p
              className="
              text-[11px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-[#3F8E78]
            "
            >
              Workspace
            </p>

            <h1
              className="
              text-base
              font-semibold
              text-[#E8F3EF]
              lg:text-lg
            "
            >
              Dashboard
            </h1>
          </div>
        </div>

        {/* =====================================
            CENTER SEARCH
        ====================================== */}

        <div
          className="
          hidden
          flex-1
          justify-center
          px-4
          md:flex
        "
        >
          <div
            className="
            relative
            w-full
            max-w-md
          "
          >
            <Search
              size={18}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-[#6F9186]
              "
            />

            <input
              type="text"
              placeholder="Search leads, contacts..."
              className="
                h-10
                w-full
                rounded-xl
                border
                border-[#21483E]
                bg-[#10251F]
                pl-10
                pr-4
                text-sm
                text-[#E8F3EF]
                outline-none
                placeholder:text-[#506F65]
                transition
                focus:border-[#3F8E78]
                focus:bg-[#10251F]
              "
            />

            <div
              className="
              absolute
              right-3
              top-1/2
              hidden
              -translate-y-1/2
              rounded-md
              border
              border-[#21483E]
              bg-[#071614]
              px-1.5
              py-0.5
              text-[10px]
              text-[#6F9186]
              lg:block
            "
            >
              ⌘ K
            </div>
          </div>
        </div>

        {/* =====================================
            RIGHT SECTION
        ====================================== */}

        <div
          className="
          flex
          shrink-0
          items-center
          gap-2
          sm:gap-3
        "
        >
          {/* Mobile Search */}
          <button
            type="button"
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              text-[#6F9186]
              transition
              hover:bg-[#275C4D]/30
              hover:text-[#A9DDCC]
              md:hidden
            "
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="
                relative
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                border
                border-transparent
                text-[#6F9186]
                transition
                hover:border-[#21483E]
                hover:bg-[#275C4D]/30
                hover:text-[#A9DDCC]
              "
              aria-label="Notifications"
            >
              <Bell size={19} />

              {/* Notification Dot */}
              <span
                className="
                absolute
                right-2.5
                top-2
                h-1.5
                w-1.5
                rounded-full
                bg-[#A9DDCC]
              "
              />
            </button>

            {/* Notification Dropdown */}
            {notificationOpen && (
              <div
                className="
                absolute
                right-0
                top-full
                z-50
                mt-2
                w-[300px]
                overflow-hidden
                rounded-2xl
                border
                border-[#21483E]
                bg-[#10251F]
                shadow-2xl
              "
              >
                <div
                  className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#21483E]
                  px-4
                  py-3
                "
                >
                  <h3
                    className="
                    text-sm
                    font-semibold
                    text-[#E8F3EF]
                  "
                  >
                    Notifications
                  </h3>

                  <button
                    type="button"
                    className="
                      text-xs
                      font-medium
                      text-[#A9DDCC]
                      hover:text-white
                    "
                  >
                    Mark all read
                  </button>
                </div>

                <div
                  className="
                  px-4
                  py-8
                  text-center
                "
                >
                  <Bell
                    size={24}
                    className="
                      mx-auto
                      mb-2
                      text-[#3F8E78]
                    "
                  />

                  <p
                    className="
                    text-sm
                    text-[#A8C2B9]
                  "
                  >
                    No new notifications
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div
            className="
            hidden
            h-8
            w-px
            bg-[#21483E]
            sm:block
          "
          />

          {/* =================================
              PROFILE
          ================================== */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                p-1.5
                transition
                hover:bg-[#275C4D]/30
                sm:gap-3
                sm:pr-2
              "
              aria-label="Open profile menu"
            >
              {/* Avatar */}
              <div
                className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#3F8E78]
                text-xs
                font-bold
                text-[#071614]
                ring-2
                ring-[#21483E]
              "
              >
                {getInitials()}
              </div>

              {/* User Info */}
              <div
                className="
                hidden
                min-w-0
                text-left
                lg:block
              "
              >
                <p
                  className="
                  max-w-[130px]
                  truncate
                  text-sm
                  font-medium
                  text-[#E8F3EF]
                "
                >
                  {user?.name || "User"}
                </p>

                <p
                  className="
                  text-[11px]
                  capitalize
                  text-[#6F9186]
                "
                >
                  {user?.role || "Agent"}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`
                  hidden
                  text-[#6F9186]
                  transition
                  lg:block
                  ${profileOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div
                className="
                absolute
                right-0
                top-full
                z-50
                mt-2
                w-60
                overflow-hidden
                rounded-2xl
                border
                border-[#21483E]
                bg-[#10251F]
                shadow-2xl
              "
              >
                {/* User Info */}
                <div
                  className="
                  border-b
                  border-[#21483E]
                  px-4
                  py-4
                "
                >
                  <div
                    className="
                    flex
                    items-center
                    gap-3
                  "
                  >
                    <div
                      className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#3F8E78]
                      text-xs
                      font-bold
                      text-[#071614]
                    "
                    >
                      {getInitials()}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                        truncate
                        text-sm
                        font-semibold
                        text-[#E8F3EF]
                      "
                      >
                        {user?.name || "User"}
                      </p>

                      <p
                        className="
                        truncate
                        text-xs
                        text-[#6F9186]
                      "
                      >
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile */}
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleProfile}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      text-[#C5DAD3]
                      transition
                      hover:bg-[#275C4D]/40
                      hover:text-[#E8F3EF]
                    "
                  >
                    <User size={17} />

                    <span>Profile</span>
                  </button>
                </div>

                {/* Logout */}
                <div
                  className="
                  border-t
                  border-[#21483E]
                  p-2
                "
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      text-red-300
                      transition
                      hover:bg-red-500/10
                      hover:text-red-200
                    "
                  >
                    <LogOut size={17} />

                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
