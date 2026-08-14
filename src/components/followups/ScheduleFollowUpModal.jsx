import { useEffect, useState } from "react";
import { X, CalendarClock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { createFollowUp } from "../../services/followUpService";

export default function ScheduleFollowUpModal({
  open,
  lead,
  onClose,
  onSuccess,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
  }, [open, lead]);

  if (!open || !lead) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter follow-up title");
      return;
    }

    if (!date || !time) {
      toast.error("Please select date and time");
      return;
    }

    const scheduledAt = new Date(`${date}T${time}`);

    if (scheduledAt <= new Date()) {
      toast.error("Follow-up must be scheduled for a future date");
      return;
    }

    try {
      setLoading(true);

      await createFollowUp({
        leadId: lead._id,
        title: title.trim(),
        description: description.trim(),
        scheduledAt: scheduledAt.toISOString(),
      });

      toast.success("Follow-up scheduled successfully");

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Create Follow-up Error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to schedule follow-up",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#21483E] bg-[#10251F] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#21483E] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3F8E78]/15 text-[#A9DDCC]">
              <CalendarClock size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#E8F3EF]">
                Schedule Follow-up
              </h2>

              <p className="mt-0.5 text-xs text-[#6F9186]">{lead.name}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-[#6F9186] transition hover:bg-[#21483E] hover:text-[#E8F3EF]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5">
            {/* Lead */}
            <div className="rounded-xl border border-[#21483E] bg-[#071614]/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6F9186]">
                Lead
              </p>

              <p className="mt-1 text-sm font-semibold text-[#E8F3EF]">
                {lead.name}
              </p>

              <p className="mt-1 text-xs text-[#6F9186]">{lead.email}</p>

              {lead.company && (
                <p className="mt-1 text-xs text-[#526B63]">{lead.company}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[#A8C2B9]">
                Follow-up Title
                <span className="text-red-400"> *</span>
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Discuss pricing"
                disabled={loading}
                maxLength={200}
                className="
                  h-11 w-full rounded-xl
                  border border-[#21483E]
                  bg-[#071614]
                  px-3
                  text-sm text-[#E8F3EF]
                  outline-none
                  placeholder:text-[#526B63]
                  focus:border-[#3F8E78]
                "
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[#A8C2B9]">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes for this follow-up..."
                disabled={loading}
                maxLength={2000}
                rows={4}
                className="
                  w-full resize-none rounded-xl
                  border border-[#21483E]
                  bg-[#071614]
                  px-3 py-3
                  text-sm text-[#E8F3EF]
                  outline-none
                  placeholder:text-[#526B63]
                  focus:border-[#3F8E78]
                "
              />
            </div>

            {/* Date + Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-[#A8C2B9]">
                  Date
                  <span className="text-red-400"> *</span>
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={loading}
                  min={new Date().toISOString().split("T")[0]}
                  className="
                    h-11 w-full rounded-xl
                    border border-[#21483E]
                    bg-[#071614]
                    px-3
                    text-sm text-[#E8F3EF]
                    outline-none
                    focus:border-[#3F8E78]
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-[#A8C2B9]">
                  Time
                  <span className="text-red-400"> *</span>
                </label>

                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={loading}
                  className="
                    h-11 w-full rounded-xl
                    border border-[#21483E]
                    bg-[#071614]
                    px-3
                    text-sm text-[#E8F3EF]
                    outline-none
                    focus:border-[#3F8E78]
                  "
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#21483E] p-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                h-11 rounded-xl
                border border-[#21483E]
                px-5
                text-sm font-medium
                text-[#A8C2B9]
                transition
                hover:bg-[#21483E]/60
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
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
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <CalendarClock size={17} />
                  Schedule Follow-up
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
