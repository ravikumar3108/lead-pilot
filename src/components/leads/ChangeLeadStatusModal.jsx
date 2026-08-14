import { useEffect, useState } from "react";
import {
  X,
  RefreshCw,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import { updateLeadStatus } from "../../services/leadService";

const statusOptions = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Converted",
  "Lost",
];

export default function ChangeLeadStatusModal({
  open,
  lead,
  onClose,
  onSuccess,
}) {
  const [status, setStatus] = useState("New");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setStatus(lead.status || "New");
    }
  }, [lead]);

  if (!open || !lead) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === lead.status) {
      toast.error("Please select a different status");
      return;
    }

    try {
      setLoading(true);

      await updateLeadStatus(
        lead._id,
        status
      );

      toast.success(
        `Lead status changed to ${status}`
      );

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(
        "Update Lead Status Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update lead status"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#21483E] bg-[#10251F] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#21483E] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3F8E78]/15 text-[#A9DDCC]">
              <RefreshCw size={18} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#E8F3EF]">
                Change Lead Status
              </h2>

              <p className="text-xs text-[#6F9186]">
                Update {lead.name}'s status
              </p>
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

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-5">

            {/* Current Status */}
            <div className="mb-5 rounded-xl border border-[#21483E] bg-[#071614]/50 p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#6F9186]">
                Current Status
              </p>

              <p className="mt-2 text-sm font-semibold text-[#A9DDCC]">
                {lead.status}
              </p>
            </div>

            {/* New Status */}
            <label className="mb-2 block text-xs font-medium text-[#A8C2B9]">
              New Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              disabled={loading}
              className="
                h-11 w-full
                rounded-xl
                border border-[#21483E]
                bg-[#071614]
                px-3
                text-sm text-[#E8F3EF]
                outline-none
                focus:border-[#3F8E78]
              "
            >
              {statusOptions.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
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
                hover:text-[#E8F3EF]
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
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw size={17} />
                  Update Status
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}