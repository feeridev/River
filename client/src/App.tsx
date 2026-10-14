
import { useCallback, useEffect, useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Setup from "./Setup";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type LoginResponse = {
  message: string;
  token: string;
  user: User;
};

type SetupStatus = "checking" | "required" | "complete" | "error";

const TOKEN_KEY = "river_token";
const USER_KEY = "river_user";

function readStoredUser(): User | null {
  try {
    const value = localStorage.getItem(USER_KEY);
    return value ? (JSON.parse(value) as User) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY),
  );
  const [user, setUser] = useState<User | null>(readStoredUser);
  const [checkingSession, setCheckingSession] = useState(true);
  const [setupStatus, setSetupStatus] = useState<SetupStatus>("checking");
  const [setupRetry, setSetupRetry] = useState(0);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const savedToken = localStorage.getItem(TOKEN_KEY);

      if (!savedToken) {
        if (!cancelled) setCheckingSession(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${savedToken}` },
        });

        if (!response.ok) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          if (!cancelled) {
            setToken(null);
            setUser(null);
          }
        }
      } catch {
        // Preserve the current session if the API is temporarily unavailable.
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    }

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkSetup() {
      setSetupStatus("checking");

      try {
        const response = await fetch("/api/auth/setup-status");
        if (!response.ok) {
          throw new Error("Could not check River setup status.");
        }

        const result = (await response.json()) as {
          setupRequired?: boolean;
        };

        if (typeof result.setupRequired !== "boolean") {
          throw new Error("Unexpected setup status response.");
        }

        if (!cancelled) {
          setSetupStatus(result.setupRequired ? "required" : "complete");
        }
      } catch {
        if (!cancelled) setSetupStatus("error");
      }
    }

    void checkSetup();

    return () => {
      cancelled = true;
    };
  }, [setupRetry]);

  async function handleLogin(email: string, password: string) {
    let response: Response;

    try {
      response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      throw new Error(
        "Cannot reach River's API. Check that the backend is running.",
      );
    }

    const result = (await response.json().catch(() => ({}))) as
      Partial<LoginResponse> & { message?: string };

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Incorrect email or password. Please try again.");
      }
      if (response.status === 403) {
        throw new Error("This account is inactive. Contact your administrator.");
      }
      throw new Error(result.message || "Sign-in failed. Please try again.");
    }

    if (!result.token || !result.user) {
      throw new Error("The server returned an unexpected login response.");
    }

    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    setUser(result.user);
    setToken(result.token);
  }

  if (checkingSession) {
    return (
      <div className="app-loading">
        <span className="app-loading-mark">〰</span>
        <span>Loading River...</span>
      </div>
    );
  }

  if (token && user) {
    return (
      <div className="authenticated-app">
        <Dashboard />
        <button
          type="button"
          className="session-logout"
          onClick={logout}
          title="Sign out of River"
        >
          Sign out
        </button>
      </div>
    );
  }

  if (setupStatus === "checking") {
    return (
      <div className="app-loading">
        <span className="app-loading-mark">〰</span>
        <span>Checking River setup...</span>
      </div>
    );
  }

  if (setupStatus === "error") {
    return (
      <main className="setup-unavailable">
        <h1>River couldn't check its setup status.</h1>
        <p>
          Check that the River API is running and try again. No account has
          been created by this check.
        </p>
        <button
          type="button"
          className="login-submit"
          onClick={() => setSetupRetry((value) => value + 1)}
        >
          Retry
        </button>
      </main>
    );
  }

  if (setupStatus === "required") {
    return <Setup onComplete={() => setSetupStatus("complete")} />;
  }

  return <Login onLogin={handleLogin} />;
}
