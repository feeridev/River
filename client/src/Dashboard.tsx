import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Activity, AlertCircle, ArrowRight, Bell, CheckCircle2, ChevronDown,
  CircleHelp, Clock3, FileText, LayoutDashboard, LifeBuoy, LoaderCircle,
  Menu, Plus, RefreshCw, Search, Settings, ShieldCheck, Ticket as TicketIcon,
  Users, Waves, X, MessageCircle, Send, CalendarDays, Tag,
} from "lucide-react";
import "./App.css";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type TicketCategory = "HARDWARE" | "SOFTWARE" | "NETWORK" | "ACCOUNT" | "ACCESS" | "OTHER";
type Ticket = {
  id: string; title: string; description: string; category: TicketCategory;
  priority: TicketPriority; status: TicketStatus; createdBy?: string;
  assignedTo?: string | null; createdAt: string; updatedAt?: string; resolvedAt?: string | null;
};
type TicketForm = { title: string; description: string; category: TicketCategory; priority: TicketPriority };
type StoredUser = { id?: string; name?: string; fullName?: string; username?: string; email?: string; role?: string };
type TicketMessage = { id: string; ticketId: string; senderId: string; body: string; createdAt: string };

const TOKEN_KEY = "river_token";
const USER_KEY = "river_user";
const categoryLabels: Record<TicketCategory, string> = {
  HARDWARE: "Hardware", SOFTWARE: "Software", NETWORK: "Network", ACCOUNT: "Account", ACCESS: "Access", OTHER: "Other",
};
const priorityLabels: Record<TicketPriority, string> = { LOW: "Low", MEDIUM: "Medium", HIGH: "High", CRITICAL: "Critical" };
const statusLabels: Record<TicketStatus, string> = { OPEN: "Open", IN_PROGRESS: "In progress", RESOLVED: "Resolved", CLOSED: "Closed" };
const emptyForm: TicketForm = { title: "", description: "", category: "SOFTWARE", priority: "MEDIUM" };

