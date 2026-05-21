"use client";

import { useState } from "react";

const LANGUAGES = [
  "javascript", "typescript", "python", "rust", "go",
  "java", "c", "cpp", "php", "ruby", "swift", "kotlin",
];

const SAMPLE_CODE = `function fetchUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  db.execute(query, (err, result) => {
    if (err) console.log(err);
    return result;
  });
}`;

type Bug = { severity: string; line: string; issue: string; fix: string };
type Improvement = { category: string; suggestion: string };
type Security = { severity: string; issue: string; fix: string };
type Review = {
  score: number | null;
  summary: string;
  bugs: Bug[];
  improvements: Improvement[];
  security: Security[];
  positives: string[];
};

const severityBadge: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border border-red-500/20",
  high:     "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  medium:   "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  low:      "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

const categoryBadge: Record<string, string> = {
  performance:     "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  readability:     "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  maintainability: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  "best-practice": "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
};

function ScoreRing({ score }: { score: number | null }) {
  if (score === null) return null;
  const color = score >= 8 ? "#10b981" : score >= 5 ? "#f59e0b" : "#ef4444";
  const pct = (score / 10) * 100;
  const r = 28, circ = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="80" height="80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-xl font-semibold text-[#f7f8f8]" style={{ fontFeatureSettings: '"cv01","ss03"' }}>{score}</span>
        <span className="text-[10px] text-[#62666d]">/ 10</span>
      </div>
    </div>
  );
}

