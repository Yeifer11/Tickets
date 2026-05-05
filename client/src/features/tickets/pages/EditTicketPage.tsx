import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import {
  ErrorState,
  LoadingState,
} from "../../../components/feedback/RequestState";
import { getTicketById, updateTicket } from "../../../api/tickets";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  created: string;
};

type TicketForm = Omit<Ticket, "id">;

const emptyForm: TicketForm = {
  title: "",
  description: "",
  status: "OPEN",
  priority: "",
  assignee: "",
  created: "",
};

const statusOptions = ["OPEN", "IN PROGRESS", "RESOLVED", "CLOSED"];
const priorityOptions = ["Urgent", "High", "Medium", "Low"];
const assigneeOptions = ["Sarah Chen", "Marcus K.", "Alex Rivera", "Lila Thorne"];

const EditTicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketId, setTicketId] = useState("");
  const [form, setForm] = useState<TicketForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  const loadTicket = useCallback(async () => {
    if (!id) {
      setLoadError("Invalid ticket ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadError("");
      const ticket: Ticket = await getTicketById(id);
      setTicketId(ticket.id);
      setForm({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assignee: ticket.assignee,
        created: ticket.created,
      });
    } catch (error) {
      console.error("Error loading ticket:", error);
      setLoadError("Unable to load this ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const updateField = (field: keyof TicketForm, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
    setSaveError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || saving) return;

    try {
      setSaving(true);
      setSaveError("");
      const updatedTicket: Ticket = await updateTicket(id, form);
      navigate(`/tickets/${updatedTicket.id}`);
    } catch (error) {
      console.error("Error updating ticket:", error);
      setSaveError("Unable to save the ticket changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading ticket..." />
      </MainLayout>
    );
  }

  if (loadError) {
    return (
      <MainLayout>
        <ErrorState message={loadError} actionLabel="Retry" onAction={loadTicket} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <form onSubmit={handleSubmit}>
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Link
              to={ticketId ? `/tickets/${ticketId}` : "/tickets"}
              className="mb-3 inline-block text-sm font-medium text-teal-700 hover:underline"
            >
              {"<-"} Back to Ticket
            </Link>

            <p className="text-sm text-slate-500">Edit Ticket</p>
            <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center">
              <span className="text-3xl font-bold text-slate-900">
                {ticketId}
              </span>
              <input
                type="text"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                disabled={saving}
                className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-2xl font-bold text-slate-900 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="Ticket title"
                required
              />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Update ticket information, ownership, priority, and workflow status.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              disabled={saving}
              className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 outline-none focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={form.priority}
              onChange={(event) => updateField("priority", event.target.value)}
              disabled={saving}
              className="rounded-full border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 outline-none focus:border-red-300 disabled:cursor-not-allowed disabled:opacity-70"
              required
            >
              <option value="">Priority</option>
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </header>

        {saveError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {saveError}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="space-y-6 xl:col-span-2">
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Overview</h2>

              <textarea
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                disabled={saving}
                rows={8}
                className="mt-4 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-7 text-slate-600 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="Describe the issue, request, or workflow need..."
                required
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Assignee
                  </label>
                  <select
                    value={form.assignee}
                    onChange={(event) => updateField("assignee", event.target.value)}
                    disabled={saving}
                    className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                    required
                  >
                    <option value="">Select assignee</option>
                    {assigneeOptions.map((assignee) => (
                      <option key={assignee} value={assignee}>
                        {assignee}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(event) => updateField("status", event.target.value)}
                    disabled={saving}
                    className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(event) => updateField("priority", event.target.value)}
                    disabled={saving}
                    className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                    required
                  >
                    <option value="">Select priority</option>
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Created
                  </label>
                  <input
                    type="date"
                    value={form.created}
                    onChange={(event) => updateField("created", event.target.value)}
                    disabled={saving}
                    className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Comments</h2>
                <span className="text-sm text-slate-400">Coming soon</span>
              </div>

              <div className="rounded-lg bg-stone-50 p-4">
                <p className="text-sm text-slate-600">
                  Comments will be connected in the next backend iteration.
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Actions</h2>

              <div className="mt-4 space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow ${
                    saving
                      ? "cursor-not-allowed bg-slate-300"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => navigate(ticketId ? `/tickets/${ticketId}` : "/tickets")}
                  className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-stone-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Activity</h2>

              <div className="mt-4 rounded-lg bg-stone-50 p-4">
                <p className="text-sm text-slate-600">
                  Activity timeline will be connected in the next backend iteration.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </MainLayout>
  );
};

export default EditTicketPage;
