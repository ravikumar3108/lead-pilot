import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  X,
  Pencil,
  UserCheck,
  Trash2,
  CalendarClock 
} from "lucide-react";
import toast from "react-hot-toast";
import AddLeadModal from "../components/leads/AddLeadModal";
import { getAllLeads } from "../services/leadService";
import LeadDetailsDrawer from "../components/leads/LeadDetailsDrawer";
import ChangeLeadStatusModal from "../components/leads/ChangeLeadStatusModal";
import AssignLeadModal from "../components/leads/AssignLeadModal";
import DeleteLeadModal from "../components/leads/DeleteLeadModal";
import ScheduleFollowUpModal from "../components/followups/ScheduleFollowUpModal";

const statusOptions = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Converted",
  "Lost",
];

const priorityOptions = ["Low", "Medium", "High"];

const sourceOptions = [
  "Website",
  "Landing Page",
  "WhatsApp",
  "Email",
  "Telegram",
  "Manual",
  "Other",
];

const getStatusStyle = (status) => {
  const styles = {
    New: "bg-[#3F8E78]/15 text-[#A9DDCC] border-[#3F8E78]/30",
    Contacted: "bg-blue-400/10 text-blue-300 border-blue-400/20",
    Qualified: "bg-violet-400/10 text-violet-300 border-violet-400/20",
    Proposal: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    Negotiation: "bg-orange-400/10 text-orange-300 border-orange-400/20",
    Converted: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    Lost: "bg-red-400/10 text-red-300 border-red-400/20",
  };

  return styles[status] || "bg-[#21483E]/50 text-[#A8C2B9] border-[#21483E]";
};

const getPriorityStyle = (priority) => {
  const styles = {
    Low: "text-[#6F9186]",
    Medium: "text-amber-300",
    High: "text-red-300",
  };

  return styles[priority] || "text-[#A8C2B9]";
};

const LeadSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="hidden md:block">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="grid grid-cols-6 gap-4 border-b border-[#21483E] px-5 py-5"
          >
            {[1, 2, 3, 4, 5, 6].map((box) => (
              <div key={box} className="h-4 rounded bg-[#21483E]" />
            ))}
          </div>
        ))}
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-[#21483E] bg-[#10251F] p-4"
          >
            <div className="h-4 w-1/2 rounded bg-[#21483E]" />
            <div className="mt-3 h-3 w-3/4 rounded bg-[#21483E]" />
            <div className="mt-3 h-3 w-1/3 rounded bg-[#21483E]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Leads() {
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [priorityFilter, setPriorityFilter] = useState("");

  const [sourceFilter, setSourceFilter] = useState("");
  const [statusLead, setStatusLead] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState(null);

  const [selectedLead, setSelectedLead] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [assignLeadData, setAssignLeadData] = useState(null);
  const [deleteLeadData, setDeleteLeadData] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const [followUpLead, setFollowUpLead] = useState(null);

  const [followUpOpen, setFollowUpOpen] = useState(false);
  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await getAllLeads({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        source: sourceFilter || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      setLeads(response?.data?.leads || []);

      setPagination(response?.data?.pagination || null);
    } catch (error) {
      console.error("Fetch Leads Error:", error);

      toast.error(error?.response?.data?.message || "Failed to fetch leads");

      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter, priorityFilter, sourceFilter]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setSourceFilter("");
    setPage(1);
  };

  const hasFilters = search || statusFilter || priorityFilter || sourceFilter;

  return (
    <div className="min-h-full bg-[#071614] text-[#E8F3EF]">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3F8E78]/15 text-[#A9DDCC]">
              <Users size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold">Leads</h1>

              <p className="mt-0.5 text-sm text-[#6F9186]">
                Manage and track your sales leads
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAddLeadOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3F8E78] px-4 py-2.5 text-sm font-semibold text-[#E8F3EF] transition hover:bg-[#4A9C84]"
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#21483E] bg-[#10251F] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F9186]"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search leads..."
              className="
                h-11 w-full rounded-xl
                border border-[#21483E]
                bg-[#071614]
                pl-10 pr-4
                text-sm text-[#E8F3EF]
                outline-none
                placeholder:text-[#6F9186]
                focus:border-[#3F8E78]
              "
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden gap-2 lg:flex">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-[#21483E] bg-[#071614] px-3 text-sm text-[#A8C2B9] outline-none focus:border-[#3F8E78]"
            >
              <option value="">All Status</option>

              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-[#21483E] bg-[#071614] px-3 text-sm text-[#A8C2B9] outline-none focus:border-[#3F8E78]"
            >
              <option value="">All Priority</option>

              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-[#21483E] bg-[#071614] px-3 text-sm text-[#A8C2B9] outline-none focus:border-[#3F8E78]"
            >
              <option value="">All Sources</option>

              {sourceOptions.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={fetchLeads}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#21483E] text-[#A8C2B9] transition hover:border-[#3F8E78] hover:text-[#A9DDCC]"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#21483E] text-sm text-[#A8C2B9] lg:hidden"
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </div>

        {/* Mobile Filters */}
        {mobileFiltersOpen && (
          <div className="mt-4 grid gap-3 border-t border-[#21483E] pt-4 sm:grid-cols-3 lg:hidden">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-[#21483E] bg-[#071614] px-3 text-sm text-[#A8C2B9] outline-none"
            >
              <option value="">All Status</option>

              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-[#21483E] bg-[#071614] px-3 text-sm text-[#A8C2B9] outline-none"
            >
              <option value="">All Priority</option>

              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-[#21483E] bg-[#071614] px-3 text-sm text-[#A8C2B9] outline-none"
            >
              <option value="">All Sources</option>

              {sourceOptions.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Active Filters */}
        {hasFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#6F9186]">Active filters:</span>

            {search && (
              <span className="rounded-lg bg-[#3F8E78]/10 px-2.5 py-1 text-xs text-[#A9DDCC]">
                Search: {search}
              </span>
            )}

            {statusFilter && (
              <span className="rounded-lg bg-[#3F8E78]/10 px-2.5 py-1 text-xs text-[#A9DDCC]">
                {statusFilter}
              </span>
            )}

            {priorityFilter && (
              <span className="rounded-lg bg-[#3F8E78]/10 px-2.5 py-1 text-xs text-[#A9DDCC]">
                {priorityFilter}
              </span>
            )}

            {sourceFilter && (
              <span className="rounded-lg bg-[#3F8E78]/10 px-2.5 py-1 text-xs text-[#A9DDCC]">
                {sourceFilter}
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="ml-auto flex items-center gap-1 text-xs text-[#6F9186] hover:text-[#A9DDCC]"
            >
              <X size={13} />
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Leads */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-[#21483E] bg-[#10251F]">
        {loading ? (
          <LeadSkeleton />
        ) : leads.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3F8E78]/10 text-[#A9DDCC]">
              <Users size={24} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-[#E8F3EF]">
              No leads found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[#6F9186]">
              Try changing your filters or add a new lead.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 text-sm font-medium text-[#A9DDCC] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#21483E] bg-[#071614]/40">
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6F9186]">
                      Lead
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6F9186]">
                      Company
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6F9186]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6F9186]">
                      Priority
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6F9186]">
                      Score
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6F9186]">
                      Source
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead._id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setDetailsOpen(true);
                      }}
                      className="cursor-pointer border-b border-[#21483E]/70 transition hover:bg-[#21483E]/20"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3F8E78]/15 text-sm font-semibold text-[#A9DDCC]">
                            {lead.name?.charAt(0)?.toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#E8F3EF]">
                              {lead.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-[#6F9186]">
                              {lead.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-[#A8C2B9]">
                          {lead.company || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                            lead.status,
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-sm font-medium ${getPriorityStyle(
                            lead.priority,
                          )}`}
                        >
                          {lead.priority || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-[#A9DDCC]">
                          {lead.leadScore ?? 0}
                        </span>
                      </td>

                      <td
                        className="px-4 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditLead(lead);
                              setEditOpen(true);
                            }}
                            className="
            rounded-lg p-2
            text-[#6F9186]
            transition
            hover:bg-[#21483E]
            hover:text-[#A9DDCC]
          "
                            title="Edit Lead"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              setStatusLead(lead);
                              setStatusOpen(true);
                            }}
                            className="
    rounded-lg p-2
    text-[#6F9186]
    transition
    hover:bg-[#21483E]
    hover:text-[#A9DDCC]
  "
                            title="Change Status"
                          >
                            <RefreshCw size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              setFollowUpLead(lead);
                              setFollowUpOpen(true);
                            }}
                            className="
    rounded-lg p-2
    text-[#6F9186]
    transition
    hover:bg-[#21483E]
    hover:text-[#A9DDCC]
  "
                            title="Schedule Follow-up"
                          >
                            <CalendarClock size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              setAssignLeadData(lead);
                              setAssignOpen(true);
                            }}
                            className="
    rounded-lg p-2
    text-[#6F9186]
    transition
    hover:bg-[#21483E]
    hover:text-[#A9DDCC]
  "
                            title="Assign Lead"
                          >
                            <UserCheck size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              setDeleteLeadData(lead);
                              setDeleteOpen(true);
                            }}
                            className="
    rounded-lg p-2
    text-[#6F9186]
    transition
    hover:bg-red-400/10
    hover:text-red-300
  "
                            title="Delete Lead"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 p-4 md:hidden">
              {leads.map((lead) => (
                <div
                  key={lead._id}
                  className="rounded-2xl border border-[#21483E] bg-[#071614]/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3F8E78]/15 text-sm font-semibold text-[#A9DDCC]">
                        {lead.name?.charAt(0)?.toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#E8F3EF]">
                          {lead.name}
                        </p>

                        <p className="truncate text-xs text-[#6F9186]">
                          {lead.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-lg border px-2 py-1 text-[10px] font-medium ${getStatusStyle(
                        lead.status,
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#21483E] pt-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#6F9186]">
                        Company
                      </p>

                      <p className="mt-1 truncate text-xs text-[#A8C2B9]">
                        {lead.company || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#6F9186]">
                        Source
                      </p>

                      <p className="mt-1 truncate text-xs text-[#A8C2B9]">
                        {lead.source || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#6F9186]">
                        Priority
                      </p>

                      <p
                        className={`mt-1 text-xs font-medium ${getPriorityStyle(
                          lead.priority,
                        )}`}
                      >
                        {lead.priority || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#6F9186]">
                        AI Score
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#A9DDCC]">
                        {lead.leadScore ?? 0}/100
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && leads.length > 0 && pagination && (
          <div className="flex flex-col gap-3 border-t border-[#21483E] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#6F9186]">
              Page{" "}
              <span className="text-[#A8C2B9]">{pagination.currentPage}</span>{" "}
              of <span className="text-[#A8C2B9]">{pagination.totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage((prev) => prev - 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-[#21483E] px-3 text-xs text-[#A8C2B9] transition hover:border-[#3F8E78] hover:text-[#A9DDCC] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-[#21483E] px-3 text-xs text-[#A8C2B9] transition hover:border-[#3F8E78] hover:text-[#A9DDCC] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
      <AddLeadModal
        open={editOpen}
        lead={editLead}
        onClose={() => {
          setEditOpen(false);
          setEditLead(null);
        }}
        onSuccess={() => {
          setEditOpen(false);
          setEditLead(null);
          fetchLeads();
        }}
      />
      <LeadDetailsDrawer
        open={detailsOpen}
        lead={selectedLead}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedLead(null);
        }}
      />
      <ChangeLeadStatusModal
        open={statusOpen}
        lead={statusLead}
        onClose={() => {
          setStatusOpen(false);
          setStatusLead(null);
        }}
        onSuccess={() => {
          fetchLeads();
        }}
      />
      <AddLeadModal
        open={addLeadOpen}
        onClose={() => setAddLeadOpen(false)}
        onSuccess={() => {
          setPage(1);
          fetchLeads();
        }}
      />
      <AssignLeadModal
        open={assignOpen}
        lead={assignLeadData}
        onClose={() => {
          setAssignOpen(false);
          setAssignLeadData(null);
        }}
        onSuccess={() => {
          fetchLeads();
        }}
      />
      <ScheduleFollowUpModal
        open={followUpOpen}
        lead={followUpLead}
        onClose={() => {
          setFollowUpOpen(false);
          setFollowUpLead(null);
        }}
        onSuccess={() => {
          fetchLeads();
        }}
      />
      <DeleteLeadModal
        open={deleteOpen}
        lead={deleteLeadData}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteLeadData(null);
        }}
        onSuccess={() => {
          fetchLeads();
        }}
      />
    </div>
  );
}
