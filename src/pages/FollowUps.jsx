import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Clock3,
  AlertCircle,
  Search,
  ChevronRight,
  Loader2,
  Check,
  XCircle,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";
import {
  updateFollowUpStatus,
  deleteFollowUp,
} from "../services/followUpService";
import toast from "react-hot-toast";

import { getAllFollowUps } from "../services/followUpService";
import ScheduleFollowUpModal from "../components/followups/ScheduleFollowUpModal";
import EditFollowUpModal from "../components/followups/EditFollowUpModal";
import DeleteFollowUpModal from "../components/followups/DeleteFollowUpModal";

const getStatusStyle = (status) => {
  const styles = {
    New: "bg-[#3F8E78]/15 text-[#A9DDCC]",
    Contacted: "bg-blue-400/10 text-blue-300",
    Qualified: "bg-violet-400/10 text-violet-300",
    Proposal: "bg-amber-400/10 text-amber-300",
    Negotiation: "bg-orange-400/10 text-orange-300",
    Converted: "bg-emerald-400/10 text-emerald-300",
    Lost: "bg-red-400/10 text-red-300",
  };

  return styles[status] || "bg-[#21483E] text-[#A8C2B9]";
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function FollowUps() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [followUpList, setFollowUpList] = useState([]);
  const [editFollowUp, setEditFollowUp] = useState(null);
  const [deleteFollowUpData, setDeleteFollowUpData] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalFollowUps: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchFollowUps = async () => {
    try {
      setLoading(true);

      const response = await getAllFollowUps({
        page,
        limit,
      });

      const data = response?.data?.followUps || [];

      setFollowUpList(Array.isArray(data) ? data : []);

      setPagination(
        response?.data?.pagination || {
          currentPage: page,
          itemsPerPage: limit,
          totalFollowUps: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (error) {
      console.error("Fetch Follow-ups Error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load follow-ups",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (followUp) => {
    try {
      await updateFollowUpStatus(followUp._id, "Completed");

      toast.success("Follow-up marked as completed");

      fetchFollowUps();
    } catch (error) {
      console.error("Complete Follow-up Error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to complete follow-up",
      );
    }
  };

  const handleMissed = async (followUp) => {
    try {
      await updateFollowUpStatus(followUp._id, "Missed");

      toast.success("Follow-up marked as missed");

      fetchFollowUps();
    } catch (error) {
      console.error("Miss Follow-up Error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to update follow-up",
      );
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [page]);

  const followUps = useMemo(() => {
    return leads.filter((lead) => lead.nextFollowUpAt);
  }, [leads]);

  const filteredFollowUps = useMemo(() => {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const query = search.trim().toLowerCase();

    return followUpList.filter((item) => {
      // Search
      const lead = item.lead;

      const matchesSearch =
        !query ||
        [
          item.title,
          item.description,
          item.status,
          lead?.name,
          lead?.email,
          lead?.company,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      // Status
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      // Date
      const scheduledAt = new Date(item.scheduledAt);

      let matchesDate = true;

      if (dateFilter === "Today") {
        matchesDate = scheduledAt >= startOfToday && scheduledAt <= endOfToday;
      }

      if (dateFilter === "Upcoming") {
        matchesDate = scheduledAt > endOfToday && item.status === "Pending";
      }

      if (dateFilter === "Overdue") {
        matchesDate = scheduledAt < startOfToday && item.status === "Pending";
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [followUpList, search, statusFilter, dateFilter]);

  const stats = useMemo(() => {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    let overdue = 0;
    let today = 0;
    let upcoming = 0;

    followUps.forEach((item) => {
      if (item.status !== "Pending") {
        return;
      }

      const scheduledAt = new Date(item.scheduledAt);

      if (scheduledAt < startOfToday) {
        overdue++;
      } else if (scheduledAt >= startOfToday && scheduledAt <= endOfToday) {
        today++;
      } else {
        upcoming++;
      }
    });

    return {
      overdue,
      today,
      upcoming,
    };
  }, [followUps]);

  return (
    <div className="min-h-full bg-[#071614] p-4 text-[#E8F3EF] sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock size={22} className="text-[#A9DDCC]" />

            <h1 className="text-2xl font-semibold">Follow-ups</h1>
          </div>

          <p className="mt-1 text-sm text-[#6F9186]">
            Stay on top of your upcoming customer conversations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedLead(null);
            toast.error("Select a lead to schedule a follow-up");
          }}
          className="
            flex h-11 items-center
            justify-center gap-2
            rounded-xl
            bg-[#3F8E78]
            px-5
            text-sm font-semibold
            text-[#E8F3EF]
            transition
            hover:bg-[#4A9C84]
          "
        >
          <CalendarClock size={17} />
          Schedule Follow-up
        </button>
      </div>

      {/* Stats */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Today */}
        <div className="rounded-2xl border border-[#21483E] bg-[#10251F] p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
              <Clock3 size={19} />
            </div>

            <span className="text-xs text-[#6F9186]">Today</span>
          </div>

          <p className="mt-5 text-2xl font-bold">{stats.today}</p>

          <p className="mt-1 text-xs text-[#6F9186]">Follow-ups due today</p>
        </div>

        {/* Upcoming */}
        <div className="rounded-2xl border border-[#21483E] bg-[#10251F] p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3F8E78]/10 text-[#A9DDCC]">
              <CalendarClock size={19} />
            </div>

            <span className="text-xs text-[#6F9186]">Upcoming</span>
          </div>

          <p className="mt-5 text-2xl font-bold">{stats.upcoming}</p>

          <p className="mt-1 text-xs text-[#6F9186]">Upcoming follow-ups</p>
        </div>

        {/* Overdue */}
        <div className="rounded-2xl border border-[#21483E] bg-[#10251F] p-5 sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
              <AlertCircle size={19} />
            </div>

            <span className="text-xs text-[#6F9186]">Attention</span>
          </div>

          <p className="mt-5 text-2xl font-bold">{stats.overdue}</p>

          <p className="mt-1 text-xs text-[#6F9186]">Overdue follow-ups</p>
        </div>
      </div>

      {/* List */}
      <div className="mt-7 overflow-hidden rounded-2xl border border-[#21483E] bg-[#10251F]">
        {/* Top */}
        <div className="flex flex-col gap-4 border-b border-[#21483E] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold">Follow-up Schedule</h2>

            <p className="mt-1 text-xs text-[#6F9186]">
              {followUps.length} scheduled follow-up
              {followUps.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={17}
                className="
        absolute left-3 top-1/2
        -translate-y-1/2
        text-[#6F9186]
      "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search follow-ups..."
                className="
        h-11 w-full rounded-xl
        border border-[#21483E]
        bg-[#10251F]
        pl-10 pr-3
        text-sm text-[#E8F3EF]
        outline-none
        placeholder:text-[#526B63]
        focus:border-[#3F8E78]
      "
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="
        h-11 min-w-[150px]
        rounded-xl
        border border-[#21483E]
        bg-[#10251F]
        px-3
        text-sm text-[#A8C2B9]
        outline-none
        focus:border-[#3F8E78]
      "
              >
                <option value="All">All Status</option>

                <option value="Pending">Pending</option>

                <option value="Completed">Completed</option>

                <option value="Missed">Missed</option>
              </select>

              {/* Date */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="
        h-11 min-w-[150px]
        rounded-xl
        border border-[#21483E]
        bg-[#10251F]
        px-3
        text-sm text-[#A8C2B9]
        outline-none
        focus:border-[#3F8E78]
      "
              >
                <option value="All">All Dates</option>

                <option value="Today">Today</option>

                <option value="Upcoming">Upcoming</option>

                <option value="Overdue">Overdue</option>
              </select>

              {/* Reset */}
              {(search || statusFilter !== "All" || dateFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setDateFilter("All");
                  }}
                  className="
          flex h-11
          items-center
          justify-center
          gap-2
          rounded-xl
          border border-[#21483E]
          px-4
          text-sm font-medium
          text-[#A9DDCC]
          transition
          hover:bg-[#21483E]
        "
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 size={28} className="animate-spin text-[#A9DDCC]" />
          </div>
        ) : filteredFollowUps.length === 0 ? (
          /* Empty */
          <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3F8E78]/10 text-[#A9DDCC]">
              <CalendarClock size={25} />
            </div>

            <h3 className="mt-5 text-sm font-semibold">
              {search ? "No matching follow-ups" : "No follow-ups scheduled"}
            </h3>

            <p className="mt-2 max-w-sm text-xs leading-5 text-[#6F9186]">
              {search
                ? "Try searching with a different lead name or email."
                : "Leads with a scheduled next follow-up will appear here."}
            </p>
          </div>
        ) : (
          /* Desktop table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-[#21483E] text-left">
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6F9186]">
                    Lead
                  </th>

                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6F9186]">
                    Follow-up
                  </th>

                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6F9186]">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-[#6F9186]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredFollowUps.map((item) => {
                  const lead = item.lead;

                  const scheduledAt = new Date(item.scheduledAt);

                  const isOverdue =
                    item.status === "Pending" && scheduledAt < new Date();

                  return (
                    <tr
                      key={item._id}
                      className="
        border-b border-[#21483E]/70
        transition
        hover:bg-[#21483E]/20
      "
                    >
                      {/* Lead */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-[#E8F3EF]">
                          {lead?.name || "Unknown Lead"}
                        </p>

                        <p className="mt-1 text-xs text-[#6F9186]">
                          {lead?.email || "—"}
                        </p>

                        {lead?.company && (
                          <p className="mt-1 text-xs text-[#526B63]">
                            {lead.company}
                          </p>
                        )}
                      </td>

                      {/* Follow-up */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-[#E8F3EF]">
                          {item.title}
                        </p>

                        {item.description && (
                          <p className="mt-1 max-w-xs truncate text-xs text-[#6F9186]">
                            {item.description}
                          </p>
                        )}
                      </td>

                      {/* Scheduled */}
                      <td className="px-5 py-4">
                        <p
                          className={`text-sm font-medium ${
                            isOverdue ? "text-red-300" : "text-[#A9DDCC]"
                          }`}
                        >
                          {new Date(item.scheduledAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>

                        <p className="mt-1 text-xs text-[#6F9186]">
                          {new Date(item.scheduledAt).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`
            inline-flex rounded-lg
            px-2.5 py-1
            text-[11px] font-medium
            ${
              item.status === "Completed"
                ? "bg-emerald-400/10 text-emerald-300"
                : item.status === "Missed"
                  ? "bg-red-400/10 text-red-300"
                  : "bg-amber-400/10 text-amber-300"
            }
          `}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Complete */}
                          {item.status === "Pending" && (
                            <button
                              type="button"
                              onClick={() => handleComplete(item)}
                              title="Mark Completed"
                              className="
          rounded-lg p-2
          text-[#6F9186]
          transition
          hover:bg-[#21483E]
          hover:text-emerald-300
        "
                            >
                              <Check size={16} />
                            </button>
                          )}

                          {/* Missed */}
                          {item.status === "Pending" && (
                            <button
                              type="button"
                              onClick={() => handleMissed(item)}
                              title="Mark Missed"
                              className="
          rounded-lg p-2
          text-[#6F9186]
          transition
          hover:bg-[#21483E]
          hover:text-amber-300
        "
                            >
                              <XCircle size={16} />
                            </button>
                          )}

                          {/* Reschedule */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditFollowUp(item);
                              setEditOpen(true);
                            }}
                            title="Reschedule"
                            className="
        rounded-lg p-2
        text-[#6F9186]
        transition
        hover:bg-[#21483E]
        hover:text-[#A9DDCC]
      "
                          >
                            <Pencil size={16} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteFollowUpData(item);
                              setDeleteOpen(true);
                            }}
                            title="Delete"
                            className="
    rounded-lg p-2
    text-[#6F9186]
    transition
    hover:bg-[#21483E]
    hover:text-red-300
  "
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {pagination.totalFollowUps > 0 && (
              <div
                className="
    flex flex-col gap-3
    border-t border-[#21483E]
    px-5 py-4
    sm:flex-row
    sm:items-center
    sm:justify-between
  "
              >
                {/* Info */}
                <p className="text-xs text-[#6F9186]">
                  Page{" "}
                  <span className="font-medium text-[#A9DDCC]">
                    {pagination.currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-[#A9DDCC]">
                    {pagination.totalPages}
                  </span>
                  <span className="mx-2 text-[#21483E]">•</span>
                  {pagination.totalFollowUps} follow-ups
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => {
                      setPage((prev) => Math.max(prev - 1, 1));
                    }}
                    className="
          rounded-lg
          border border-[#21483E]
          px-3 py-2
          text-xs font-medium
          text-[#A8C2B9]
          transition
          hover:bg-[#21483E]
          hover:text-[#E8F3EF]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
                  >
                    Previous
                  </button>

                  <div
                    className="
        flex h-8 min-w-8
        items-center justify-center
        rounded-lg
        bg-[#3F8E78]
        px-2
        text-xs font-semibold
        text-[#E8F3EF]
      "
                  >
                    {pagination.currentPage}
                  </div>

                  <button
                    type="button"
                    disabled={!pagination.hasNextPage}
                    onClick={() => {
                      setPage((prev) => prev + 1);
                    }}
                    className="
          rounded-lg
          border border-[#21483E]
          px-3 py-2
          text-xs font-medium
          text-[#A8C2B9]
          transition
          hover:bg-[#21483E]
          hover:text-[#E8F3EF]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      <ScheduleFollowUpModal
        open={scheduleOpen}
        lead={selectedLead}
        onClose={() => {
          setScheduleOpen(false);
          setSelectedLead(null);
        }}
        onSuccess={() => {
          fetchFollowUps();
        }}
      />
      <EditFollowUpModal
        open={editOpen}
        followUp={editFollowUp}
        onClose={() => {
          setEditOpen(false);
          setEditFollowUp(null);
        }}
        onSuccess={() => {
          fetchFollowUps();
        }}
      />
      <DeleteFollowUpModal
        open={deleteOpen}
        followUp={deleteFollowUpData}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteFollowUpData(null);
        }}
        onSuccess={() => {
          fetchFollowUps();
        }}
      />
    </div>
  );
}
