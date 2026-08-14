import {
  X,
  UserRound,
  Mail,
  Phone,
  Building2,
  Globe,
  Flag,
  Wallet,
  Clock3,
  Tag,
  CalendarDays,
  Sparkles,
  Brain,
  MessageSquare,
} from "lucide-react";

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

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-xl border border-[#21483E] bg-[#071614]/40 p-3">
      <div className="flex items-center gap-2">
        <Icon size={15} className="text-[#6F9186]" />

        <p className="text-[10px] font-medium uppercase tracking-wider text-[#6F9186]">
          {label}
        </p>
      </div>

      <p className="mt-2 truncate text-sm text-[#E8F3EF]">{value || "—"}</p>
    </div>
  );
};

export default function LeadDetailsDrawer({ open, lead, onClose }) {
  if (!open || !lead) return null;

  const aiAnalysis = lead.aiAnalysis;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="
          fixed inset-0 z-[90]
          bg-black/60
          backdrop-blur-sm
        "
      />

      {/* Drawer */}
      <aside
        className="
          fixed right-0 top-0 z-[100]
          flex h-screen
          w-full flex-col
          border-l border-[#21483E]
          bg-[#10251F]
          shadow-2xl
          sm:w-[520px]
        "
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#21483E] px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3F8E78]/15 text-[#A9DDCC]">
              <UserRound size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-[#E8F3EF]">
                {lead.name}
              </h2>

              <p className="truncate text-xs text-[#6F9186]">Lead Details</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[#6F9186] transition hover:bg-[#21483E] hover:text-[#E8F3EF]"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Status + Score */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#21483E] bg-[#071614]/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-[#6F9186]">
                Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-lg border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                  lead.status,
                )}`}
              >
                {lead.status}
              </span>
            </div>

            <div className="rounded-xl border border-[#21483E] bg-[#071614]/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-[#6F9186]">
                AI Lead Score
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-xl font-bold text-[#A9DDCC]">
                  {lead.leadScore ?? 0}
                </span>

                <span className="text-xs text-[#6F9186]">/ 100</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <UserRound size={16} className="text-[#A9DDCC]" />

              <h3 className="text-sm font-semibold text-[#E8F3EF]">
                Customer Information
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem icon={Mail} label="Email" value={lead.email} />

              <DetailItem icon={Phone} label="Phone" value={lead.phone} />

              <DetailItem
                icon={Building2}
                label="Company"
                value={lead.company}
              />

              <DetailItem icon={Globe} label="Source" value={lead.source} />
            </div>
          </section>

          {/* Lead Details */}
          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <Tag size={16} className="text-[#A9DDCC]" />

              <h3 className="text-sm font-semibold text-[#E8F3EF]">
                Lead Information
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem icon={Flag} label="Priority" value={lead.priority} />

              <DetailItem icon={Tag} label="Category" value={lead.category} />

              <DetailItem
                icon={Wallet}
                label="Budget"
                value={
                  lead.budget
                    ? `₹${Number(lead.budget).toLocaleString("en-IN")}`
                    : "—"
                }
              />

              <DetailItem
                icon={Clock3}
                label="Timeline"
                value={lead.timeline}
              />
            </div>
          </section>

          {/* Message */}
          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare size={16} className="text-[#A9DDCC]" />

              <h3 className="text-sm font-semibold text-[#E8F3EF]">
                Customer Message
              </h3>
            </div>

            <div className="rounded-xl border border-[#21483E] bg-[#071614]/40 p-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-[#A8C2B9]">
                {lead.message || "No message available."}
              </p>
            </div>
          </section>

          {/* AI Analysis */}
          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-[#A9DDCC]" />

              <h3 className="text-sm font-semibold text-[#E8F3EF]">
                AI Analysis
              </h3>
            </div>

            <div className="rounded-2xl border border-[#3F8E78]/40 bg-[#3F8E78]/5 p-4">
              {/* Summary */}
              <div>
                <div className="flex items-center gap-2">
                  <Brain size={15} className="text-[#A9DDCC]" />

                  <p className="text-xs font-semibold text-[#A9DDCC]">
                    Summary
                  </p>
                </div>

                <p className="mt-2 text-sm leading-6 text-[#A8C2B9]">
                  {aiAnalysis?.summary || "AI analysis is not available yet."}
                </p>
              </div>

              {/* Intent */}
              {aiAnalysis?.intent && (
                <div className="mt-4 border-t border-[#21483E] pt-4">
                  <p className="text-[10px] uppercase tracking-wider text-[#6F9186]">
                    Intent
                  </p>

                  <p className="mt-1 text-sm text-[#E8F3EF]">
                    {aiAnalysis.intent}
                  </p>
                </div>
              )}

              {/* Category */}
              {aiAnalysis?.category && (
                <div className="mt-4 border-t border-[#21483E] pt-4">
                  <p className="text-[10px] uppercase tracking-wider text-[#6F9186]">
                    AI Category
                  </p>

                  <p className="mt-1 text-sm text-[#E8F3EF]">
                    {aiAnalysis.category}
                  </p>
                </div>
              )}

              {/* Reasoning */}
              {aiAnalysis?.reasoning && (
                <div className="mt-4 border-t border-[#21483E] pt-4">
                  <p className="text-[10px] uppercase tracking-wider text-[#6F9186]">
                    Reasoning
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#A8C2B9]">
                    {aiAnalysis.reasoning}
                  </p>
                </div>
              )}

              {/* Analyzed At */}
              {aiAnalysis?.analyzedAt && (
                <p className="mt-4 text-[10px] text-[#6F9186]">
                  Analyzed on {formatDate(aiAnalysis.analyzedAt)}
                </p>
              )}
            </div>
          </section>

          {/* Dates */}
          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays size={16} className="text-[#A9DDCC]" />

              <h3 className="text-sm font-semibold text-[#E8F3EF]">Activity</h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                icon={CalendarDays}
                label="Created"
                value={formatDate(lead.createdAt)}
              />

              <DetailItem
                icon={CalendarDays}
                label="Last Updated"
                value={formatDate(lead.updatedAt)}
              />

              <DetailItem
                icon={CalendarDays}
                label="Last Contacted"
                value={formatDate(lead.lastContactedAt)}
              />

              <DetailItem
                icon={CalendarDays}
                label="Next Follow-up"
                value={formatDate(lead.nextFollowUpAt)}
              />
            </div>
          </section>

          {/* Conversion */}
          {lead.convertedAt && (
            <section className="mt-6">
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <p className="text-xs font-semibold text-emerald-300">
                  Lead Converted
                </p>

                <p className="mt-1 text-xs text-[#6F9186]">
                  Converted on {formatDate(lead.convertedAt)}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#21483E] p-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-xl border border-[#21483E] text-sm font-medium text-[#A8C2B9] transition hover:bg-[#21483E]/60 hover:text-[#E8F3EF]"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
}
