import { useState } from "react";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { deleteLead } from "../../services/leadService";

export default function DeleteLeadModal({ open, lead, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  if (!open || !lead) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteLead(lead._id);

      toast.success("Lead deleted successfully");

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Delete Lead Error:", error);

      toast.error(error?.response?.data?.message || "Failed to delete lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#21483E] bg-[#10251F] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#21483E] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
              <Trash2 size={18} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#E8F3EF]">
                Delete Lead
              </h2>

              <p className="text-xs text-[#6F9186]">
                This action cannot be undone
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
        <div className="p-5">
          {/* Warning */}
          <div className="flex gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-300" />

            <div>
              <p className="text-sm font-medium text-[#E8F3EF]">
                Are you sure you want to delete this lead?
              </p>

              <p className="mt-1 text-xs leading-5 text-[#6F9186]">
                All information associated with this lead will be permanently
                removed.
              </p>
            </div>
          </div>

          {/* Lead Info */}
          <div className="mt-4 rounded-xl border border-[#21483E] bg-[#071614]/50 p-4">
            <p className="text-sm font-semibold text-[#E8F3EF]">{lead.name}</p>

            <p className="mt-1 text-xs text-[#6F9186]">{lead.email}</p>

            {lead.company && (
              <p className="mt-1 text-xs text-[#6F9186]">{lead.company}</p>
            )}
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
              hover:text-[#E8F3EF]
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="
              flex h-11 items-center
              justify-center gap-2
              rounded-xl
              bg-red-500/90
              px-5
              text-sm font-semibold
              text-white
              transition
              hover:bg-red-500
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={17} />
                Delete Lead
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
