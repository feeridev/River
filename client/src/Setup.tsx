import { useState, type FormEvent } from "react";
import { ArrowRight, ShieldCheck, Waves } from "lucide-react";
import "./Login.css";
import "./Setup.css";

type SetupProps = {
  onComplete: () => void;
};

export default function Setup({ onComplete }: SetupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 12) {
      setError("Your password must contain at least 12 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.message || "Administrator setup failed. Please try again.",
        );
      }

      setCreated(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to River's API.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <a className="login-brand" href="#" aria-label="River home">
          <span className="login-brand-mark"><Waves size={25} /></span>
          <span>river<small>HELPDESK</small></span>
        </a>

        <div className="brand-message">
          <span className="brand-eyebrow">YOUR WORKSPACE STARTS HERE</span>
          <h1>Set up your team's support workspace.</h1>
          <p>
            Create the first administrator account to manage users,
            assign tickets, and configure your River workspace.
          </p>

          <div className="brand-feature">
            <span><ShieldCheck size={19} /></span>
            <div>
              <strong>One-time initialization</strong>
              <small>Only the first administrator can be created here.</small>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          <span className="brand-footer-dot" />
          Built for teams that keep things moving
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          <div className="mobile-brand">
            <span className="login-brand-mark"><Waves size={23} /></span>
            <strong>river</strong>
          </div>

          {created ? (
            <div className="setup-complete">
              <span className="setup-complete-icon">
                <ShieldCheck size={28} />
              </span>
              <span className="form-eyebrow">SETUP COMPLETE</span>
              <h2>You're ready to sign in.</h2>
              <p className="form-subtitle">
                Your administrator account has been created. Sign in with
                the email address and password you just registered.
              </p>
              <button
                className="login-submit"
                type="button"
                onClick={onComplete}
              >
                Continue to sign in <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <>
              <span className="form-eyebrow">INITIAL SETUP</span>
              <h2>Create your administrator</h2>
              <p className="form-subtitle">
                This account will manage users, agents, and tickets.
              </p>

              <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="setup-name">Full name</label>
                <input
                  id="setup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  minLength={2}
                  maxLength={80}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />

                <label htmlFor="setup-email">Email address</label>
                <input
                  id="setup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />

                <label htmlFor="setup-password">Password</label>
                <input
                  id="setup-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 12 characters"
                  minLength={12}
                  maxLength={72}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <label htmlFor="setup-confirm-password">
                  Confirm password
                </label>
                <input
                  id="setup-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  minLength={12}
                  maxLength={72}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />

                {error && (
                  <div className="login-error" role="alert">{error}</div>
                )}

                <button
                  className="login-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating administrator..." : "Create administrator"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <p className="login-security">
                <ShieldCheck size={15} />
                Your password is securely hashed by the River server.
              </p>
            </>
          )}
        </div>

        <footer className="login-copyright">
          © {new Date().getFullYear()} River Helpdesk
        </footer>
      </section>
    </main>
  );
}