function getStoredUser(): StoredUser | null {
  try { const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) as StoredUser : null; }
  catch { return null; }
}
function getUserName() {
  const user = getStoredUser();
  return user?.fullName || user?.name || user?.username || user?.email?.split("@")[0] || "there";
}
function initials(name: string) {
  return name.trim().split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("") || "R";
}
function dateLabel(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
}
function relativeTime(value?: string) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  const mins = Math.floor(Math.max(0, Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  if (mins < 10080) return `${Math.floor(mins / 1440)}d ago`;
  return dateLabel(value);
}
async function errorMessage(response: Response) {
  try { const data = await response.json(); return data.message || data.error || `Request failed (${response.status})`; }
  catch { return `Request failed (${response.status})`; }
}

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | TicketStatus>("ALL");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<TicketForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [replyError, setReplyError] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const token = localStorage.getItem(TOKEN_KEY);
  const userName = getUserName();
  const currentUserId = getStoredUser()?.id;

  async function loadTickets(showLoading = true) {
    if (!token) { setLoadError("Your session is missing. Please sign in again."); setLoading(false); return; }
    if (showLoading) setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/tickets", { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(await errorMessage(response));
      const data = await response.json();
      const rows = Array.isArray(data) ? data : data.tickets;
      setTickets(Array.isArray(rows) ? rows : []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load tickets.");
    } finally { setLoading(false); }
  }
  useEffect(() => { void loadTickets(); /* load on mount */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openTicket(ticket: Ticket) {
    setSelectedTicket(ticket);
    setTicketMessages([]);
    setDetailLoading(true);
    setDetailError("");
    setReplyError("");
    setReplyBody("");

    if (!token) {
      setDetailError("Your session has expired. Please sign in again.");
      setDetailLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [ticketResponse, messagesResponse] = await Promise.all([
        fetch(`/api/tickets/${encodeURIComponent(ticket.id)}`, { headers }),
        fetch(`/api/tickets/${encodeURIComponent(ticket.id)}/messages`, { headers }),
      ]);

      if (!ticketResponse.ok) throw new Error(await errorMessage(ticketResponse));
      if (!messagesResponse.ok) throw new Error(await errorMessage(messagesResponse));

      const ticketPayload = await ticketResponse.json();
      const messagesPayload = await messagesResponse.json();
      const fullTicket = (ticketPayload.ticket || ticketPayload) as Ticket;
      const messages = Array.isArray(messagesPayload)
        ? messagesPayload
        : messagesPayload.messages;

      setSelectedTicket(fullTicket);
      setTickets((current) =>
        current.map((item) => item.id === fullTicket.id ? fullTicket : item),
      );
      setTicketMessages(Array.isArray(messages) ? messages : []);
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : "Could not load this ticket.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTicket || !token || replySubmitting) return;

    const body = replyBody.trim();
    if (!body) {
      setReplyError("Write a message before sending.");
      return;
    }

    setReplySubmitting(true);
    setReplyError("");

    try {
      const response = await fetch(
        `/api/tickets/${encodeURIComponent(selectedTicket.id)}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ body }),
        },
      );

      if (!response.ok) throw new Error(await errorMessage(response));

      setReplyBody("");
      const messagesResponse = await fetch(
        `/api/tickets/${encodeURIComponent(selectedTicket.id)}/messages`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!messagesResponse.ok) throw new Error(await errorMessage(messagesResponse));

      const payload = await messagesResponse.json();
      const messages = Array.isArray(payload) ? payload : payload.messages;
      setTicketMessages(Array.isArray(messages) ? messages : []);
      await loadTickets(false);
    } catch (error) {
      setReplyError(error instanceof Error ? error.message : "Could not send your reply.");
    } finally {
      setReplySubmitting(false);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const statusMatch = filter === "ALL" || ticket.status === filter;
      const text = `${ticket.id} ${ticket.title} ${ticket.description} ${ticket.category} ${ticket.priority} ${ticket.status}`.toLowerCase();
      return statusMatch && (!q || text.includes(q));
    });
  }, [tickets, search, filter]);
  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((t) => t.status === "OPEN").length,
    progress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length,
    critical: tickets.filter((t) => t.priority === "CRITICAL" && t.status !== "RESOLVED" && t.status !== "CLOSED").length,
  }), [tickets]);
  const activity = useMemo(() => [...tickets].sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()).slice(0, 4), [tickets]);

  function openCreate() { setForm(emptyForm); setFormError(""); setSuccess(""); setCreateOpen(true); }
  function closeCreate() { if (!submitting) { setCreateOpen(false); setFormError(""); } }
  async function submitTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFormError(""); setSuccess("");
    const title = form.title.trim(); const description = form.description.trim();
    if (title.length < 4) { setFormError("Use a title with at least 4 characters."); return; }
    if (description.length < 10) { setFormError("Add a description with at least 10 characters."); return; }
    if (!token) { setFormError("Your session has expired. Please sign in again."); return; }
    setSubmitting(true);
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description, category: form.category, priority: form.priority }),
      });
      if (!response.ok) throw new Error(await errorMessage(response));
      const payload = await response.json(); const created = payload.ticket || payload;
      setCreateOpen(false); setForm(emptyForm); setSuccess("Ticket created successfully.");
      if (created?.id) setTickets((current) => [created as Ticket, ...current.filter((t) => t.id !== created.id)]);
      else await loadTickets(false);
    } catch (error) { setFormError(error instanceof Error ? error.message : "Could not create the ticket."); }
    finally { setSubmitting(false); }
  }

  return <div className="river-app">
    {mobileNavOpen && <button className="river-mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
    <aside className={`river-sidebar ${mobileNavOpen ? "is-mobile-open" : ""}`}>
      <a className="river-brand" href="#dashboard" onClick={() => setMobileNavOpen(false)}><span className="river-brand-mark"><Waves size={23} /></span><span className="river-brand-copy"><strong>river</strong><small>HELPDESK</small></span></a>
      <div className="river-section-label">WORKSPACE</div>
      <nav className="river-nav" aria-label="Workspace navigation">
        <a className="river-nav-item active" href="#dashboard" onClick={() => setMobileNavOpen(false)}><LayoutDashboard size={18} /><span>Overview</span><i /></a>
        <a className="river-nav-item" href="#tickets" onClick={() => setMobileNavOpen(false)}><TicketIcon size={18} /><span>All tickets</span><b>{tickets.length}</b></a>
        <a className="river-nav-item" href="#activity" onClick={() => setMobileNavOpen(false)}><Activity size={18} /><span>Activity</span></a>
        <a className="river-nav-item" href="#team" onClick={() => setMobileNavOpen(false)}><Users size={18} /><span>Team</span></a>
      </nav>
      <div className="river-section-label river-support-label">SUPPORT</div>
      <nav className="river-nav" aria-label="Support navigation"><a className="river-nav-item" href="#help"><LifeBuoy size={18} /><span>Help center</span></a><a className="river-nav-item" href="#settings"><Settings size={18} /><span>Settings</span></a></nav>
      <div className="river-sidebar-bottom"><div className="river-sidebar-help"><span className="river-help-icon"><CircleHelp size={17} /></span><div><strong>Need a hand?</strong><p>We're here to help.</p></div><ArrowRight size={15} /></div><div className="river-profile"><span className="river-avatar">{initials(userName)}</span><span className="river-profile-copy"><strong>{userName}</strong><small>{getStoredUser()?.role || "Workspace member"}</small></span><button className="river-icon-button" aria-label="Profile options"><ChevronDown size={16} /></button></div></div>
    </aside>

    <main className="river-main" id="dashboard">
      <header className="river-topbar"><div className="river-topbar-left"><button className="river-icon-button river-mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button><div className="river-breadcrumb"><span>Workspace</span><span>/</span><strong>Overview</strong></div></div><div className="river-topbar-actions"><label className="river-search"><Search size={16} /><input aria-label="Search tickets" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} /><kbd>/</kbd></label><button className="river-icon-button river-notification" aria-label="Notifications"><Bell size={18} /><i /></button><span className="river-topbar-divider" /><span className="river-topbar-user"><span className="river-avatar small">{initials(userName)}</span><strong>{userName}</strong><ChevronDown size={15} /></span></div></header>

      <div className="river-page-content">
        <section className="river-welcome-row"><div><div className="river-eyebrow"><i /> YOUR SUPPORT OVERVIEW</div><h1>Good to see you, {userName.split(" ")[0]} <span>✦</span></h1><p>Here's what's happening with your support tickets today.</p></div><button className="river-primary-button" onClick={openCreate}><Plus size={18} /> Create ticket</button></section>
        {success && <div className="river-success" role="status"><CheckCircle2 size={17} />{success}<button aria-label="Dismiss" onClick={() => setSuccess("")}><X size={16} /></button></div>}

        <section className="river-stats-grid" aria-label="Ticket statistics">
          <article className="river-stat-card featured"><div className="river-stat-top"><span className="river-stat-icon"><TicketIcon size={18} /></span><small>ALL TIME</small></div><div className="river-stat-value">{loading ? "—" : stats.total}</div><div className="river-stat-bottom"><strong>Total tickets</strong><span>In workspace</span></div><div className="river-stat-rings" /></article>
          <article className="river-stat-card"><div className="river-stat-top"><span className="river-stat-icon amber"><Clock3 size={18} /></span><small>NEEDS ATTENTION</small></div><div className="river-stat-value">{loading ? "—" : stats.open}</div><div className="river-stat-bottom"><strong>Open tickets</strong><span>Awaiting action</span></div></article>
          <article className="river-stat-card"><div className="river-stat-top"><span className="river-stat-icon blue"><Activity size={18} /></span><small>IN MOTION</small></div><div className="river-stat-value">{loading ? "—" : stats.progress}</div><div className="river-stat-bottom"><strong>In progress</strong><span>Being worked on</span></div></article>
          <article className="river-stat-card"><div className="river-stat-top"><span className="river-stat-icon green"><CheckCircle2 size={18} /></span><small>COMPLETED</small></div><div className="river-stat-value">{loading ? "—" : stats.resolved}</div><div className="river-stat-bottom"><strong>Resolved</strong><span>All wrapped up</span></div></article>
        </section>

        <section className="river-content-grid">
          <section className="river-panel river-tickets-panel" id="tickets"><div className="river-panel-heading"><div><div className="river-title-line"><h2>Recent tickets</h2><span className="river-count-pill">{filtered.length}</span></div><p>Track and manage your support requests.</p></div><button className="river-text-button" onClick={() => { setFilter("ALL"); setSearch(""); }}>Clear filters <ArrowRight size={15} /></button></div>
            <div className="river-ticket-toolbar"><div className="river-filter-tabs">{(["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"] as const).map((value) => <button key={value} type="button" className={filter === value ? "selected" : ""} onClick={() => setFilter(value)}>{value === "ALL" ? "All tickets" : value === "IN_PROGRESS" ? "In progress" : statusLabels[value]}</button>)}</div><button className="river-icon-button river-refresh" title="Refresh tickets" aria-label="Refresh tickets" onClick={() => void loadTickets()}><RefreshCw size={15} /></button></div>
            {loadError && <div className="river-error-state"><AlertCircle size={19} /><div><strong>Couldn't load tickets</strong><p>{loadError}</p><button onClick={() => void loadTickets()}>Try again</button></div></div>}
            {!loadError && loading && <div className="river-loading"><LoaderCircle size={22} className="river-spin" />Loading your tickets...</div>}
            {!loadError && !loading && filtered.length === 0 && <div className="river-empty"><span><TicketIcon size={23} /></span><h3>{search || filter !== "ALL" ? "No matching tickets" : "Your queue is looking clear"}</h3><p>{search || filter !== "ALL" ? "Try changing your search or filter." : "Create your first ticket and we'll help you take it from there."}</p>{!search && filter === "ALL" && <button className="river-primary-button" onClick={openCreate}><Plus size={16} /> Create a ticket</button>}</div>}
            {!loadError && !loading && filtered.length > 0 && <div className="river-table-wrap"><table className="river-ticket-table"><thead><tr><th>Ticket</th><th>Priority</th><th>Status</th><th>Created</th><th /></tr></thead><tbody>{filtered.slice(0, 8).map((ticket) => <tr key={ticket.id || `${ticket.title}-${ticket.createdAt}`}><td><div className="river-ticket-cell"><span className="river-ticket-file"><FileText size={16} /></span><span className="river-ticket-info"><strong>{ticket.title}</strong><small>#{String(ticket.id || "ticket").slice(-8)} <i>·</i> {categoryLabels[ticket.category] || "Other"}</small></span></div></td><td><span className={`river-priority priority-${(ticket.priority || "MEDIUM").toLowerCase()}`}><i />{priorityLabels[ticket.priority] || ticket.priority}</span></td><td><span className={`river-status status-${(ticket.status || "OPEN").toLowerCase().replace("_", "-")}`}><i />{statusLabels[ticket.status] || ticket.status}</span></td><td className="river-date">{dateLabel(ticket.createdAt)}</td><td><button type="button" className="river-row-arrow" aria-label={`Open ticket ${ticket.title}`} title={`Open ${ticket.title}`} onClick={() => void openTicket(ticket)}><ArrowRight size={16} /></button></td></tr>)}</tbody></table>{filtered.length > 8 && <div className="river-table-note">Showing 8 of {filtered.length} tickets. Search to find a specific ticket.</div>}</div>}
            <div className="river-panel-footer"><span><i /> Data synced with River API</span><button onClick={() => void loadTickets(false)}>Refresh data <RefreshCw size={13} /></button></div>
          </section>

          <aside className="river-right-column"><section className="river-panel river-activity-panel" id="activity"><div className="river-panel-heading compact"><div><h2>Recent activity</h2><p>Latest updates across your tickets.</p></div><Activity size={17} /></div>{activity.length ? <div className="river-activity-list">{activity.map((ticket, index) => <div className="river-activity-item" key={ticket.id || ticket.title}><span className={`river-activity-icon ${ticket.status === "RESOLVED" || ticket.status === "CLOSED" ? "done" : ticket.status === "IN_PROGRESS" ? "working" : "created"}`}>{ticket.status === "RESOLVED" || ticket.status === "CLOSED" ? <CheckCircle2 size={14} /> : ticket.status === "IN_PROGRESS" ? <Activity size={14} /> : <FileText size={14} />}</span><div><p><strong>{ticket.title}</strong> {ticket.status === "OPEN" ? "was created" : ticket.status === "IN_PROGRESS" ? "is being worked on" : "was updated"}.</p><small>{relativeTime(ticket.updatedAt || ticket.createdAt)}</small></div>{index === 0 && <b>NEW</b>}</div>)}</div> : <div className="river-activity-empty"><Activity size={20} /><p>Ticket updates will appear here.</p></div>}<div className="river-activity-footer"><i /> You're all caught up</div></section>
            <section className="river-support-card"><div className="river-support-orb orb-a" /><div className="river-support-orb orb-b" /><div className="river-support-heading"><span><ShieldCheck size={19} /></span><small>RIVER SUPPORT</small></div><h3>Good support starts with a clear ticket.</h3><p>Share what happened, what you expected, and any steps you've already tried.</p><button onClick={openCreate}>Create a request <ArrowRight size={15} /></button></section>
            <section className="river-critical-note"><span><AlertCircle size={17} /></span><div><strong>{stats.critical} critical {stats.critical === 1 ? "ticket" : "tickets"}</strong><p>{stats.critical ? "These open items may need urgent attention." : "No critical tickets need attention right now."}</p></div></section>
          </aside>
        </section>
        <footer className="river-footer"><span>© {new Date().getFullYear()} River Helpdesk</span><span><i /> All systems operational</span><a href="#help"><CircleHelp size={13} /> Need help?</a></footer>
      </div>
    </main>

    {createOpen && <div className="river-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCreate(); }}><section className="river-modal" role="dialog" aria-modal="true" aria-labelledby="river-modal-title"><div className="river-modal-heading"><div><span className="river-modal-icon"><Plus size={19} /></span><div><h2 id="river-modal-title">Create a ticket</h2><p>Tell us what's going on and we'll take it from here.</p></div></div><button className="river-icon-button" aria-label="Close modal" onClick={closeCreate}><X size={19} /></button></div><form className="river-ticket-form" onSubmit={submitTicket}>
      <label className="river-form-field"><span>Ticket title <b>*</b></span><input autoFocus maxLength={120} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Unable to connect to office Wi-Fi" /><small>Keep it short and descriptive.</small></label>
      <label className="river-form-field"><span>Description <b>*</b></span><textarea rows={5} maxLength={5000} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue, what you expected, and what you've tried..." /><small>{form.description.length}/5000 characters</small></label>
      <div className="river-form-two"><label className="river-form-field"><span>Category</span><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as TicketCategory })}>{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="river-form-field"><span>Priority</span><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TicketPriority })}>{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
      {formError && <div className="river-form-error" role="alert"><AlertCircle size={16} />{formError}</div>}
      <div className="river-modal-actions"><button type="button" className="river-secondary-button" onClick={closeCreate} disabled={submitting}>Cancel</button><button className="river-primary-button" type="submit" disabled={submitting}>{submitting ? <><LoaderCircle size={16} className="river-spin" /> Creating...</> : <><Plus size={17} /> Submit ticket</>}</button></div><p className="river-form-footnote"><ShieldCheck size={14} /> Your request will be securely submitted to your workspace.</p>
    </form></section></div>}

    {selectedTicket && <div className="river-modal-backdrop river-detail-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !replySubmitting) setSelectedTicket(null); }}>
      <section className="river-modal river-detail-modal" role="dialog" aria-modal="true" aria-labelledby="river-detail-title">
        <div className="river-modal-heading">
          <div>
            <span className="river-modal-icon"><MessageCircle size={19} /></span>
            <div>
              <h2 id="river-detail-title">Ticket details</h2>
              <p>#{String(selectedTicket.id).slice(-8)} · Created {dateLabel(selectedTicket.createdAt)}</p>
            </div>
          </div>
          <button type="button" className="river-icon-button" aria-label="Close ticket details" onClick={() => { if (!replySubmitting) setSelectedTicket(null); }}><X size={19} /></button>
        </div>

        <div className="river-detail-content">
          {detailLoading && <div className="river-loading"><LoaderCircle size={20} className="river-spin" />Loading ticket...</div>}
          {detailError && <div className="river-form-error" role="alert"><AlertCircle size={16} />{detailError}<button type="button" className="river-detail-retry" onClick={() => void openTicket(selectedTicket)}>Retry</button></div>}

          {!detailLoading && !detailError && <>
            <div className="river-detail-title-row">
              <div>
                <span className="river-detail-label">SUBJECT</span>
                <h3>{selectedTicket.title}</h3>
              </div>
              <span className={`river-status status-${(selectedTicket.status || "OPEN").toLowerCase().replace("_", "-")}`}><i />{statusLabels[selectedTicket.status] || selectedTicket.status}</span>
            </div>

            <div className="river-detail-meta">
              <span><Tag size={14} />{categoryLabels[selectedTicket.category] || "Other"}</span>
              <span className={`river-priority priority-${(selectedTicket.priority || "MEDIUM").toLowerCase()}`}><i />{priorityLabels[selectedTicket.priority] || selectedTicket.priority}</span>
              <span><CalendarDays size={14} />{dateLabel(selectedTicket.createdAt)}</span>
            </div>

            <section className="river-detail-description">
              <h4>Description</h4>
              <p>{selectedTicket.description || "No description provided."}</p>
            </section>

            <section className="river-conversation">
              <div className="river-conversation-heading">
                <div><h4>Conversation</h4><p>Replies and updates on this request</p></div>
                <span>{ticketMessages.length}</span>
              </div>

              {ticketMessages.length === 0
                ? <div className="river-conversation-empty"><MessageCircle size={22} /><p>No replies yet. Send a message to start the conversation.</p></div>
                : <div className="river-message-list">{ticketMessages.map((message) => {
                    const mine = Boolean(currentUserId && message.senderId === currentUserId);
                    return <article className={`river-message ${mine ? "mine" : ""}`} key={message.id}>
                      <div className="river-message-top"><strong>{mine ? "You" : "Support / participant"}</strong><time>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(message.createdAt))}</time></div>
                      <p>{message.body}</p>
                    </article>;
                  })}</div>}

              <form className="river-reply-form" onSubmit={submitReply}>
                <label htmlFor="river-reply-body">Your reply</label>
                <textarea id="river-reply-body" rows={3} maxLength={5000} value={replyBody} onChange={(event) => setReplyBody(event.target.value)} placeholder="Write a message..." disabled={replySubmitting} />
                <div className="river-reply-bottom"><small>{replyBody.length}/5000</small><button className="river-primary-button" type="submit" disabled={replySubmitting || !replyBody.trim()}>{replySubmitting ? <><LoaderCircle size={15} className="river-spin" /> Sending...</> : <><Send size={15} /> Send reply</>}</button></div>
                {replyError && <div className="river-form-error" role="alert"><AlertCircle size={15} />{replyError}</div>}
              </form>
            </section>
          </>}
        </div>
      </section>
    </div>}
  </div>;
}