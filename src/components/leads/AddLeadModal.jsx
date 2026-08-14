import { useEffect, useState } from "react";
import {
  X,
  UserRound,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Globe,
  Flag,
  Wallet,
  Clock3,
  Tag,
  Loader2,
  Plus,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";

import { createLead, updateLead } from "../../services/leadService";

const sourceOptions = [
  "Website",
  "Landing Page",
  "WhatsApp",
  "Email",
  "Telegram",
  "Manual",
  "Other",
];

const priorityOptions = ["Low", "Medium", "High"];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
  source: "Manual",
  priority: "Medium",
  category: "",
  budget: "",
  timeline: "",
};

export default function AddLeadModal({
  open,
  onClose,
  onSuccess,
  lead = null,
}) {
  const isEditMode = Boolean(lead);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!open) return;

    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        message: lead.message || "",
        source: lead.source || "Manual",
        priority: lead.priority || "Medium",
        category: lead.category || "",
        budget:
          lead.budget !== undefined && lead.budget !== null
            ? String(lead.budget)
            : "",
        timeline: lead.timeline || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [open, lead]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Message is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        message: formData.message.trim(),
        source: formData.source,
        priority: formData.priority,
        category: formData.category.trim(),
        timeline: formData.timeline.trim(),
      };

      if (formData.budget !== "") {
        payload.budget = Number(formData.budget);
      }

      if (isEditMode) {
        await updateLead(lead._id, payload);

        toast.success("Lead updated successfully");
      } else {
        await createLead(payload);

        toast.success("Lead created successfully");
      }

      onSuccess?.();

      onClose();
    } catch (error) {
      console.error(`${isEditMode ? "Update" : "Create"} Lead Error:`, error);

      toast.error(
        error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} lead`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#21483E] bg-[#10251F] shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#21483E] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3F8E78]/15 text-[#A9DDCC]">
              {isEditMode ? <Pencil size={18} /> : <Plus size={18} />}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#E8F3EF]">
                {isEditMode ? "Edit Lead" : "Add New Lead"}
              </h2>

              <p className="mt-0.5 text-xs text-[#6F9186]">
                {isEditMode
                  ? "Update lead information"
                  : "Add a new prospect to your pipeline"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-[#6F9186] transition hover:bg-[#21483E] hover:text-[#E8F3EF]"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-5 py-5 sm:px-6"
        >
          {/* Customer Information */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <UserRound size={17} className="text-[#A9DDCC]" />

              <h3 className="text-sm font-semibold text-[#E8F3EF]">
                Customer Information
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#A8C2B9]">
                  Name <span className="text-red-300">*</span>
                </label>

                <div className="relative">
                  <UserRound
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F9186]"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="h-11 w-full rounded-xl border border-[#21483E] bg-[#071614] pl-10 pr-3 text-sm text-[#E8F3EF] outline-none placeholder:text-[#526B63] focus:border-[#3F8E78]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#A8C2B9]">
                  Email <span className="text-red-300">*</span>
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F9186]"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="h-11 w-full rounded-xl border border-[#21483E] bg-[#071614] pl-10 pr-3 text-sm text-[#E8F3EF] outline-none placeholder:text-[#526B63] focus:border-[#3F8E78]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#A8C2B9]">
                  Phone
                </label>

                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F9186]"
                  />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="h-11 w-full rounded-xl border border-[#21483E] bg-[#071614] pl-10 pr-3 text-sm text-[#E8F3EF] outline-none placeholder:text-[#526B63] focus:border-[#3F8E78]"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#A8C2B9]">
                  Company
                </label>

                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F9186]"
                  />

                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                    className="h-11 w-full rounded-xl border border-[#21483E] bg-[#071614] pl-10 pr-3 text-sm text-[#E8F3EF] outline-none placeholder:text-[#526B63] focus:border-[#3F8E78]"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-[#A8C2B9]">
                Message <span className="text-red-300">*</span>
              </label>

              <div className="relative">
                <MessageSquare
                  size={16}
                  className="absolute left-3 top-3.5 text-[#6F9186]"
                />

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us what the customer is looking for..."
                  className="w-full resize-none rounded-xl border border-[#21483E] bg-[#071614] py-3 pl-10 pr-3 text-sm text-[#E8F3EF] outline-none placeholder:text-[#526B63] focus:border-[#3F8E78]"
                />
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="mt-7 border-t border-[#21483E] pt-6">
            <div className="mb-4 flex items-center gap-2">
              <Tag size={17} className="text-[#A9DDCC]" />

              <h3 className="text-sm font-semibold text-[#E8F3EF]">
                Lead Details
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Source */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#A8C2B9]">
                  Source
                </label>

                <div className="relative">
                  <Globe
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F9186]"
                  />

                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="h-11 w-full appearance-none rounded-xl border border-[#21483E] bg-[#071614] pl-10 pr-3 text-sm text-[#A8C2B9] outline-none focus:border-[#3F8E78]"
                  >
                    {sourceOptions.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#A8C2B9]">
                  Priority
                </label>

                <div className="relative">
                  <Flag
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F9186]"
                  />

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="h-11 w-full appearance-none rounded-xl border border-[#21483E] bg-[#071614] pl-10 pr-3 text-sm text-[#A8C2B9] outline-none focus:border-[#3F8E78]"
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#A8C2B9]">
                  Category
                </label>

                <div className="relative">
                  <Tag
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F9186]"
                  />

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="SaaS, Enterprise..."
                    className="h-11 w-full rounded-xl border border-[#21483E] bg-[#071614] pl-10 pr-3 text-sm text-[#E8F3EF] outline-none placeholder:text-[#526B63] focus:border-[#3F8E78]"
                  />
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#A8C2B9]">
                  Budget
                </label>

                <div className="relative">
                  <Wallet
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F9186]"
                  />

                  <input
                    type="number"
                    min="0"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="50000"
                    className="h-11 w-full rounded-xl border border-[#21483E] bg-[#071614] pl-10 pr-3 text-sm text-[#E8F3EF] outline-none placeholder:text-[#526B63] focus:border-[#3F8E78]"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-[#A8C2B9]">
                  Timeline
                </label>

                <div className="relative">
                  <Clock3
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F9186]"
                  />

                  <input
                    type="text"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    placeholder="Within 30 days"
                    className="h-11 w-full rounded-xl border border-[#21483E] bg-[#071614] pl-10 pr-3 text-sm text-[#E8F3EF] outline-none placeholder:text-[#526B63] focus:border-[#3F8E78]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#21483E] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-11 rounded-xl border border-[#21483E] px-5 text-sm font-medium text-[#A8C2B9] transition hover:bg-[#21483E]/60 hover:text-[#E8F3EF]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3F8E78] px-6 text-sm font-semibold text-[#E8F3EF] transition hover:bg-[#4A9C84] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEditMode ? <Pencil size={17} /> : <Plus size={17} />}

                  {isEditMode ? "Update Lead" : "Create Lead"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
