import { Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { deleteFollowUp } from "../../services/followUpService";

export default function DeleteFollowUpModal({
  open,
  followUp,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  if (!open || !followUp) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteFollowUp(followUp._id);

      toast.success("Follow-up deleted successfully");

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Delete Follow-up Error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to delete follow-up",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#21483E] bg-[#10251F] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#21483E] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
              <Trash2 size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#E8F3EF]">
                Delete Follow-up
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
        <div className="px-5 py-6">
          <p className="text-sm leading-6 text-[#A8C2B9]">
            Are you sure you want to delete this follow-up?
          </p>

          <div className="mt-4 rounded-xl border border-[#21483E] bg-[#071614]/60 p-4">
            <p className="text-sm font-medium text-[#E8F3EF]">
              {followUp.title}
            </p>

            <p className="mt-1 text-xs text-[#6F9186]">
              {followUp.lead?.name || "Unknown Lead"}
            </p>

            {followUp.scheduledAt && (
              <p className="mt-2 text-xs text-[#6F9186]">
                {new Date(followUp.scheduledAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
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
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
