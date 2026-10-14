import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import "./UserManagement.css";

type ManagedRole = "EMPLOYEE" | "AGENT" | "ADMIN";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: ManagedRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
};

const TOKEN_KEY = "river_token";

async function readError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.message || body.error || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";
}

export default function UserManagement() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const loadUsers = useCallback(async (showLoading = true) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoadError("Your session is missing. Please sign in again.");
      setLoading(false);
      return;
    }

    if (showLoading) setLoading(true);
    setLoadError("");

    try {
      const response = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(await readError(response));

      const payload = await response.json();
      const rows = Array.isArray(payload) ? payload : payload.users;

      setUsers(Array.isArray(rows) ? rows : []);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Could not load users.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) =>
      `${user.name} ${user.email} ${user.role} ${user.isActive ? "active" : "inactive"}`
        .toLowerCase()
        .includes(query),
    );
  }, [users, search]);

  const activeCount = users.filter((user) => user.isActive).length;
  const agentCount = users.filter((user) => user.role === "AGENT").length;
  const adminCount = users.filter((user) => user.role === "ADMIN").length;

  async function updateUser(
    user: ManagedUser,
    action: "role" | "status",
  ) {
    if (busyUserId) return;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setActionError("Your session is missing. Please sign in again.");
      return;
    }

    const nextRole =
      user.role === "AGENT" ? "EMPLOYEE" : "AGENT";
    const nextActive = !user.isActive;

    const confirmation =
      action === "role"
        ? `Change ${user.name}'s role to ${nextRole === "AGENT" ? "Agent" : "Employee"}?`
        : `${nextActive ? "Activate" : "Deactivate"} ${user.name}'s account?`;

    if (!window.confirm(confirmation)) return;

    setBusyUserId(user.id);
    setActionError("");
    setSuccess("");

    try {
      const response = await fetch(
        action === "role"
          ? `/api/users/${encodeURIComponent(user.id)}/role`
          : `/api/users/${encodeURIComponent(user.id)}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            action === "role"
              ? { role: nextRole }
              : { isActive: nextActive },
          ),
        },
      );

      if (!response.ok) throw new Error(await readError(response));

      const payload = await response.json();
      const updated = payload.user as ManagedUser | undefined;

      if (updated?.id) {
        setUsers((current) =>
          current.map((item) => item.id === updated.id ? updated : item),
        );
      } else {
        await loadUsers(false);
      }

      setSuccess(
        action === "role"
          ? `${user.name}'s role was updated.`
          : `${user.name}'s account was ${nextActive ? "activated" : "deactivated"}.`,
      );
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "The user could not be updated.",
      );
    } finally {
      setBusyUserId(null);
    }
  }

  return (
    <section className="river-users-page" aria-labelledby="river-users-title">
      <div className="river-users-heading">
        <div>
          <div className="river-users-eyebrow">
            <ShieldCheck size={15} />
            ADMINISTRATION
          </div>
          <h1 id="river-users-title">User management</h1>
          <p>Manage workspace accounts, roles, and access.</p>
        </div>

        <button
          type="button"
          className="river-users-refresh"
          onClick={() => void loadUsers()}
          disabled={loading || Boolean(busyUserId)}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="river-users-stats">
        <article>
          <span className="river-users-stat-icon"><Users size={18} /></span>
          <div><small>Total users</small><strong>{users.length}</strong></div>
        </article>
        <article>
          <span className="river-users-stat-icon active"><UserCheck size={18} /></span>
          <div><small>Active accounts</small><strong>{activeCount}</strong></div>
        </article>
        <article>
          <span className="river-users-stat-icon agent"><ShieldCheck size={18} /></span>
          <div><small>Agents</small><strong>{agentCount}</strong></div>
        </article>
        <article>
          <span className="river-users-stat-icon admin"><ShieldCheck size={18} /></span>
          <div><small>Administrators</small><strong>{adminCount}</strong></div>
        </article>
      </div>

      {success && (
        <div className="river-users-notice success" role="status">
          <CheckCircle2 size={17} />
          <span>{success}</span>
          <button type="button" onClick={() => setSuccess("")} aria-label="Dismiss success message">×</button>
        </div>
      )}

      {actionError && (
        <div className="river-users-notice error" role="alert">
          <AlertCircle size={17} />
          <span>{actionError}</span>
          <button type="button" onClick={() => setActionError("")} aria-label="Dismiss error message">×</button>
        </div>
      )}

      <div className="river-users-panel">
        <div className="river-users-toolbar">
          <div>
            <h2>Workspace users</h2>
            <p>{filteredUsers.length} {filteredUsers.length === 1 ? "account" : "accounts"}</p>
          </div>
          <label className="river-users-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search name, email, or role..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search users"
            />
          </label>
        </div>

        {loadError ? (
          <div className="river-users-state error">
            <AlertCircle size={23} />
            <h3>Couldn't load users</h3>
            <p>{loadError}</p>
            <button type="button" onClick={() => void loadUsers()}>Try again</button>
          </div>
        ) : loading ? (
          <div className="river-users-state">
            <LoaderCircle size={24} className="river-users-spin" />
            <p>Loading workspace users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="river-users-state">
            <Users size={24} />
            <h3>{search ? "No matching users" : "No users found"}</h3>
            <p>{search ? "Try another search term." : "Workspace accounts will appear here."}</p>
          </div>
        ) : (
          <div className="river-users-table-wrap">
            <table className="river-users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Account status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const busy = busyUserId === user.id;
                  const isAdmin = user.role === "ADMIN";

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="river-users-person">
                          <span className="river-users-avatar">{initials(user.name)}</span>
                          <span>
                            <strong>{user.name}</strong>
                            <small>{user.email}</small>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`river-users-role role-${user.role.toLowerCase()}`}>
                          {user.role === "ADMIN" ? "Administrator" : user.role === "AGENT" ? "Agent" : "Employee"}
                        </span>
                      </td>
                      <td>
                        <span className={`river-users-status ${user.isActive ? "is-active" : "is-inactive"}`}>
                          <i />
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="river-users-date">{formatDate(user.createdAt)}</td>
                      <td>
                        {isAdmin ? (
                          <span className="river-users-protected">
                            <ShieldCheck size={14} /> Protected
                          </span>
                        ) : (
                          <div className="river-users-actions">
                            <button
                              type="button"
                              className="river-users-action role-action"
                              disabled={Boolean(busyUserId)}
                              onClick={() => void updateUser(user, "role")}
                              title={`Change role for ${user.name}`}
                            >
                              {busy ? <LoaderCircle size={14} className="river-users-spin" /> : <ShieldCheck size={14} />}
                              {user.role === "AGENT" ? "Make employee" : "Make agent"}
                            </button>
                            <button
                              type="button"
                              className={`river-users-action ${user.isActive ? "deactivate-action" : "activate-action"}`}
                              disabled={Boolean(busyUserId)}
                              onClick={() => void updateUser(user, "status")}
                              title={`${user.isActive ? "Deactivate" : "Activate"} ${user.name}`}
                            >
                              {busy ? <LoaderCircle size={14} className="river-users-spin" /> : user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                              {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="river-users-footer">
          <span><ShieldCheck size={14} /> Only administrators can manage accounts.</span>
        </div>
      </div>
    </section>
  );
}
