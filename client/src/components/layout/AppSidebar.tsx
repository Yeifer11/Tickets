import { NavLink, Link } from "react-router-dom";

const linkBaseClass =
  "block w-full rounded-lg px-4 py-3 text-left text-sm transition";

const getNavClass = ({ isActive }: { isActive: boolean }) =>
  `${linkBaseClass} ${
    isActive
      ? "bg-slate-900 font-semibold text-white"
      : "text-slate-600 hover:bg-stone-100 hover:text-slate-900"
  }`;

const AppSidebar = () => {
  return (
    <aside className="hidden w-64 border-r border-stone-200 bg-white lg:flex lg:flex-col">
      <Link to="/" className="border-b border-stone-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white shadow-sm">
            OF
          </div>
          <span className="text-xl font-bold text-slate-950">OpsFlow</span>
        </div>
      </Link>

      <nav className="flex-1 space-y-2 px-4 py-6">
        <NavLink to="/dashboard" className={getNavClass}>
          Overview
        </NavLink>

        <NavLink to="/tickets" className={getNavClass}>
          Tickets
        </NavLink>

        <button className="block w-full rounded-lg px-4 py-3 text-left text-sm text-slate-600 hover:bg-stone-100 hover:text-slate-900">
          Inventory
        </button>

        <button className="block w-full rounded-lg px-4 py-3 text-left text-sm text-slate-600 hover:bg-stone-100 hover:text-slate-900">
          Reports
        </button>

        <button className="block w-full rounded-lg px-4 py-3 text-left text-sm text-slate-600 hover:bg-stone-100 hover:text-slate-900">
          Settings
        </button>
      </nav>

      <div className="p-4">
        <button className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
          + New Workflow
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
