import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-slate-900 shadow-xl shadow-slate-200/70">
        <Link
          to="/"
          className="mb-6 inline-block text-sm font-bold text-slate-600 hover:text-slate-950"
        >
          {"<-"} Back to home
        </Link>

        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
            OF
          </div>

          <h1 className="text-4xl font-extrabold text-slate-950">OpsFlow</h1>

          <p className="mt-3 text-sm font-semibold text-slate-500">
            Welcome back
          </p>
          <p className="text-sm text-slate-400">
            Access your operational workspace
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">
              Email address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
                Password
              </label>
              <button
                type="button"
                className="text-xs font-bold text-slate-600 hover:text-slate-950"
              >
                Forgot password?
              </button>
            </div>

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-stone-200"
            />
          </div>

          <Link
            to="/dashboard"
            className="block w-full rounded-xl bg-slate-900 px-5 py-4 text-center text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            Sign in
          </Link>
        </form>

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-stone-200" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            or continue with
          </span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.assign(`${API_BASE_URL}/auth/google`);
          }}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-stone-50"
        >
          <span className="text-lg">G</span>
          Continue with Google
        </button>

        <p className="mt-7 text-center text-sm font-medium text-slate-400">
          Do not have an account?{" "}
          <span className="font-bold text-slate-700">Request access</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
