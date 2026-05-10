"use client";

import { useState } from "react";
import { Search, Loader2, User, Briefcase, AlertCircle, CheckCircle2, AlertTriangle, XCircle, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./components/ThemeToggle";

type ProjectResult = {
  name: string;
  url: string;
  matchScore: number;
  whyItMatters: string;
  cvBullets: string[];
  keyMetrics: string[];
};

type AnalysisResult = {
  verdict: string;
  roleRelevancePercentage: number;
  summary: string;
  projects: ProjectResult[];
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (results?.summary) {
      navigator.clipboard.writeText(results.summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !jobDescription) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, jobDescription }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze projects");
      }

      const data = await response.json();
      setResults({ verdict: data.verdict || "", roleRelevancePercentage: data.roleRelevancePercentage || 0, summary: data.summary || "", projects: data.projects });
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <ThemeToggle />
      </div>
      <div className="header">
        <h1>AI Project Picker</h1>
        <p>Optimize your CV by automatically matching your best GitHub projects against any job description.</p>
      </div>

      <div className="main-content">
        <div className="card">
          <form onSubmit={handleAnalyze}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                <User size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                GitHub Username
              </label>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="e.g. torvalds"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="jobDescription">
                <Briefcase size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                Job Description
              </label>
              <textarea
                id="jobDescription"
                className="form-textarea"
                placeholder="Paste the job requirements and description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading || !username || !jobDescription}>
              {loading ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Find Best Projects
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="error-message" style={{ marginTop: '1.5rem' }}>
              <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              {error}
            </div>
          )}
        </div>

        <div>
          {results ? (
            <div className="results">
              {results.verdict && (
                <div style={{
                  padding: "1rem", 
                  marginBottom: "1rem", 
                  borderRadius: "0.75rem", 
                  background: results.verdict.includes("Strong") ? "rgba(34, 197, 94, 0.15)" : results.verdict.includes("Decent") ? "rgba(234, 179, 8, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  border: `1px solid ${results.verdict.includes("Strong") ? "rgba(34, 197, 94, 0.3)" : results.verdict.includes("Decent") ? "rgba(234, 179, 8, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {results.verdict.includes("Strong") && <CheckCircle2 color="#22c55e" size={24} />}
                    {results.verdict.includes("Decent") && <AlertTriangle color="#eab308" size={24} />}
                    {results.verdict.includes("Weak") && <XCircle color="#ef4444" size={24} />}
                    {results.verdict}
                  </div>
                  {results.roleRelevancePercentage !== undefined && (
                    <div style={{
                      background: "rgba(0, 0, 0, 0.1)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "1.125rem",
                      fontWeight: 700
                    }}>
                      {results.roleRelevancePercentage}%
                    </div>
                  )}
                </div>
              )}
              <div style={{ position: "relative", marginBottom: "0.5rem", borderRadius: "1rem", overflow: "hidden", padding: "4px" }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  style={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    background: "conic-gradient(from 0deg, blue, green, red, orange, blue)",
                    zIndex: 0,
                  }}
                />
                <div className="card" style={{ position: "relative", zIndex: 1, height: "100%", margin: 0, border: "none", borderRadius: "calc(1rem - 4px)" }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Professional Summary</h2>
                    <button
                      onClick={handleCopy}
                      title="Copy professional summary"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.25rem',
                        borderRadius: '0.25rem',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    {results.summary || "No summary generated."}
                  </p>
                </div>
              </div>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Top Matches for CV</h2>
              {results.projects.length === 0 ? (
                <div className="empty-state">
                  <AlertCircle size={48} className="empty-icon" />
                  <h3>No matching projects found</h3>
                  <p style={{ marginTop: '0.5rem' }}>Try refining your job description or checking the GitHub username.</p>
                </div>
              ) : (
                results.projects.map((project, idx) => (
                  <div key={idx} className="result-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="result-header">
                      <div className="result-title">
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          {project.name}
                        </a>
                      </div>
                      <div className="match-score">{project.matchScore}% Match</div>
                    </div>
                    
                    <div className="explanation">
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        Why it matters:
                      </div>
                      <div>
                        {project.whyItMatters}
                      </div>
                    </div>

                    <div className="cv-bullets" style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        Suggested CV Bullets:
                      </div>
                      <ul style={{ paddingLeft: '1.25rem', margin: 0, listStyleType: 'disc' }}>
                        {project.cvBullets.map((bullet, bltIdx) => (
                          <li key={bltIdx} style={{ marginBottom: '0.25rem' }}>{bullet}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="metrics-container" style={{ marginTop: '1rem' }}>
                      {project.keyMetrics.map((metric, mIdx) => (
                        <span key={mIdx} className="metric-badge">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={48} className="empty-icon" />
              <h3>Awaiting Input</h3>
              <p style={{ marginTop: '0.5rem' }}>Enter a username and job description to see your best matching projects.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
