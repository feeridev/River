import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Waves, ArrowRight, ShieldCheck } from "lucide-react";
import "./Login.css";

type LoginProps = {
  onLogin: (email: string, password: string) => Promise<void>;
};

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
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
          <span className="brand-eyebrow">SUPPORT, SIMPLIFIED</span>
          <h1>Great support starts with a better flow.</h1>
          <p>
            One workspace for your team to manage requests,
            solve problems, and keep work moving.
          </p>

          <div className="brand-feature">
            <span><ShieldCheck size={19} /></span>
            <div>
              <strong>Your workspace, protected</strong>
              <small>Secure access for your support team.</small>
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

          <span className="form-eyebrow">WELCOME BACK</span>
          <h2>Sign in to River</h2>
          <p className="form-subtitle">
            Enter your account details to access your workspace.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <div className="password-label-row">
              <label htmlFor="password">Password</label>
            </div>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="login-error" role="alert">{error}</div>
            )}

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="login-security">
            <ShieldCheck size={15} />
            Your connection is handled by your River server.
          </p>
          <p className="login-help">
            Need access? Contact your workspace administrator.
          </p>
        </div>

        <footer className="login-copyright">
          © {new Date().getFullYear()} River Helpdesk
        </footer>
      </section>
    </main>
  );
}
