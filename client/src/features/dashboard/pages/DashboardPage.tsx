import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/feedback/RequestState";

type Metric = {
  title: string;
  value: string;
  change: string;
};

const dashboardMetrics: Metric[] = [
  { title: "Active Workflows", value: "1,284", change: "+12.5%" },
  { title: "Throughput", value: "94.2k", change: "stable" },
  { title: "Open Tickets", value: "142", change: "-8.2%" },
  { title: "Avg Response", value: "2.4m", change: "-1.6%" },
];

const ticketTrend = [30, 50, 80, 95, 75, 55, 45];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const recentActivity = [
  "Server cluster alignment deployed successfully",
  "Anomaly detected in workflow latency",
  "New team access granted",
  "Weekly report ready",
];

const DashboardPage = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(() => {
    try {
      setLoading(true);
      setError("");
      setMetrics(dashboardMetrics);
      setActivities(recentActivity);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <MainLayout>
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Dashboard</p>
          <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time operational health and performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/tickets"
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-stone-50 hover:text-slate-900"
          >
            View Tickets
          </Link>

          <Link
            to="/tickets/create"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Create Ticket
          </Link>
        </div>
      </header>

      {loading && <LoadingState message="Loading dashboard..." />}

      {!loading && error && (
        <ErrorState message={error} actionLabel="Retry" onAction={loadDashboard} />
      )}

      {!loading && !error && metrics.length === 0 && (
        <EmptyState
          title="No dashboard data"
          description="Metrics will appear here once data is available."
        />
      )}

      {!loading && !error && metrics.length > 0 && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.title}
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-slate-500">{metric.title}</p>
                <h3 className="mt-3 text-3xl font-bold text-slate-900">
                  {metric.value}
                </h3>
                <p className="mt-2 text-sm font-medium text-teal-700">{metric.change}</p>
              </div>
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Tickets Trend
                </h2>
                <p className="text-sm text-slate-500">
                  Volume analysis for the current period
                </p>
              </div>

              <div className="flex h-72 items-end justify-between gap-3 rounded-lg bg-stone-50 p-6">
                {ticketTrend.map((height, index) => (
                  <div
                    key={weekDays[index]}
                    className="flex flex-1 flex-col items-center gap-3"
                  >
                    <div
                      className="w-full max-w-[42px] rounded-t-lg bg-teal-700/80"
                      style={{ height: `${height * 2}px` }}
                    />
                    <span className="text-xs text-slate-400">
                      {weekDays[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </h2>
                <button type="button" className="text-sm font-medium text-teal-700 hover:text-teal-900">
                  View all
                </button>
              </div>

              {activities.length === 0 ? (
                <p className="rounded-lg bg-stone-50 p-4 text-sm text-slate-600">
                  No recent activity available.
                </p>
              ) : (
                <div className="space-y-4">
                  {activities.map((item) => (
                    <div key={item} className="rounded-lg bg-stone-50 p-4">
                      <p className="text-sm font-medium text-slate-800">{item}</p>
                      <p className="mt-1 text-xs text-slate-400">2h ago</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </MainLayout>
  );
};

export default DashboardPage;
