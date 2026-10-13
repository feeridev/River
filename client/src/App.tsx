import { useCallback, useEffect, useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

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
        // Keep the session while the API is temporarily unreachable.
        // The next API request will report any connection problem.
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    }

    void checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

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

  if (!token || !user) {
    return <Login onLogin={handleLogin} />;
  }

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