function SectionHeader({ icon, label, count }: { icon: string; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm">{icon}</span>
      <span className="text-xs font-semibold text-[#8a8f98] uppercase tracking-widest" style={{ fontFeatureSettings: '"cv01","ss03"' }}>{label}</span>
      <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/5 text-[#62666d] border border-white/5">{count}</span>
    </div>
  );
}

export default function Home() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReview() {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setReview(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReview(data.review);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen text-[#d0d6e0]" style={{ background: "#08090a", fontFamily: "Inter, system-ui, sans-serif", fontFeatureSettings: '"cv01","ss03"' }}>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #7170ff 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5" style={{ background: "rgba(8,9,10,0.85)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded" style={{ background: "linear-gradient(135deg, #5e6ad2, #7170ff)" }} />
            <span className="text-sm font-semibold text-[#f7f8f8]" style={{ fontWeight: 590 }}>CodeReview AI</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.03] text-[#62666d]">MiMo-V2.5-Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/zqwx-l/ai-code-reviewer" target="_blank" rel="noopener noreferrer"
              className="text-xs text-[#62666d] hover:text-[#d0d6e0] transition-colors">GitHub</a>
            <a href="https://platform.xiaomimimo.com" target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded border border-white/[0.08] bg-white/[0.02] text-[#d0d6e0] hover:bg-white/[0.05] transition-colors">
              MiMo API →
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-[#8a8f98] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Powered by Xiaomi MiMo-V2.5-Pro reasoning model
        </div>
        <h1 className="text-[42px] font-semibold text-[#f7f8f8] leading-tight mb-4"
          style={{ letterSpacing: "-0.9px", fontWeight: 510 }}>
          AI Code Reviewer
        </h1>
        <p className="text-[17px] text-[#8a8f98] max-w-xl mx-auto leading-relaxed">
          Detect bugs, security vulnerabilities, and get improvement suggestions — instantly, powered by advanced AI reasoning.
        </p>
      </section>

      {/* Main Editor */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Left — Editor */}
          <div className="flex flex-col gap-3">
            {/* Editor header */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-t-xl border border-white/[0.08] bg-white/[0.02]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <span className="text-xs text-[#62666d] ml-1">code.{language === "typescript" ? "ts" : language === "javascript" ? "js" : language === "python" ? "py" : language}</span>
              </div>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}
                className="text-xs text-[#8a8f98] bg-transparent border-none outline-none cursor-pointer hover:text-[#d0d6e0] transition-colors">
                {LANGUAGES.map((l) => <option key={l} value={l} style={{ background: "#191a1b" }}>{l}</option>)}
              </select>
            </div>

            <textarea value={code} onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="flex-1 min-h-[360px] px-5 py-4 font-mono text-sm text-[#d0d6e0] resize-none outline-none border border-white/[0.08] border-t-0 rounded-b-xl placeholder-[#3e3e44]"
              style={{ background: "#0f1011", lineHeight: 1.7, caretColor: "#7170ff" }}
              spellCheck={false} />

            <button onClick={handleReview} disabled={loading || !code.trim()}
              className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: loading ? "#4a55b0" : "linear-gradient(135deg, #5e6ad2, #7170ff)", fontWeight: 510 }}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Analyzing with MiMo-V2.5-Pro...
                </>
              ) : "Review Code →"}
            </button>
          </div>

          {/* Right — Results */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center px-4 py-2.5 rounded-t-xl border border-white/[0.08] bg-white/[0.02]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-xs text-[#62666d]">review output</span>
              {review && <span className="ml-auto text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />complete</span>}
            </div>

            <div className="flex-1 min-h-[360px] rounded-b-xl border border-white/[0.08] border-t-0 overflow-hidden" style={{ background: "#0f1011" }}>
              {!review && !loading && !error && (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-[#3e3e44]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">Paste code and click Review</p>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-[#5e6ad2] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                  <p className="text-sm text-[#62666d]">MiMo is reasoning through your code...</p>
                </div>
              )}

              {error && (
                <div className="m-4 p-4 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-sm">{error}</div>
              )}

              {review && (
                <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[500px]">
                  {/* Score + Summary */}
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                    <ScoreRing score={review.score} />
                    <p className="text-sm text-[#d0d6e0] leading-relaxed">{review.summary}</p>
                  </div>

                  {/* Security */}
                  {review.security?.length > 0 && (
                    <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                      <SectionHeader icon="🔒" label="Security" count={review.security.length} />
                      <div className="flex flex-col gap-2">
                        {review.security.map((s, i) => (
                          <div key={i} className={`p-3 rounded-lg text-xs ${severityBadge[s.severity] || severityBadge.medium}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="uppercase font-semibold text-[10px] tracking-wider">{s.severity}</span>
                            </div>
                            <p className="font-medium mb-1 text-[#f7f8f8]">{s.issue}</p>
                            <p className="text-[#8a8f98]">→ {s.fix}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bugs */}
                  {review.bugs?.length > 0 && (
                    <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                      <SectionHeader icon="🐛" label="Bugs" count={review.bugs.length} />
                      <div className="flex flex-col gap-2">
                        {review.bugs.map((b, i) => (
                          <div key={i} className={`p-3 rounded-lg text-xs ${severityBadge[b.severity] || severityBadge.low}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="uppercase font-semibold text-[10px] tracking-wider">{b.severity}</span>
                              {b.line && <span className="text-[#62666d]">line {b.line}</span>}
                            </div>
                            <p className="font-medium mb-1 text-[#f7f8f8]">{b.issue}</p>
                            <p className="text-[#8a8f98]">→ {b.fix}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvements */}
                  {review.improvements?.length > 0 && (
                    <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                      <SectionHeader icon="💡" label="Improvements" count={review.improvements.length} />
                      <div className="flex flex-col gap-2">
                        {review.improvements.map((imp, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 border ${categoryBadge[imp.category] || "bg-white/5 text-[#8a8f98] border-white/10"}`}>
                              {imp.category}
                            </span>
                            <p className="text-[#8a8f98] leading-relaxed pt-0.5">{imp.suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Positives */}
                  {review.positives?.length > 0 && (
                    <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                      <SectionHeader icon="✅" label="What's Good" count={review.positives.length} />
                      <ul className="flex flex-col gap-1.5">
                        {review.positives.map((p, i) => (
                          <li key={i} className="text-xs text-emerald-400 flex items-start gap-2">
                            <span className="mt-0.5 shrink-0">•</span><span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer stats */}
        <div className="mt-8 flex items-center justify-center gap-8 text-xs text-[#3e3e44]">
          {["Bug Detection", "Security Analysis", "Code Quality Score", "12+ Languages"].map((f) => (
            <span key={f} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#5e6ad2]" />{f}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
