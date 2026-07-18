"use client";

import { FormEvent, useMemo, useState } from "react";

type SourceType = "Teams" | "SharePoint" | "Outlook" | "Azure DevOps" | "Power BI";

type KnowledgeItem = {
  id: string;
  source: SourceType;
  title: string;
  location: string;
  project: "Cloud Platform" | "Revenue Operations" | "Company-wide";
  updated: string;
  ageDays: number;
  access: "All employees" | "Operations" | "Leadership";
  summary: string;
  resolution: string;
  keywords: string[];
};

const knowledge: KnowledgeItem[] = [
  {
    id: "sp-prod-access",
    source: "SharePoint",
    title: "Production access policy",
    location: "Cloud Operations / Runbooks",
    project: "Cloud Platform",
    updated: "Today, 9:12 AM",
    ageDays: 0,
    access: "All employees",
    summary: "Production access uses a time-bound privileged identity workflow with manager and service-owner approval.",
    resolution: "Submit the PIM request, select the target role, link the approved change ticket, and request no more than four hours.",
    keywords: ["production", "access", "pim", "privileged", "role", "change", "ticket", "request"],
  },
  {
    id: "teams-access-thread",
    source: "Teams",
    title: "Updated PIM approval path",
    location: "Cloud Platform / Help channel",
    project: "Cloud Platform",
    updated: "Yesterday, 4:38 PM",
    ageDays: 1,
    access: "All employees",
    summary: "The Cloud Admin role was split into database and infrastructure roles after the June audit.",
    resolution: "Choose the narrower role in PIM; requests for the retired Cloud Admin role are automatically rejected.",
    keywords: ["production", "access", "pim", "approval", "cloud", "admin", "database", "infrastructure"],
  },
  {
    id: "ado-deployment-checklist",
    source: "Azure DevOps",
    title: "Safe deployment checklist",
    location: "platform-services / docs",
    project: "Cloud Platform",
    updated: "3 days ago",
    ageDays: 3,
    access: "Operations",
    summary: "The release pipeline verifies the linked change record, owner, rollback plan, and maintenance window.",
    resolution: "Complete all four deployment checks before the release gate can be approved.",
    keywords: ["production", "deploy", "release", "change", "ticket", "rollback", "maintenance"],
  },
  {
    id: "teams-incident",
    source: "Teams",
    title: "July 16 API latency incident",
    location: "Incident Response / SEV-2",
    project: "Cloud Platform",
    updated: "2 days ago",
    ageDays: 2,
    access: "Operations",
    summary: "API latency was traced to an exhausted connection pool after the billing-service deployment.",
    resolution: "Rollback version 4.8.1, raise the pool alert threshold, then follow IR-204 for customer communication.",
    keywords: ["incident", "latency", "api", "billing", "rollback", "playbook", "ir-204"],
  },
  {
    id: "sp-incident-playbook",
    source: "SharePoint",
    title: "Incident response playbook IR-204",
    location: "Security & Reliability / Playbooks",
    project: "Cloud Platform",
    updated: "5 days ago",
    ageDays: 5,
    access: "All employees",
    summary: "IR-204 defines severity, incident commander, communications, evidence capture, and review steps.",
    resolution: "Declare severity, assign command roles, start the timeline, notify stakeholders, and schedule a review within two business days.",
    keywords: ["incident", "response", "playbook", "ir-204", "severity", "commander", "communications"],
  },
  {
    id: "pbi-renewal",
    source: "Power BI",
    title: "Q3 renewal forecast — Contoso",
    location: "Revenue Operations / Forecast dashboard",
    project: "Revenue Operations",
    updated: "Today, 7:45 AM",
    ageDays: 0,
    access: "Leadership",
    summary: "The forecast moved from Commit to Best Case after the security review added a four-week dependency.",
    resolution: "The account team is targeting an August 12 security decision and a revised September close date.",
    keywords: ["contoso", "renewal", "forecast", "drop", "security", "review", "commit", "best", "case"],
  },
  {
    id: "outlook-contoso",
    source: "Outlook",
    title: "Contoso security review follow-up",
    location: "Revenue Operations / Account correspondence",
    project: "Revenue Operations",
    updated: "Yesterday, 11:20 AM",
    ageDays: 1,
    access: "Leadership",
    summary: "Contoso requested additional data-residency evidence before approving the renewal.",
    resolution: "Security will send the evidence package by July 22; Sales will confirm the decision meeting for August 12.",
    keywords: ["contoso", "renewal", "security", "review", "forecast", "data", "residency", "evidence"],
  },
  {
    id: "sp-travel",
    source: "SharePoint",
    title: "Travel and expense policy",
    location: "People Operations / Policies",
    project: "Company-wide",
    updated: "12 days ago",
    ageDays: 12,
    access: "All employees",
    summary: "Domestic travel requires manager approval before booking and itemized receipts for expenses over $25.",
    resolution: "Create the trip request in the expense portal, obtain approval, and book through the corporate travel provider.",
    keywords: ["travel", "expense", "receipt", "booking", "approval", "policy"],
  },
];

