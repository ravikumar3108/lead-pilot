import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  Clock3,
  CircleCheck,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import { getMe } from "../services/authService";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getMe();

      const currentUser = response.data.user;

      setUser(currentUser);

      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[#6F9186]">
          <Loader2 size={20} className="animate-spin text-[#A9DDCC]" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <p className="text-sm text-[#6F9186]">Unable to load profile.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-[#3F8E78]">
          Account
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-[#E8F3EF] sm:text-3xl">
          Profile
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6F9186]">
          View your account information and account activity.
        </p>
      </div>

      {/* Profile Card */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-[#21483E] bg-[#10251F]">
        <div className="relative bg-[#275C4D] px-5 py-8 sm:px-8 sm:py-10">
          {/* Decorative Circle */}
          <div className="absolute -right-16 -top-24 h-48 w-48 rounded-full bg-[#A9DDCC]/10 blur-2xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#A9DDCC]/30 bg-[#A9DDCC] text-2xl font-bold text-[#071614] shadow-lg sm:h-24 sm:w-24 sm:text-3xl">
              {getInitials()}
            </div>

            {/* User Details */}
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-[#E8F3EF] sm:text-2xl">
                {user.name}
              </h2>

              <p className="mt-1 flex items-center gap-2 break-all text-sm text-[#A9DDCC]">
                <Mail size={15} />
                {user.email}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {/* Role */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A9DDCC]/20 bg-[#071614]/20 px-3 py-1 text-xs font-medium capitalize text-[#C5DAD3]">
                  <ShieldCheck size={13} />
                  {user.role}
                </span>

                {/* Status */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A9DDCC]/20 bg-[#071614]/20 px-3 py-1 text-xs font-medium text-[#C5DAD3]">
                  <CircleCheck size={13} />
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <section className="rounded-2xl border border-[#21483E] bg-[#10251F]">
          <div className="border-b border-[#21483E] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#275C4D] text-[#A9DDCC]">
                <User size={17} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#E8F3EF]">
                  Personal Information
                </h3>

                <p className="mt-0.5 text-xs text-[#6F9186]">
                  Your basic account information
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <InfoItem
                label="Full Name"
                value={user.name}
                icon={<User size={16} />}
              />

              <InfoItem
                label="Email Address"
                value={user.email}
                icon={<Mail size={16} />}
              />

              <InfoItem
                label="Role"
                value={user.role}
                icon={<ShieldCheck size={16} />}
                capitalize
              />

              <InfoItem
                label="Account Status"
                value={user.isActive ? "Active" : "Inactive"}
                icon={<CircleCheck size={16} />}
              />
            </div>
          </div>
        </section>

        {/* Account Details */}
        <section className="rounded-2xl border border-[#21483E] bg-[#10251F]">
          <div className="border-b border-[#21483E] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#275C4D] text-[#A9DDCC]">
                <CalendarDays size={17} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#E8F3EF]">
                  Account Details
                </h3>

                <p className="mt-0.5 text-xs text-[#6F9186]">
                  Account creation and activity
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="space-y-5">
              <InfoItem
                label="Account Created"
                value={formatDate(user.createdAt)}
                icon={<CalendarDays size={16} />}
              />

              <InfoItem
                label="Last Updated"
                value={formatDateTime(user.updatedAt)}
                icon={<Clock3 size={16} />}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* Info Item */

function InfoItem({ label, value, icon, capitalize = false }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-xs font-medium text-[#6F9186]">
        <span className="text-[#3F8E78]">{icon}</span>

        {label}
      </p>

      <p
        className={`break-words text-sm font-medium text-[#D5E5DF] ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}
