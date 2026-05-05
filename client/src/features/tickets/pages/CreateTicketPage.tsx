import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import { createTicket } from "../../../api/tickets";

type TicketForm = {
  title: string;
  description: string;
  priority: string;
  assignee: string;
  created: string;
};

type TicketFormErrors = Record<keyof TicketForm, string>;

const emptyForm: TicketForm = {
  title: "",
  description: "",
  priority: "",
  assignee: "",
  created: "",
};

const emptyErrors: TicketFormErrors = {
  title: "",
  description: "",
  priority: "",
  assignee: "",
  created: "",
};

const priorityOptions = ["Urgent", "High", "Medium", "Low"];
const assigneeOptions = ["Sarah Chen", "Marcus K.", "Alex Rivera", "Lila Thorne"];

const CreateTicketPage = () => {
  const [form, setForm] = useState<TicketForm>(emptyForm);
  const [errors, setErrors] = useState<TicketFormErrors>(emptyErrors);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const updateField = (field: keyof TicketForm, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    if (value.trim()) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: "",
      }));
    }

    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = { ...emptyErrors };

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!form.priority.trim()) {
      newErrors.priority = "Please select a priority";
    }

    if (!form.assignee.trim()) {
      newErrors.assignee = "Please select an assignee";
    }

    if (!form.created.trim()) {
      newErrors.created = "Due date is required";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading || !validateForm()) return;

    try {
      setLoading(true);
      setSubmitError("");
      await createTicket({
        ...form,
        status: "OPEN",
      });

      navigate("/tickets");
    } catch (error) {
      console.error("Error creating ticket:", error);
      setSubmitError("Unable to create the ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
          <Link to="/tickets" className="hover:text-teal-700">
            Tickets
          </Link>
          <span>/</span>
          <span className="text-slate-500">Create Ticket</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Create Ticket</h1>
        <p className="mt-1 text-sm text-slate-500">
          Submit a new operational request and assign ownership.
        </p>
      </header>

      <section className="max-w-3xl rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Ticket title
            </label>
            <input
              type="text"
              placeholder="Enter a clear and concise title"
              value={form.title}
              disabled={loading}
              className={`w-full rounded-lg border bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-slate-100 ${
                errors.title ? "border-red-500" : "border-slate-200"
              }`}
              onChange={(event) => updateField("title", event.target.value)}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows={6}
              placeholder="Describe the issue, request, or workflow need..."
              value={form.description}
              disabled={loading}
              className={`w-full rounded-lg border bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-slate-100 ${
                errors.description ? "border-red-500" : "border-slate-200"
              }`}
              onChange={(event) => updateField("description", event.target.value)}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Priority
              </label>
              <select
                value={form.priority}
                disabled={loading}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-slate-100 ${
                  errors.priority ? "border-red-500" : "border-slate-200"
                }`}
                onChange={(event) => updateField("priority", event.target.value)}
              >
                <option value="">Select priority</option>
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Assignee
              </label>
              <select
                value={form.assignee}
                disabled={loading}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-slate-100 ${
                  errors.assignee ? "border-red-500" : "border-slate-200"
                }`}
                onChange={(event) => updateField("assignee", event.target.value)}
              >
                <option value="">Select assignee</option>
                {assigneeOptions.map((assignee) => (
                  <option key={assignee} value={assignee}>
                    {assignee}
                  </option>
                ))}
              </select>
              {errors.assignee && (
                <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Due date
            </label>
            <input
              type="date"
              value={form.created}
              disabled={loading}
              className={`w-full rounded-lg border bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-slate-100 ${
                errors.created ? "border-red-500" : "border-slate-200"
              }`}
              onChange={(event) => updateField("created", event.target.value)}
            />
            {errors.created && (
              <p className="mt-1 text-sm text-red-600">{errors.created}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/tickets")}
              className="cursor-pointer rounded-lg border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-stone-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`rounded-xl px-5 py-3 text-sm font-semibold text-white shadow transition ${
                loading
                  ? "cursor-not-allowed bg-slate-300"
                  : "cursor-pointer bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {loading ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </section>
    </MainLayout>
  );
};

export default CreateTicketPage;
