import React, { useState } from "react";
import { useAuthStore } from "../shared/stores/useAuthStore";
import { useNavigate, Navigate } from "react-router-dom";
import { SignUpForm } from "../features/signup";

const NLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-2xl",
  };
  return (
    <div
      className={`${sizes[size]} rounded-xl bg-accent-primary text-white font-extrabold flex items-center justify-center shadow-md shrink-0`}
    >
      N
    </div>
  );
};

const CheckIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-accent-primary shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export const Login: React.FC = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorText("Invalid credentials. Please try again.");
    }
  };

  const features = [
    "Get a fast pulse on your dietary goals — no digging needed.",
    "Meal plans grounded in reality, not just optimism.",
    "Bring groceries, prep, and cooking into one view.",
    "More visibility, less food waste.",
  ];

  return (
    <div className="h-screen w-full flex overflow-hidden font-sans">
      {/* ── Left Panel (desktop only) ──────────────────────────────────── */}
      <div className="hidden md:flex w-[42%] lg:w-[38%] bg-bg-sidebar flex-col shrink-0 relative overflow-hidden">
        {/* Logo row */}
        <div className="flex items-center gap-3 px-10 pt-8">
          <NLogo size="sm" />
          <span className="text-xl font-bold text-text-sidebar-active tracking-tight">
            Neubite
          </span>
        </div>

        {/* Centred content */}
        <div className="flex-1 flex flex-col justify-center px-10 pb-4">
          <h1 className="text-[2.4rem] font-bold text-text-sidebar-active leading-tight tracking-tight mb-8">
            Meals that <br />
            <span className="text-accent-primary">Drive Health.</span>
          </h1>

          <ul className="space-y-4">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-md bg-accent-primary/15 flex items-center justify-center shrink-0">
                  <CheckIcon />
                </div>
                <span className="text-sm text-text-sidebar leading-relaxed">
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-10 pb-8">
          <p className="text-xs text-text-sidebar opacity-50">
            © Neubite Ltd. 2026
          </p>
        </div>

        {/* Subtle glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 15%, rgba(209,73,37,0.14) 0%, transparent 55%)",
          }}
        />
      </div>

      {/* ── Right Panel ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-bg-secondary">
        {/* Mobile: branded header block — replaces the awkward absolute strip */}
        <div className="md:hidden bg-bg-sidebar rounded-b-[2rem] shrink-0 relative overflow-hidden">
          {/* Fills the space behind the status bar / Dynamic Island */}
          <div style={{ height: "max(env(safe-area-inset-top), 50px)" }} />
          <div className="px-6 pt-5 pb-8">
            <div className="flex items-center gap-3 mb-5">
              <NLogo size="md" />
              <span className="text-xl font-bold text-text-sidebar-active tracking-tight">
                Neubite
              </span>
            </div>
            <h1 className="text-[1.75rem] font-bold text-text-sidebar-active leading-snug">
              Meals that{" "}
              <span className="text-accent-primary">Drive Health.</span>
            </h1>
            <p className="mt-2 text-sm text-text-sidebar">
              Track your pantry. Cook smarter.
            </p>
            {/* Subtle glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 90% 10%, rgba(209,73,37,0.18) 0%, transparent 60%)",
              }}
            />
          </div>
        </div>

        {/* Form area — scrollable, top-anchored on mobile, centered on desktop */}
        <div className="flex-1 flex flex-col items-center justify-start md:justify-center px-6 py-8 md:p-6">
          <div className="w-full max-w-[380px]">
            {/* On mobile: no card wrapper — form sits directly on the warm bg.
                On desktop: white card matches the original layout. */}
            <div className="md:bg-bg-primary md:rounded-2xl md:p-10">
              {isSignUpOpen ? (
                <SignUpForm onToggleToLogin={() => setIsSignUpOpen(false)} />
              ) : (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-extrabold text-text-primary mb-1.5">
                      Welcome back
                    </h2>
                    <p className="text-sm text-text-secondary">
                      Don't have an account?{" "}
                      <button
                        onClick={() => setIsSignUpOpen(true)}
                        className="text-accent-primary hover:text-accent-hover font-semibold transition-colors"
                      >
                        Sign up now
                      </button>
                    </p>
                  </div>

                  {/* Form */}
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    {errorText && (
                      <div className="px-4 py-3 rounded-xl bg-status-error/10 border border-status-error/20 text-sm text-status-error text-center">
                        {errorText}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-text-primary">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDD9D4] bg-bg-primary text-base text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-text-primary">
                        Password
                      </label>
                      <input
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDD9D4] bg-bg-primary text-base text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-3.5 rounded-xl text-base font-bold text-white bg-accent-primary hover:bg-accent-hover disabled:opacity-60 transition-colors shadow-sm"
                    >
                      {isLoading ? "Signing in…" : "Sign in"}
                    </button>

                    <p className="pt-2 text-xs text-text-secondary opacity-50 text-center">
                      Terms of Service &amp; Privacy Policy
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
