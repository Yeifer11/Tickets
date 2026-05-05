import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/feedback/RequestState";
import { deleteTicket, getTicketById } from "../../../api/tickets";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  created: string;
};

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [copied, setCopied] = useState(false);

  const loadTicket = useCallback(async () => {
    if (!id) {
      setTicket(null);
      setError("Invalid ticket ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data: Ticket = await getTicketById(id);
      setTicket(data);
    } catch (error) {
      console.error("Error loading ticket:", error);
      setTicket(null);
      setError("Unable to load this ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const handleDelete = async () => {
    if (!ticket || deleteLoading) return;

    const isMatch =
      deleteConfirmation.trim().toLowerCase() === ticket.id.trim().toLowerCase();

    if (!isMatch) return;

    try {
      setDeleteLoading(true);
      setDeleteError("");
      await deleteTicket(ticket.id);
      navigate("/tickets");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setDeleteError("Unable to delete this ticket. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCopyTicketId = async () => {
    if (!ticket) return;

    try {
      await navigator.clipboard.writeText(ticket.id);
      setCopied(true);
    } catch (error) {
      console.error("Error copying ticket ID:", error);
      setDeleteError("Unable to copy the ticket ID.");
    }
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setShowDeleteModal(false);
    setDeleteConfirmation("");
    setDeleteError("");
    setCopied(false);
  };

  const deleteIsConfirmed =
    ticket !== null &&
    deleteConfirmation.trim().toLowerCase() === ticket.id.trim().toLowerCase();

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading ticket..." />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorState message={error} actionLabel="Retry" onAction={loadTicket} />
      </MainLayout>
    );
  }

  if (!ticket) {
    return (
      <MainLayout>
        <EmptyState
          title="Ticket not found"
          description="This ticket does not exist or may have been removed."
          action={
            <Link
              to="/tickets"
              className="inline-flex rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Back to Tickets
            </Link>
          }
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Link
            to="/tickets"
            className="mb-3 inline-block text-sm font-medium text-teal-700 hover:underline"
          >
            {"<-"} Back to Tickets
          </Link>

          <p className="text-sm text-slate-500">Ticket Details</p>
          <h1 className="text-3xl font-bold text-slate-900">
            {ticket.id} - {ticket.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review current ticket information, ownership, and discussion history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            {ticket.status}
          </span>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            {ticket.priority}
          </span>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="space-y-6 xl:col-span-2">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {ticket.description}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Assignee
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {ticket.assignee}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {ticket.status}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Priority
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {ticket.priority}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Created
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {ticket.created}
                </p>
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
                className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                type="button"
                onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
              >
                Update Ticket
              </button>
              <button className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-stone-50 hover:text-slate-900">
                Reassign Ticket
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(true);
                  setDeleteError("");
                }}
                className="w-full rounded-xl border border-slate-200 bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Ticket
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

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-bold text-slate-900">
                Delete ticket
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                This action cannot be undone. To confirm, type the ticket ID:
              </p>

              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="break-all text-sm font-semibold text-slate-800">
                  {ticket.id}
                </span>

                <button
                  type="button"
                  onClick={handleCopyTicketId}
                  disabled={deleteLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {deleteError && (
                <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {deleteError}
                </p>
              )}

              <input
                type="text"
                value={deleteConfirmation}
                onChange={(event) => {
                  setDeleteConfirmation(event.target.value);
                  setDeleteError("");
                }}
                disabled={deleteLoading}
                placeholder="Type the ticket ID"
                className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 disabled:cursor-not-allowed disabled:bg-slate-100"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!deleteIsConfirmed || deleteLoading}
                  onClick={handleDelete}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                    !deleteIsConfirmed || deleteLoading
                      ? "cursor-not-allowed bg-red-300"
                      : "cursor-pointer bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {deleteLoading ? "Deleting..." : "Delete ticket"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TicketDetailPage;
