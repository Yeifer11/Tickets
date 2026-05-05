import { Link } from "react-router-dom";
import SplineScene from "./SplineScene";

const HomePage = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-stone-50 text-slate-950">
      <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-stone-200 px-6 py-6 lg:px-16">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white shadow-sm">
            OF
          </div>
          <span className="text-xl font-bold">OpsFlow</span>
        </div>

        <nav className="hidden items-center gap-10 text-sm font-medium text-slate-500 lg:flex">
          <a className="text-slate-950" href="#">
            Home
          </a>
          <a className="transition hover:text-slate-950" href="#">
            Projects
          </a>
          <a className="transition hover:text-slate-950" href="#">
            About
          </a>
          <a className="transition hover:text-slate-950" href="#">
            Skills
          </a>
          <a className="transition hover:text-slate-950" href="#">
            Contact
          </a>
        </nav>

        <button className="hidden rounded-lg border border-stone-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950 lg:block">
          Download CV
        </button>
      </header>

      <main className="relative mx-auto grid min-h-[calc(100vh-210px)] max-w-7xl grid-cols-1 items-center justify-items-center gap-10 px-6 py-8 lg:grid-cols-2 lg:px-16">
        <section className="relative z-10 flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
          <span className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            Featured Project
          </span>

          <h1 className="mt-8 max-w-2xl text-5xl font-extrabold leading-tight text-slate-950 md:text-6xl">
            Ticket Management Platform
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
            A web platform to create, assign, prioritize and track support
            tickets from one operational workspace.
          </p>

          <div className="mt-8 grid max-w-md gap-4 text-left">
            {[
              "Create and manage tickets",
              "Assign agents and priorities",
              "Track status changes",
              "Add comments and history",
              "Visual dashboard for operations",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-slate-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-slate-700">
                  OK
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="relative z-10 flex w-full flex-col items-center justify-center">
          <SplineScene />

          <div className="mt-6 flex w-full max-w-md flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="flex-1 rounded-lg bg-slate-900 px-7 py-4 text-center text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              View Project
            </Link>

            <a
              href="https://github.com/salavarrietasol/opsflow.git"
              className="flex-1 rounded-lg border border-stone-300 bg-white px-7 py-4 text-center text-sm font-bold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
            >
              View Code
            </a>
          </div>
        </section>
      </main>

      <footer className="mx-auto hidden max-w-7xl border-t border-stone-200 px-16 py-4 lg:block">
        <div className="grid grid-cols-4 gap-5 text-center">
          <FooterItem title="Create tickets" text="Fast and simple flow." />
          <FooterItem title="Assign agents" text="Organize team work." />
          <FooterItem title="Track progress" text="Monitor every status." />
          <FooterItem title="Close tasks" text="Resolve with control." />
        </div>
      </footer>
    </div>
  );
};

const FooterItem = ({ title, text }: { title: string; text: string }) => {
  return (
    <div>
      <h3 className="font-bold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
};

export default HomePage;
