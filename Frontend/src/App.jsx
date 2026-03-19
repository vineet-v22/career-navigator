import { useState } from "react";

const API = "http://127.0.0.1:8000";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a26;
    --border: rgba(255,255,255,0.07);
    --accent: #7c6af7;
    --accent2: #f76a6a;
    --accent3: #6af7b8;
    --accent4: #f7c96a;
    --text: #e8e8f0;
    --muted: #6b6b80;
    --font-head: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-mono); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 60% 50% at 70% 10%, rgba(124,106,247,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 10% 80%, rgba(106,247,184,0.07) 0%, transparent 60%);
    padding: 48px 24px;
    display: flex;
    justify-content: center;
  }

  .container { width: 100%; max-width: 680px; display: flex; flex-direction: column; gap: 20px; }

  .header { padding: 12px 0 32px; display: flex; flex-direction: column; gap: 8px; }
  .eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); font-weight: 500; }
  .title { font-family: var(--font-head); font-size: clamp(2rem, 6vw, 3.2rem); font-weight: 800; line-height: 1; letter-spacing: -0.02em; color: var(--text); }
  .title span { color: var(--accent); }
  .subtitle { font-size: 13px; color: var(--muted); margin-top: 4px; }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(124,106,247,0.3), transparent 40%, transparent 60%, rgba(106,247,184,0.1));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  .card-label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); font-weight: 500; margin-bottom: -6px; }

  .input-wrap { display: flex; flex-direction: column; gap: 8px; }
  .field-label { font-size: 11px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }

  input {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 14px;
    width: 100%;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    -webkit-appearance: none;
  }
  input:focus { border-color: rgba(124,106,247,0.6); box-shadow: 0 0 0 3px rgba(124,106,247,0.1); }
  input::placeholder { color: var(--muted); }

  .btn {
    border: none;
    border-radius: 10px;
    padding: 12px 20px;
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .btn:active { transform: scale(0.98); }
  .btn-primary { background: var(--accent); color: #fff; box-shadow: 0 4px 20px rgba(124,106,247,0.35); }
  .btn-primary:hover { background: #8d7df9; box-shadow: 0 6px 28px rgba(124,106,247,0.5); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-green { background: rgba(106,247,184,0.12); color: var(--accent3); border: 1px solid rgba(106,247,184,0.25); }
  .btn-green:hover { background: rgba(106,247,184,0.2); border-color: rgba(106,247,184,0.4); }
  .btn-purple { background: rgba(124,106,247,0.1); color: var(--accent); border: 1px solid rgba(124,106,247,0.25); }
  .btn-purple:hover { background: rgba(124,106,247,0.2); border-color: rgba(124,106,247,0.4); }
  .btn-yellow { background: rgba(247,201,106,0.1); color: var(--accent4); border: 1px solid rgba(247,201,106,0.25); }
  .btn-yellow:hover { background: rgba(247,201,106,0.2); border-color: rgba(247,201,106,0.4); }
  .btn-yellow:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .error { background: rgba(247,106,106,0.08); border: 1px solid rgba(247,106,106,0.2); border-radius: 10px; padding: 12px 16px; color: var(--accent2); font-size: 13px; display: flex; align-items: center; gap: 8px; }
  .success { background: rgba(106,247,184,0.08); border: 1px solid rgba(106,247,184,0.2); border-radius: 10px; padding: 12px 16px; color: var(--accent3); font-size: 13px; display: flex; align-items: center; gap: 8px; }

  .result { border-top: 1px solid var(--border); padding-top: 20px; display: flex; flex-direction: column; gap: 18px; animation: fadeUp 0.4s ease; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .result-row { display: flex; flex-direction: column; gap: 6px; }
  .result-key { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
  .result-val { font-size: 14px; color: var(--text); }

  .tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2px; }
  .tag { font-size: 12px; padding: 4px 10px; border-radius: 6px; font-family: var(--font-mono); }
  .tag-missing { background: rgba(247,106,106,0.1); color: var(--accent2); border: 1px solid rgba(247,106,106,0.2); }
  .tag-skill { background: rgba(106,247,184,0.08); color: var(--accent3); border: 1px solid rgba(106,247,184,0.15); }

  /* MATCH SCORE */
  .match-score-wrap { display: flex; flex-direction: column; gap: 8px; }
  .match-score-header { display: flex; justify-content: space-between; align-items: baseline; }
  .match-score-label { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
  .match-score-pct { font-family: var(--font-head); font-size: 1.6rem; font-weight: 800; }
  .match-bar-track { height: 6px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
  .match-bar-fill { height: 100%; border-radius: 99px; transition: width 0.8s cubic-bezier(.4,0,.2,1); }

  .roadmap-list { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
  .roadmap-item { display: flex; gap: 12px; align-items: flex-start; font-size: 13px; line-height: 1.5; }
  .roadmap-num { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: rgba(124,106,247,0.15); border: 1px solid rgba(124,106,247,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--accent); font-weight: 600; margin-top: 1px; }

  .generated-by { font-size: 11px; color: var(--muted); padding-top: 4px; border-top: 1px solid var(--border); }

  /* INTERVIEW QUESTIONS */
  .interview-section { border-top: 1px solid var(--border); padding-top: 20px; display: flex; flex-direction: column; gap: 14px; animation: fadeUp 0.4s ease; }
  .q-list { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
  .q-item { display: flex; gap: 12px; align-items: flex-start; font-size: 13px; line-height: 1.6; }
  .q-num { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: rgba(247,201,106,0.12); border: 1px solid rgba(247,201,106,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--accent4); font-weight: 600; margin-top: 2px; }

  /* ROLES */
  .roles-search { position: relative; }
  .roles-grid { display: flex; flex-direction: column; gap: 6px; }
  .role-item { font-size: 13px; padding: 10px 14px; background: var(--surface2); border-radius: 8px; border: 1px solid var(--border); color: var(--text); cursor: pointer; transition: all 0.15s; }
  .role-item:hover { border-color: rgba(124,106,247,0.4); background: rgba(124,106,247,0.06); color: var(--accent); }

  .loading { display: flex; align-items: center; gap: 6px; color: var(--muted); font-size: 13px; }
  .dot { animation: blink 1.4s infinite both; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
    40%           { opacity: 1;   transform: scale(1); }
  }

  .btn-row { display: flex; gap: 10px; }
  .btn-row .btn { flex: 1; }
`;



function matchColor(pct) {
  if (pct >= 70) return "var(--accent3)";
  if (pct >= 40) return "var(--accent4)";
  return "var(--accent2)";
}


export default function App() {
  const [userId, setUserId]         = useState("");
  const [role, setRole]             = useState("");
  const [skills, setSkills]         = useState("");
  const [roleSearch, setRoleSearch] = useState("");

  const [result, setResult]         = useState(null);       
  const [interview, setInterview]   = useState(null);       
  const [roles, setRoles]           = useState([]);

  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingInterview, setLoadingInterview] = useState(false);

  //1. Analyze gap
  const analyze = async () => {
    setError(""); setResult(null); setInterview(null); setSuccess("");
    const cleanUser = userId.trim();
    const cleanRole = role.trim();
    if (!cleanUser) return setError("User ID is required");
    if (!cleanRole) return setError("Role is required");
    setLoadingAnalyze(true);
    try {
      const res = await fetch(`${API}/analyze/${cleanUser}/${encodeURIComponent(cleanRole)}`);
      const data = await res.json();
      if (!res.ok) return setError(data.detail || "Server error");
      setResult(data);
    } catch {
      setError("Cannot reach backend — is the server running?");
    } finally {
      setLoadingAnalyze(false);
    }
  };

  // ── 2. Mock interview 
  const fetchInterview = async () => {
    setError(""); setInterview(null); setSuccess("");
    const cleanUser = userId.trim();
    const cleanRole = role.trim();
    if (!cleanUser) return setError("User ID is required");
    if (!cleanRole) return setError("Role is required — run Analyse Gap first");
    setLoadingInterview(true);
    try {
      const res = await fetch(`${API}/mock-interview/${cleanUser}/${encodeURIComponent(cleanRole)}`);
      const data = await res.json();
      if (!res.ok) return setError(data.detail || "Failed to fetch interview questions");
      setInterview(data);
    } catch {
      setError("Cannot reach backend — is the server running?");
    } finally {
      setLoadingInterview(false);
    }
  };

  //3. Add skills
  const updateSkills = async () => {
    setError(""); setSuccess("");
    const cleanUser = userId.trim();
    if (!cleanUser) return setError("User ID is required");
    if (!skills.trim()) return setError("Enter at least one skill");
    const skillArray = skills.split(",").map(s => s.trim()).filter(Boolean);
    if (!skillArray.length) return setError("Invalid skills input");
    try {
      const res = await fetch(`${API}/update-skills/${cleanUser}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillArray),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.detail || "Failed to update skills");
      setSuccess(`Skills saved: ${data.skills.join(", ")}`);
      setSkills("");
    } catch {
      setError("Failed to update skills");
    }
  };

  //4. Load / search roles
  const loadRoles = async (search = "") => {
    setError("");
    try {
      const url = search.trim()
        ? `${API}/roles?search=${encodeURIComponent(search.trim())}`
        : `${API}/roles`;
      const res  = await fetch(url);
      const data = await res.json();
      if (!res.ok) return setError(data.detail || "Failed to load roles");
      setRoles(data.roles || []);
    } catch {
      setError("Failed to load roles");
    }
  };

  const handleRoleSearchChange = (e) => {
    setRoleSearch(e.target.value);
    loadRoles(e.target.value);
  };

  const pickRole = (r) => { setRole(r); setInterview(null); setResult(null); };

  // ── match score colour & label
  const pct   = result?.match_score ?? 0;
  const color = matchColor(pct);

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <div className="container">

          {/* HEADER */}
          <div className="header">
            <div className="eyebrow">AI-powered · Career Intelligence</div>
            <h1 className="title">Career<span>.</span>Nav</h1>
            <p className="subtitle">Identify skill gaps & generate personalised roadmaps</p>
          </div>

          {/* ALERTS */}
          {error   && <div className="error"><span>⚠</span> {error}</div>}
          {success && <div className="success"><span>✓</span> {success}</div>}

          {/* IDENTITY */}
          <div className="card">
            <div className="card-label">Identity</div>
            <div className="input-wrap">
              <div className="field-label">User ID</div>
              <input
                placeholder="e.g. 1 or alice_01"
                value={userId}
                onChange={e => setUserId(e.target.value)}
              />
            </div>
          </div>

          {/* GAP ANALYSIS */}
          <div className="card">
            <div className="card-label">Gap Analysis</div>
            <div className="input-wrap">
              <div className="field-label">Target Role</div>
              <input
                placeholder="e.g. DevOps Engineer"
                value={role}
                onChange={e => setRole(e.target.value)}
                onKeyDown={e => e.key === "Enter" && analyze()}
              />
            </div>

            <div className="btn-row">
              <button className="btn btn-primary" onClick={analyze} disabled={loadingAnalyze}>
                {loadingAnalyze ? "Analysing…" : "→ Analyse Gap"}
              </button>
              <button
                className="btn btn-yellow"
                onClick={fetchInterview}
                disabled={loadingInterview}
                title="Generate mock interview questions based on your missing skills"
              >
                {loadingInterview ? "Loading…" : "⚡ Mock Interview"}
              </button>
            </div>

            {(loadingAnalyze || loadingInterview) && (
              <div className="loading">
                <div className="dot" /><div className="dot" /><div className="dot" />
                <span>{loadingInterview ? "Generating questions…" : "Generating roadmap…"}</span>
              </div>
            )}

            {/* ANALYZE RESULT */}
            {result && (
              <div className="result">

                {/* MATCH SCORE */}
                <div className="match-score-wrap">
                  <div className="match-score-header">
                    <div className="match-score-label">Skill Match</div>
                    <div className="match-score-pct" style={{ color }}>{pct}%</div>
                  </div>
                  <div className="match-bar-track">
                    <div
                      className="match-bar-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>

                <div className="result-row">
                  <div className="result-key">Role</div>
                  <div className="result-val">{result.role}</div>
                </div>

                <div className="result-row">
                  <div className="result-key">Your Skills</div>
                  <div className="tag-list">
                    {result.your_skills.length
                      ? result.your_skills.map((s, i) => <span className="tag tag-skill" key={i}>{s}</span>)
                      : <span style={{color:"var(--muted)",fontSize:13}}>No skills on profile yet</span>}
                  </div>
                </div>

                <div className="result-row">
                  <div className="result-key">Missing Skills</div>
                  <div className="tag-list">
                    {result.missing_skills.length
                      ? result.missing_skills.map((s, i) => <span className="tag tag-missing" key={i}>{s}</span>)
                      : <span style={{color:"var(--accent3)",fontSize:13}}>None — you're fully qualified! 🎉</span>}
                  </div>
                </div>

                <div className="result-row">
                  <div className="result-key">Roadmap</div>
                  <div className="roadmap-list">
                    {result.roadmap.map((step, i) => (
                      <div className="roadmap-item" key={i}>
                        <div className="roadmap-num">{i + 1}</div>
                        <div>{step}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="generated-by">Generated by {result.generated_by}</div>
              </div>
            )}

            {/* MOCK INTERVIEW RESULT */}
            {interview && (
              <div className="interview-section">
                <div className="result-row">
                  <div className="result-key">⚡ Mock Interview — {interview.role}</div>
                  {interview.based_on_skills?.length > 0 && (
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>
                      Based on: {interview.based_on_skills.join(", ")}
                    </div>
                  )}
                </div>
                <div className="q-list">
                  {interview.questions.map((q, i) => (
                    <div className="q-item" key={i}>
                      <div className="q-num">{i + 1}</div>
                      <div>{q}</div>
                    </div>
                  ))}
                </div>
                <div className="generated-by">Generated by {interview.source}</div>
              </div>
            )}
          </div>

          {/* ADD SKILLS */}
          <div className="card">
            <div className="card-label">Profile</div>
            <div className="input-wrap">
              <div className="field-label">Add Skills (comma-separated)</div>
              <input
                placeholder="e.g. Docker, Kubernetes, Terraform"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                onKeyDown={e => e.key === "Enter" && updateSkills()}
              />
            </div>
            <button className="btn btn-green" onClick={updateSkills}>
              + Add to Profile
            </button>
          </div>

          {/* ROLES + SEARCH */}
          <div className="card">
            <div className="card-label">Available Roles</div>
            <div className="btn-row">
              <button className="btn btn-purple" onClick={() => loadRoles(roleSearch)}>
                ↓ Load Roles
              </button>
            </div>
            <div className="input-wrap">
              <input
                placeholder="Search roles…"
                value={roleSearch}
                onChange={handleRoleSearchChange}
              />
            </div>

            {roles.length > 0 && (
              <div className="roles-grid">
                {roles.map((r, i) => (
                  <div
                    className="role-item"
                    key={i}
                    onClick={() => pickRole(r)}
                    title="Click to set as target role"
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}

            {roles.length === 0 && roleSearch && (
              <div style={{fontSize:13,color:"var(--muted)"}}>No roles match "{roleSearch}"</div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}