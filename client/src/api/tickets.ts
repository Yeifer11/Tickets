import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/tickets";
const hasConfiguredApi = Boolean(import.meta.env.VITE_API_URL);
const STORAGE_KEY = "opsflow:tickets";

export type TicketPayload = {
  title: string;
  description: string;
  status?: string;
  priority: string;
  assignee: string;
  created: string;
};

export type Ticket = Required<TicketPayload> & {
  id: string;
};

const demoTickets: Ticket[] = [
  {
    id: "OPS-1001",
    title: "Review onboarding workflow",
    description:
      "Audit the current support intake flow and identify missing ownership steps.",
    status: "OPEN",
    priority: "Medium",
    assignee: "Sarah Chen",
    created: "2026-05-08",
  },
  {
    id: "OPS-1002",
    title: "Resolve dashboard latency",
    description:
      "Investigate slow loading metrics in the operations dashboard during peak hours.",
    status: "IN PROGRESS",
    priority: "High",
    assignee: "Marcus K.",
    created: "2026-05-09",
  },
  {
    id: "OPS-1003",
    title: "Close archived request queue",
    description:
      "Validate resolved tickets and close stale operational requests from last sprint.",
    status: "RESOLVED",
    priority: "Low",
    assignee: "Alex Rivera",
    created: "2026-05-10",
  },
];

const shouldPreferLocalStore = () =>
  !hasConfiguredApi &&
  typeof window !== "undefined" &&
  window.location.hostname.endsWith("github.io");

const readStoredTickets = () => {
  const storedTickets = window.localStorage.getItem(STORAGE_KEY);

  if (!storedTickets) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTickets));
    return demoTickets;
  }

  try {
    return JSON.parse(storedTickets) as Ticket[];
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTickets));
    return demoTickets;
  }
};

const saveStoredTickets = (tickets: Ticket[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};

const runWithFallback = async <T>(
  apiRequest: () => Promise<T>,
  localRequest: () => T,
) => {
  if (shouldPreferLocalStore()) {
    return localRequest();
  }

  try {
    return await apiRequest();
  } catch (error) {
    console.warn("Ticket API unavailable, using local browser data.", error);
    return localRequest();
  }
};

export const getTickets = async () =>
  runWithFallback(
    async () => {
      const response = await axios.get<Ticket[]>(API_URL);
      return response.data;
    },
    () => readStoredTickets(),
  );

export const getTicketById = async (id: string) =>
  runWithFallback(
    async () => {
      const response = await axios.get<Ticket>(`${API_URL}/${id}`);
      return response.data;
    },
    () => {
      const ticket = readStoredTickets().find((item) => item.id === id);

      if (!ticket) {
        throw new Error("Ticket not found");
      }

      return ticket;
    },
  );

export const createTicket = async (ticketData: TicketPayload) =>
  runWithFallback(
    async () => {
      const response = await axios.post<Ticket>(API_URL, ticketData);
      return response.data;
    },
    () => {
      const newTicket: Ticket = {
        id: `OPS-${Date.now()}`,
        title: ticketData.title,
        description: ticketData.description,
        status: ticketData.status ?? "OPEN",
        priority: ticketData.priority,
        assignee: ticketData.assignee,
        created: ticketData.created,
      };
      const tickets = [newTicket, ...readStoredTickets()];
      saveStoredTickets(tickets);

      return newTicket;
    },
  );

export const updateTicket = async (id: string, ticketData: TicketPayload) =>
  runWithFallback(
    async () => {
      const response = await axios.put<Ticket>(`${API_URL}/${id}`, ticketData);
      return response.data;
    },
    () => {
      const tickets = readStoredTickets();
      const ticketIndex = tickets.findIndex((ticket) => ticket.id === id);

      if (ticketIndex === -1) {
        throw new Error("Ticket not found");
      }

      const updatedTicket: Ticket = {
        ...tickets[ticketIndex],
        title: ticketData.title,
        description: ticketData.description,
        status: ticketData.status ?? tickets[ticketIndex].status,
        priority: ticketData.priority,
        assignee: ticketData.assignee,
        created: ticketData.created,
      };

      tickets[ticketIndex] = updatedTicket;
      saveStoredTickets(tickets);

      return updatedTicket;
    },
  );

export const deleteTicket = async (id: string) =>
  runWithFallback(
    async () => {
      await axios.delete(`${API_URL}/${id}`);
    },
    () => {
      const tickets = readStoredTickets();
      saveStoredTickets(tickets.filter((ticket) => ticket.id !== id));
    },
  );
