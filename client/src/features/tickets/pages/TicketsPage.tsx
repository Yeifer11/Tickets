import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/feedback/RequestState";
import { getTickets } from "../../../api/tickets";

const statusClasses: Record<string, string> = {
  "IN PROGRESS": "bg-amber-50 text-amber-700",
  OPEN: "bg-stone-100 text-slate-700",
  RESOLVED: "bg-teal-50 text-teal-700",
  CLOSED: "bg-slate-200 text-slate-700",
};

const priorityClasses: Record<string, string> = {
  Urgent: "text-red-700",
  High: "text-amber-700",
  Medium: "text-teal-700",
  Low: "text-slate-500",
};

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  created: string;
};

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [assigneeFilter, setAssigneeFilter] = useState("All Assignees");

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data: Ticket[] = await getTickets();
      setTickets(data);
    } catch (error) {
      console.error("Error loading tickets:", error);
      setError("Unable to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const statusOptions = useMemo(
    () => ["All Status", ...Array.from(new Set(tickets.map((ticket) => ticket.status)))],
    [tickets],
  );

  const priorityOptions = useMemo(
    () => [
      "All Priority",
      ...Array.from(new Set(tickets.map((ticket) => ticket.priority))),
    ],
    [tickets],
  );

  const assigneeOptions = useMemo(
    () => [
      "All Assignees",
      ...Array.from(new Set(tickets.map((ticket) => ticket.assignee))),
    ],
    [tickets],
  );

  const filteredTickets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !normalizedSearch ||
        ticket.id.toLowerCase().includes(normalizedSearch) ||
        ticket.title.toLowerCase().includes(normalizedSearch) ||
        ticket.assignee.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All Status" || ticket.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All Priority" || ticket.priority === priorityFilter;
      const matchesAssignee =
        assigneeFilter === "All Assignees" || ticket.assignee === assigneeFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [assigneeFilter, priorityFilter, search, statusFilter, tickets]);

  return (
    <MainLayout>
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Tickets</p>
          <h1 className="text-3xl font-bold text-slate-900">Ticket Backlog</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and orchestrate operational requests across departments.
          </p>
        </div>

        <Link
          to="/tickets/create"
          className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          + Create Ticket
        </Link>
      </header>

      {loading && <LoadingState message="Loading tickets..." />}

      {!loading && error && (
        <ErrorState message={error} actionLabel="Retry" onAction={loadTickets} />
      )}

      {!loading && !error && (
        <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 xl:flex-row">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tickets, IDs, or assignees..."
              className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-slate-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-slate-500"
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            <select
              value={assigneeFilter}
              onChange={(event) => setAssigneeFilter(event.target.value)}
              className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-slate-500"
            >
              {assigneeOptions.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>

          {filteredTickets.length === 0 ? (
            <EmptyState
              title="No tickets found"
              description="Try changing the filters or create a new ticket."
              action={
                <Link
                  to="/tickets/create"
                  className="inline-flex rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  + Create Ticket
                </Link>
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-4">ID</th>
                      <th className="px-4">Title</th>
                      <th className="px-4">Status</th>
                      <th className="px-4">Priority</th>
                      <th className="px-4">Assignee</th>
                      <th className="px-4">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="rounded-xl bg-stone-50">
                        <td className="rounded-l-lg px-4 py-4 text-sm font-semibold text-teal-700">
                          {ticket.id}
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="text-sm font-semibold text-slate-900 hover:text-teal-700 hover:underline"
                          >
                            {ticket.title}
                          </Link>
                          <p className="mt-1 text-xs text-slate-400">
                            {ticket.description}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              statusClasses[ticket.status] ??
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-4 text-sm font-medium ${
                            priorityClasses[ticket.priority] ?? "text-slate-500"
                          }`}
                        >
                          {ticket.priority}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-700">
                          {ticket.assignee}
                        </td>
                        <td className="rounded-r-lg px-4 py-4 text-sm text-slate-500">
                          {ticket.created}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                <p>
                  Showing {filteredTickets.length} of {tickets.length} tickets
                </p>
              </div>
            </>
          )}
        </section>
      )}
    </MainLayout>
  );
};

export default TicketsPage;
