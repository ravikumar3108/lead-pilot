import { useEffect, useState } from "react";
import { X, UserRound, UserCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { assignLead } from "../../services/leadService";

import { getTeamMembers } from "../../services/leadService";

export default function AssignLeadModal({ open, lead, onClose, onSuccess }) {
  const [members, setMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !lead) return;

    const loadMembers = async () => {
      try {
        setLoadingMembers(true);

        const response = await getTeamMembers();

        const users = response?.data?.users || response?.data || [];

        setMembers(users);

        setSelectedUser(lead.assignedTo?._id || lead.assignedTo || "");
      } catch (error) {
        console.error("Fetch Team Members Error:", error);

        toast.error("Failed to load team members");
      } finally {
        setLoadingMembers(false);
      }
    };

    loadMembers();
  }, [open, lead]);

  if (!open || !lead) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error("Please select a team member");
      return;
    }

    try {
      setLoading(true);

      await assignLead(lead._id, selectedUser);

      toast.success("Lead assigned successfully");

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Assign Lead Error:", error);

      toast.error(error?.response?.data?.message || "Failed to assign lead");
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
              <UserCheck size={18} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#E8F3EF]">
                Assign Lead
              </h2>

              <p className="text-xs text-[#6F9186]">
                Assign this lead to a team member
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
            {/* Lead */}
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#21483E] bg-[#071614]/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3F8E78]/15 text-[#A9DDCC]">
                <UserRound size={17} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#E8F3EF]">
                  {lead.name}
                </p>

                <p className="truncate text-xs text-[#6F9186]">{lead.email}</p>
              </div>
            </div>

            {/* Team Member */}
            <label className="mb-2 block text-xs font-medium text-[#A8C2B9]">
              Assign To
            </label>

            {loadingMembers ? (
              <div className="flex h-11 items-center justify-center rounded-xl border border-[#21483E] bg-[#071614]">
                <Loader2 size={17} className="animate-spin text-[#A9DDCC]" />
              </div>
            ) : (
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                disabled={loading}
                className="
                  h-11 w-full
                  rounded-xl
                  border border-[#21483E]
                  bg-[#071614]
                  px-3
                  text-sm
                  text-[#E8F3EF]
                  outline-none
                  focus:border-[#3F8E78]
                "
              >
                <option value="">Select team member</option>

                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                    {member.email ? ` — ${member.email}` : ""}
                  </option>
                ))}
              </select>
            )}
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
              disabled={loading || loadingMembers || !selectedUser}
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
                  Assigning...
                </>
              ) : (
                <>
                  <UserCheck size={17} />
                  Assign Lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
