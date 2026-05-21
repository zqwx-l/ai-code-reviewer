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

const severityColor: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const categoryColor: Record<string, string> = {
  performance: "bg-purple-500/20 text-purple-400",
  readability: "bg-cyan-500/20 text-cyan-400",
  maintainability: "bg-green-500/20 text-green-400",
  "best-practice": "bg-indigo-500/20 text-indigo-400",
};

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null;
  const color =
    score >= 8 ? "text-green-400" : score >= 5 ? "text-yellow-400" : "text-red-400";
  return (
    <div className="flex flex-col items-center">
      <span className={`text-5xl font-bold ${color}`}>{score}</span>
      <span className="text-gray-400 text-sm mt-1">/ 10</span>
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
    <main className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-bold">
              AI
            </div>
            <div>
              <h1 className="font-semibold text-white">CodeReview AI</h1>
              <p className="text-xs text-gray-400">Powered by MiMo-V2.5-Pro</p>
            </div>
          </div>
          <a
            href="https://platform.xiaomimimo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            MiMo API →
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Code Input */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-300">Your Code</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="flex-1 min-h-[400px] bg-gray-900 border border-gray-700 rounded-xl p-4 font-mono text-sm text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-600"
            spellCheck={false}
          />

          <button
            onClick={handleReview}
            disabled={loading || !code.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analyzing...
              </>
            ) : (
              "Review Code →"
            )}
          </button>
        </div>

        {/* Right — Review Results */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-gray-300">Review Results</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {!review && !loading && !error && (
            <div className="flex-1 min-h-[400px] bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-600">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-sm">Paste your code and click Review</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex-1 min-h-[400px] bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="animate-pulse text-4xl mb-3">⚡</div>
                <p className="text-sm">MiMo is reviewing your code...</p>
              </div>
            </div>
          )}

          {review && (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-1">
              {/* Score + Summary */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex items-center gap-6">
                <ScoreBadge score={review.score} />
                <p className="text-gray-300 text-sm leading-relaxed">{review.summary}</p>
              </div>

              {/* Security */}
              {review.security?.length > 0 && (
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    🔒 Security Issues
                  </h3>
                  <div className="flex flex-col gap-2">
                    {review.security.map((s, i) => (
                      <div key={i} className={`border rounded-lg p-3 text-xs ${severityColor[s.severity] || severityColor.medium}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="uppercase font-bold text-[10px]">{s.severity}</span>
                        </div>
                        <p className="font-medium mb-1">{s.issue}</p>
                        <p className="opacity-75">Fix: {s.fix}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bugs */}
              {review.bugs?.length > 0 && (
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    🐛 Bugs & Issues
                  </h3>
                  <div className="flex flex-col gap-2">
                    {review.bugs.map((b, i) => (
                      <div key={i} className={`border rounded-lg p-3 text-xs ${severityColor[b.severity] || severityColor.low}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="uppercase font-bold text-[10px]">{b.severity}</span>
                          {b.line && <span className="opacity-60">Line {b.line}</span>}
                        </div>
                        <p className="font-medium mb-1">{b.issue}</p>
                        <p className="opacity-75">Fix: {b.fix}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {review.improvements?.length > 0 && (
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    💡 Improvements
                  </h3>
                  <div className="flex flex-col gap-2">
                    {review.improvements.map((imp, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${categoryColor[imp.category] || "bg-gray-700 text-gray-300"}`}>
                          {imp.category}
                        </span>
                        <p className="text-gray-300">{imp.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Positives */}
              {review.positives?.length > 0 && (
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    ✅ What&apos;s Good
                  </h3>
                  <ul className="flex flex-col gap-1">
                    {review.positives.map((p, i) => (
                      <li key={i} className="text-xs text-green-400 flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
