import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { getAllLeads } from "../services/leadService";
import { getAllFollowUps } from "../services/followUpService";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  Plus,
  TrendingUp,
  Users,
  UserPlus,
  PhoneCall,
  Target,
} from "lucide-react";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [followUps, setFollowUps] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [leadsResponse, followUpsResponse] = await Promise.all([
        getAllLeads({
          page: 1,
          limit: 100,
        }),
        getAllFollowUps({
          page: 1,
          limit: 10,
        }),
      ]);

      const leadsData = leadsResponse?.data?.leads || leadsResponse?.data || [];

      const followUpsData = followUpsResponse?.data?.followUps || [];

      setLeads(Array.isArray(leadsData) ? leadsData : []);

      setFollowUps(Array.isArray(followUpsData) ? followUpsData : []);
    } catch (error) {
      console.error("Dashboard Error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalLeads = leads.length;

  const newLeads = leads.filter((lead) => lead.status === "New").length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "Converted",
  ).length;

  const statusCounts = {
    New: leads.filter((lead) => lead.status === "New").length,

    Contacted: leads.filter((lead) => lead.status === "Contacted").length,

    Qualified: leads.filter((lead) => lead.status === "Qualified").length,

    Proposal: leads.filter((lead) => lead.status === "Proposal").length,

    Converted: leads.filter((lead) => lead.status === "Converted").length,
  };

  function formatDate(date) {
    if (!date) return "-";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "-";
    }

    return value.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  function formatTime(date) {
    if (!date) return "-";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "-";
    }

    return value.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const conversionRate =
    totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0.0";

  const maxStatusCount = Math.max(
    statusCounts.New,
    statusCounts.Contacted,
    statusCounts.Qualified,
    statusCounts.Proposal,
    statusCounts.Converted,
    1,
  );

  const getBarHeight = (count) => {
    return `${Math.max((count / maxStatusCount) * 100, 8)}%`;
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-[#3F8E78]">
            Overview
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-[#E8F3EF] sm:text-3xl">
            Good morning, Ravi
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6F9186]">
            Here's what's happening with your leads today.
          </p>
        </div>

        <button
          type="button"
          className="
            inline-flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#3F8E78]
            px-4
            py-2.5
            text-sm
            font-semibold
            text-[#071614]
            shadow-lg
            shadow-[#3F8E78]/10
            transition
            hover:bg-[#A9DDCC]
            sm:w-auto
          "
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      {/* =========================================
          STATS
      ========================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          change="Live"
          description="total leads"
          icon={<Users size={20} />}
          trend="neutral"
        />

        <StatCard
          title="New Leads"
          value={newLeads}
          change="Live"
          description="current"
          icon={<UserPlus size={20} />}
          trend="up"
        />

        <StatCard
          title="Follow-ups"
          value={followUps.length}
          change="Today"
          description="scheduled"
          icon={<PhoneCall size={20} />}
          trend="neutral"
        />

        <StatCard
          title="Converted"
          value={convertedLeads}
          change="Live"
          description="converted"
          icon={<Target size={20} />}
          trend="up"
        />
      </div>

      {/* =========================================
          MAIN GRID
      ========================================== */}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* =====================================
            LEAD OVERVIEW
        ====================================== */}

        <section className="overflow-hidden rounded-2xl border border-[#21483E] bg-[#10251F] xl:col-span-2">
          <div className="flex items-center justify-between border-b border-[#21483E] px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold text-[#E8F3EF] sm:text-base">
                Lead Overview
              </h2>

              <p className="mt-1 text-xs text-[#6F9186]">
                Lead distribution by current status
              </p>
            </div>

            <button
              type="button"
              className="
                rounded-lg
                p-2
                text-[#6F9186]
                transition
                hover:bg-[#275C4D]/40
                hover:text-[#A9DDCC]
              "
            >
              <MoreHorizontal size={19} />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            {/* Chart Area */}

            <div className="flex h-52 items-end gap-2 sm:h-64 sm:gap-4">
              <ChartBar
                label="New"
                value={statusCounts.New}
                height={getBarHeight(statusCounts.New)}
              />

              <ChartBar
                label="Contacted"
                value={statusCounts.Contacted}
                height={getBarHeight(statusCounts.Contacted)}
              />

              <ChartBar
                label="Qualified"
                value={statusCounts.Qualified}
                height={getBarHeight(statusCounts.Qualified)}
              />

              <ChartBar
                label="Proposal"
                value={statusCounts.Proposal}
                height={getBarHeight(statusCounts.Proposal)}
              />

              <ChartBar
                label="Converted"
                value={statusCounts.Converted}
                height={getBarHeight(statusCounts.Converted)}
              />
            </div>

            {/* Legend */}

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#21483E] pt-5 sm:grid-cols-5">
              <LegendItem label="New" value={statusCounts.New} />

              <LegendItem label="Contacted" value={statusCounts.Contacted} />

              <LegendItem label="Qualified" value={statusCounts.Qualified} />

              <LegendItem label="Proposal" value={statusCounts.Proposal} />

              <LegendItem label="Converted" value={statusCounts.Converted} />
            </div>
          </div>
        </section>

        {/* =====================================
            CONVERSION
        ====================================== */}

        <section className="rounded-2xl border border-[#21483E] bg-[#10251F]">
          <div className="border-b border-[#21483E] px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-[#E8F3EF] sm:text-base">
              Conversion Rate
            </h2>

            <p className="mt-1 text-xs text-[#6F9186]">
              Overall lead performance
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-center py-4">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[14px] border-[#21483E]">
                <div
                  className="
                  absolute
                  inset-[-14px]
                  rounded-full
                  border-[14px]
                  border-transparent
                  border-t-[#A9DDCC]
                  border-r-[#3F8E78]
                  rotate-[-35deg]
                "
                />

                <div className="text-center">
                  <p className="text-3xl font-bold text-[#E8F3EF]">
                    {conversionRate}%
                  </p>
                  <p className="mt-1 text-xs text-[#6F9186]">Conversion</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <span className="text-xs text-[#6F9186]">Conversion</span>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================
          BOTTOM GRID
      ========================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* =====================================
            RECENT LEADS
        ====================================== */}

        <section className="overflow-hidden rounded-2xl border border-[#21483E] bg-[#10251F] xl:col-span-2">
          <div className="flex items-center justify-between border-b border-[#21483E] px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold text-[#E8F3EF] sm:text-base">
                Recent Leads
              </h2>

              <p className="mt-1 text-xs text-[#6F9186]">
                Latest leads added to your pipeline
              </p>
            </div>

            <button
              type="button"
              className="
                text-xs
                font-medium
                text-[#A9DDCC]
                transition
                hover:text-white
              "
            >
              View all
            </button>
          </div>

          {/* Desktop Table */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#21483E] text-left">
                  <th className="px-6 py-3 text-xs font-medium text-[#6F9186]">
                    Lead
                  </th>

                  <th className="px-6 py-3 text-xs font-medium text-[#6F9186]">
                    Source
                  </th>

                  <th className="px-6 py-3 text-xs font-medium text-[#6F9186]">
                    Status
                  </th>

                  <th className="px-6 py-3 text-xs font-medium text-[#6F9186]">
                    Added
                  </th>
                </tr>
              </thead>

              <tbody>
                {leads.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-[#6F9186]"
                    >
                      No leads found.
                    </td>
                  </tr>
                )}
                {leads.slice(0, 4).map((lead) => (
                  <LeadRow
                    key={lead._id}
                    name={lead.name}
                    email={lead.email}
                    source={lead.source || "Manual"}
                    status={lead.status}
                    date={formatDate(lead.createdAt)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}

          <div className="divide-y divide-[#21483E] md:hidden">
            {leads.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-sm text-[#6F9186]"
                >
                  No leads found.
                </td>
              </tr>
            )}

            {leads.slice(0, 4).map((lead) => (
              <MobileLead
                key={lead._id}
                name={lead.name}
                email={lead.email}
                source={lead.source || "Manual"}
                status={lead.status}
                date={formatDate(lead.createdAt)}
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#21483E] bg-[#10251F]">
          <div className="flex items-center justify-between border-b border-[#21483E] px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold text-[#E8F3EF] sm:text-base">
                Upcoming Follow-ups
              </h2>

              <p className="mt-1 text-xs text-[#6F9186]">
                Your scheduled activities
              </p>
            </div>

            <CalendarDays size={18} className="text-[#3F8E78]" />
          </div>

          <div className="divide-y divide-[#21483E]">
            {followUps.length === 0 && !loading && (
              <div className="px-5 py-10 text-center sm:px-6">
                <p className="text-sm text-[#6F9186]">
                  No upcoming follow-ups.
                </p>
              </div>
            )}

            {followUps
              .filter((item) => item.status === "Pending")
              .slice(0, 4)
              .map((item) => (
                <FollowUp
                  key={item._id}
                  name={item.lead?.name || "Unknown Lead"}
                  time={formatTime(item.scheduledAt)}
                  type={item.title}
                />
              ))}
          </div>

          <div className="border-t border-[#21483E] p-4">
            <button
              type="button"
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#21483E]
                bg-[#071614]
                px-4
                py-2.5
                text-xs
                font-medium
                text-[#A9DDCC]
                transition
                hover:border-[#3F8E78]
                hover:bg-[#275C4D]/30
              "
            >
              View all follow-ups
              <ArrowUpRight size={14} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({ title, value, change, description, icon, trend }) {
  return (
    <div
      className="
      group
      rounded-2xl
      border
      border-[#21483E]
      bg-[#10251F]
      p-5
      transition
      hover:border-[#3F8E78]
      sm:p-6
    "
    >
      <div className="flex items-start justify-between">
        <div
          className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-[#275C4D]
          text-[#A9DDCC]
        "
        >
          {icon}
        </div>

        <span
          className="
          rounded-lg
          bg-[#071614]
          px-2
          py-1
          text-[10px]
          font-medium
          text-[#6F9186]
        "
        >
          {description}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs text-[#6F9186]">{title}</p>

        <div className="mt-1 flex items-end justify-between gap-3">
          <p
            className="
            text-2xl
            font-bold
            tracking-tight
            text-[#E8F3EF]
            sm:text-3xl
          "
          >
            {value}
          </p>

          <span
            className={`
              mb-1
              inline-flex
              items-center
              gap-1
              text-xs
              font-medium
              ${trend === "up" ? "text-[#A9DDCC]" : "text-[#6F9186]"}
            `}
          >
            {trend === "up" && <TrendingUp size={13} />}

            {change}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   CHART BAR
========================================= */

function ChartBar({ label, value, height }) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-end gap-2">
      <span className="text-[10px] text-[#6F9186] sm:text-xs">{value}</span>

      <div
        className="
          w-full
          max-w-[56px]
          rounded-t-lg
          bg-[#3F8E78]
          transition
          hover:bg-[#A9DDCC]
        "
        style={{
          height,
        }}
      />

      <span
        className="
        max-w-full
        truncate
        text-[9px]
        text-[#6F9186]
        sm:text-[11px]
      "
      >
        {label}
      </span>
    </div>
  );
}

/* =========================================
   LEGEND
========================================= */

function LegendItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] text-[#6F9186]">{label}</p>

      <p className="mt-1 text-sm font-semibold text-[#D5E5DF]">{value}</p>
    </div>
  );
}

/* =========================================
   DESKTOP LEAD ROW
========================================= */

function LeadRow({ name, email, source, status, date }) {
  return (
    <tr
      className="
      border-b
      border-[#21483E]
      last:border-0
      transition
      hover:bg-[#275C4D]/10
    "
    >
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-medium text-[#D5E5DF]">{name}</p>

          <p className="mt-0.5 text-xs text-[#6F9186]">{email}</p>
        </div>
      </td>

      <td className="px-6 py-4 text-xs text-[#A8C2B9]">{source}</td>

      <td className="px-6 py-4">
        <StatusBadge status={status} />
      </td>

      <td className="px-6 py-4 text-xs text-[#6F9186]">{date}</td>
    </tr>
  );
}

/* =========================================
   MOBILE LEAD
========================================= */

function MobileLead({ name, email, source, status, date }) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#D5E5DF]">{name}</p>

          <p className="mt-1 truncate text-xs text-[#6F9186]">{email}</p>
        </div>

        <StatusBadge status={status} />
      </div>

      <div
        className="
        mt-3
        flex
        items-center
        justify-between
        text-xs
      "
      >
        <span className="text-[#6F9186]">{source}</span>

        <span className="text-[#6F9186]">{date}</span>
      </div>
    </div>
  );
}

/* =========================================
   STATUS BADGE
========================================= */

function StatusBadge({ status }) {
  const styles = {
    New: "bg-[#3F8E78]/10 text-[#A9DDCC]",
    Contacted: "bg-[#275C4D]/30 text-[#A8C2B9]",
    Qualified: "bg-[#A9DDCC]/10 text-[#A9DDCC]",
    Proposal: "bg-[#3F8E78]/20 text-[#A9DDCC]",
    Converted: "bg-[#A9DDCC]/20 text-[#E8F3EF]",
  };

  return (
    <span
      className={`
        inline-flex
        whitespace-nowrap
        rounded-full
        px-2.5
        py-1
        text-[10px]
        font-medium
        ${styles[status] || "bg-[#21483E] text-[#A8C2B9]"}
      `}
    >
      {status}
    </span>
  );
}

/* =========================================
   FOLLOW UP
========================================= */

function FollowUp({ name, time, type }) {
  return (
    <div
      className="
      flex
      items-center
      gap-3
      px-5
      py-4
      sm:px-6
    "
    >
      <div
        className="
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-lg
        bg-[#275C4D]
        text-[#A9DDCC]
      "
      >
        <Clock3 size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="
          truncate
          text-sm
          font-medium
          text-[#D5E5DF]
        "
        >
          {name}
        </p>

        <p
          className="
          mt-0.5
          text-xs
          text-[#6F9186]
        "
        >
          {type}
        </p>
      </div>

      <span
        className="
        whitespace-nowrap
        text-xs
        font-medium
        text-[#A9DDCC]
      "
      >
        {time}
      </span>
    </div>
  );
}