const sourceColors: Record<SourceType, string> = {
  Teams: "#6b5bd2",
  SharePoint: "#0b7c78",
  Outlook: "#1473e6",
  "Azure DevOps": "#2563a9",
  "Power BI": "#d49a00",
};

const suggestedQuestions = [
  "How do I request production access?",
  "What is the latest incident playbook?",
  "Why did the Contoso renewal forecast drop?",
];

function scoreItem(item: KnowledgeItem, query: string) {
  const tokens = query.toLowerCase().match(/[a-z0-9-]+/g) ?? [];
  const searchable = `${item.title} ${item.summary} ${item.resolution} ${item.keywords.join(" ")}`.toLowerCase();
  const exact = tokens.reduce((total, token) => total + (searchable.includes(token) ? 1 : 0), 0);
  const rare = tokens.reduce((total, token) => total + (item.keywords.includes(token) && token.length > 5 ? 0.7 : 0), 0);
  const freshness = Math.max(0, 1 - item.ageDays / 30);
  return exact * 1.8 + rare + freshness;
}

function canAccess(item: KnowledgeItem, role: string) {
  if (item.access === "All employees") return true;
  if (item.access === "Operations") return role === "Operations" || role === "Leadership";
  return role === "Leadership";
}

function synthesize(results: KnowledgeItem[], query: string) {
  if (!results.length) {
    return "I couldn’t find enough authorized evidence to answer that. Try changing the project scope or ask a source owner to add the missing content.";
  }

  const lower = query.toLowerCase();
  if (lower.includes("production") && lower.includes("access")) {
    return "Request production access through Microsoft Entra PIM. Choose the narrowest role, link an approved change ticket, and limit activation to four hours. The retired Cloud Admin role is no longer accepted.";
  }
  if (lower.includes("incident") || lower.includes("playbook")) {
    return "Use playbook IR-204. Declare severity, assign incident-command roles, begin a shared timeline, notify stakeholders, and schedule the review within two business days. The latest incident also recommends validating connection-pool alerts after a rollback.";
  }
  if (lower.includes("contoso") || lower.includes("renewal") || lower.includes("forecast")) {
    return "Contoso moved from Commit to Best Case because its security review added a four-week dependency. Security plans to send the data-residency evidence by July 22, with a decision meeting targeted for August 12 and a revised September close.";
  }
  if (lower.includes("travel") || lower.includes("expense")) {
    return "Get manager approval before booking, use the corporate travel provider, and attach itemized receipts for expenses over $25.";
  }
  return `${results[0].summary} ${results[0].resolution}`;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [project, setProject] = useState("All projects");
  const [role, setRole] = useState("Employee");
  const [answer, setAnswer] = useState<null | { query: string; text: string; results: KnowledgeItem[]; blocked: number }>(null);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showConnect, setShowConnect] = useState(false);

  const sourceCounts = useMemo(() => {
    return knowledge.reduce<Record<string, number>>((counts, item) => {
      counts[item.source] = (counts[item.source] ?? 0) + 1;
      return counts;
    }, {});
  }, []);

  function runSearch(text: string) {
    const clean = text.trim();
    if (!clean) return;
    const inScope = knowledge.filter((item) => project === "All projects" || item.project === project || item.project === "Company-wide");
    const ranked = inScope
      .map((item) => ({ item, score: scoreItem(item, clean) }))
      .filter(({ score }) => score > 1)
      .sort((a, b) => b.score - a.score);
    const blocked = ranked.filter(({ item }) => !canAccess(item, role)).length;
    const allowed = ranked.filter(({ item }) => canAccess(item, role)).slice(0, 3).map(({ item }) => item);
    setAnswer({ query: clean, text: synthesize(allowed, clean), results: allowed, blocked });
    setQuery("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    runSearch(query);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>Northstar</span>
        </div>
        <nav>
          <button className="nav-item active"><span className="nav-icon">⌕</span><span>Ask</span></button>
          <button className="nav-item"><span className="nav-icon">▤</span><span>Knowledge</span><span className="nav-count">48k</span></button>
          <button className="nav-item"><span className="nav-icon">◫</span><span>Projects</span><span className="nav-count">3</span></button>
          <button className="nav-item"><span className="nav-icon">◎</span><span>Analytics</span></button>
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setShowArchitecture(true)}><span className="nav-icon">⌘</span><span>Architecture</span></button>
          <button className="user-card">
            <span className="avatar">WA</span>
            <span><b>Will Anderson</b><small>Demo workspace</small></span>
            <span className="more">•••</span>
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">ENTERPRISE KNOWLEDGE</span>
            <h1>Ask Northstar</h1>
          </div>
          <div className="top-actions">
            <span className="sync-status"><i /> Microsoft Graph synced 2m ago</span>
            <button className="secondary-button" onClick={() => setShowConnect(true)}>Connect Microsoft 365</button>
          </div>
        </header>

        <div className="demo-banner" role="note">
          <span className="demo-pill">DEMO MODE</span>
          <span>Uses realistic sample data. No company content leaves your environment.</span>
          <button onClick={() => setShowArchitecture(true)}>See how it works</button>
        </div>

        <div className="content-grid">
          <section className="ask-panel">
            <div className="scope-row">
              <label>
                <span>Project scope</span>
                <select value={project} onChange={(event) => setProject(event.target.value)} aria-label="Project scope">
                  <option>All projects</option>
                  <option>Cloud Platform</option>
                  <option>Revenue Operations</option>
                </select>
              </label>
              <label>
                <span>View as</span>
                <select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Permission role">
                  <option>Employee</option>
                  <option>Operations</option>
                  <option>Leadership</option>
                </select>
              </label>
            </div>

            {!answer ? (
              <div className="welcome-state">
                <span className="spark-mark" aria-hidden="true">✦</span>
                <h2>What do you need to know?</h2>
                <p>Search conversations, documents, code, mail, and business data—with source permissions preserved.</p>
                <form className="search-box" onSubmit={submit}>
                  <textarea value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask a question about your work…" aria-label="Ask a question" rows={3} />
                  <div className="search-footer">
                    <span><kbd>⌘</kbd> <kbd>↵</kbd> to ask</span>
                    <button type="submit" disabled={!query.trim()} aria-label="Submit question">↑</button>
                  </div>
                </form>
                <div className="suggestions">
                  {suggestedQuestions.map((question) => (
                    <button key={question} onClick={() => runSearch(question)}><span>↗</span>{question}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="answer-state" aria-live="polite">
                <div className="question-row"><span className="avatar small">WA</span><p>{answer.query}</p></div>
                <div className="answer-card">
                  <div className="answer-heading"><span className="spark-mark small">✦</span><span>Grounded answer</span><span className="confidence"><i /> High confidence</span></div>
                  <p className="answer-text">{answer.text}</p>
                  {answer.results.length > 0 && <p className="citation-line">{answer.results.map((item, index) => <button key={item.id} title={item.title}>{index + 1}</button>)}</p>}
                  {answer.blocked > 0 && <div className="security-note">◈ {answer.blocked} relevant source{answer.blocked > 1 ? "s were" : " was"} excluded by your current permissions.</div>}
                </div>
                <div className="evidence-header"><span>Evidence used</span><small>Hybrid search · recency weighted · permission trimmed</small></div>
                <div className="evidence-list">
                  {answer.results.map((item, index) => (
                    <article className="evidence-card" key={item.id}>
                      <div className="source-logo" style={{ background: sourceColors[item.source] }}>{item.source === "SharePoint" ? "S" : item.source === "Teams" ? "T" : item.source === "Outlook" ? "O" : item.source === "Power BI" ? "P" : "A"}</div>
                      <div className="evidence-content">
                        <div className="evidence-top"><span>{item.source}</span><small>{item.updated}</small></div>
                        <h3><span>{index + 1}</span>{item.title}</h3>
                        <p>{item.summary}</p>
                        <div className="signal-row"><span>Semantic match</span><span>Exact terms</span><span>Freshness boost</span></div>
                      </div>
                    </article>
                  ))}
                  {!answer.results.length && <div className="empty-evidence">No authorized sources met the evidence threshold.</div>}
                </div>
                <form className="search-box compact" onSubmit={submit}>
                  <textarea value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask a follow-up…" aria-label="Ask a follow-up" rows={2} />
                  <button type="submit" disabled={!query.trim()} aria-label="Submit follow-up">↑</button>
                </form>
                <button className="new-question" onClick={() => setAnswer(null)}>＋ Start a new question</button>
              </div>
            )}
          </section>

          <aside className="context-panel">
            <section className="panel-card">
              <div className="panel-title"><h2>Connected sources</h2><span className="live-badge"><i /> LIVE</span></div>
              <div className="source-list">
                {(Object.keys(sourceCounts) as SourceType[]).map((source) => (
                  <div className="source-row" key={source}>
                    <span className="source-logo mini" style={{ background: sourceColors[source] }}>{source[0]}</span>
                    <span><b>{source}</b><small>{sourceCounts[source]} demo records</small></span>
                    <span className="check">✓</span>
                  </div>
                ))}
              </div>
              <button className="panel-action" onClick={() => setShowConnect(true)}>＋ Add a source</button>
            </section>

            <section className="panel-card health-card">
              <div className="panel-title"><h2>Retrieval health</h2><span className="score">98%</span></div>
              <div className="health-bar"><i /></div>
              <dl>
                <div><dt>Indexed records</dt><dd>48,291</dd></div>
                <div><dt>Sources current</dt><dd>5 / 5</dd></div>
                <div><dt>Median answer time</dt><dd>1.8s</dd></div>
                <div><dt>Permission checks</dt><dd>100%</dd></div>
              </dl>
            </section>

            <section className="panel-card trust-card">
              <span className="shield">◇</span>
              <div><h2>Security trimmed</h2><p>Every result is filtered against the viewer’s source permissions before synthesis.</p></div>
            </section>
          </aside>
        </div>
      </section>

      {(showArchitecture || showConnect) && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => { setShowArchitecture(false); setShowConnect(false); }}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowArchitecture(false); setShowConnect(false); }} aria-label="Close">×</button>
            {showArchitecture ? (
              <>
                <span className="modal-kicker">MVP ARCHITECTURE</span>
                <h2 id="modal-title">Microsoft 365 stays the system of record.</h2>
                <p className="modal-intro">The production version reads content and permissions through Microsoft Graph, normalizes high-value knowledge, and returns only evidence the current Entra ID user can access.</p>
                <div className="flow">
                  <div><b>1</b><span><strong>Sources</strong><small>Teams · SharePoint · Outlook · Azure DevOps</small></span></div>
                  <i>→</i>
                  <div><b>2</b><span><strong>Azure retrieval</strong><small>Hybrid search · RRF · semantic ranker</small></span></div>
                  <i>→</i>
                  <div><b>3</b><span><strong>Grounded answer</strong><small>ACL filters · citations · audit trail</small></span></div>
                </div>
                <div className="guardrails"><span>✓ Source ACLs preserved</span><span>✓ Citations required</span><span>✓ No answer without evidence</span><span>✓ Purview-ready audit</span></div>
              </>
            ) : (
              <>
                <span className="modal-kicker">NEXT STEP</span>
                <h2 id="modal-title">Connect your Microsoft 365 tenant.</h2>
                <p className="modal-intro">This demo intentionally ships with synthetic records. The production connection uses an Entra app registration, least-privilege Graph permissions, and source-level access control lists.</p>
                <ol className="connect-steps">
                  <li><b>Register the app</b><span>Create a single-tenant Entra application and approve only required Graph permissions.</span></li>
                  <li><b>Select pilot sources</b><span>Start with one SharePoint site and two Teams channels owned by the pilot group.</span></li>
                  <li><b>Validate permissions</b><span>Test positive and negative access cases before indexing any production content.</span></li>
                </ol>
                <button className="primary-button" onClick={() => setShowArchitecture(true)}>Review architecture</button>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
