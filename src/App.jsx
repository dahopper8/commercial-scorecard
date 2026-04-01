import { useState } from "react";

const dimensions = [
  {
    id: "pipeline",
    label: "Pipeline Integrity",
    icon: "◈",
    color: "#3B82F6",
    questions: [
      { q: "Stage progression is based on buyer actions, not rep sentiment", low: "Reps advance deals based on gut feel", high: "Stage gates require documented buyer actions" },
      { q: "Forecast accuracy is within 15% of actual closes in a given quarter", low: "Forecasts are routinely off by 30%+", high: "Forecast vs. actual variance is tracked and improving" },
      { q: "Pipeline coverage ratio is measured and acted on by leadership", low: "Coverage is eyeballed informally", high: "3x+ coverage is maintained and managed proactively" },
      { q: "Stale opportunities are reviewed and culled on a defined cadence", low: "Pipeline bloat is chronic; old deals never die", high: "90-day no-activity rule is enforced; pipeline reflects reality" },
    ]
  },
  {
    id: "icp",
    label: "ICP & Targeting Clarity",
    icon: "◎",
    color: "#2EC27E",
    questions: [
      { q: "The ICP is documented with firmographic and behavioral criteria", low: "ICP is tribal knowledge among senior reps", high: "Written ICP with tiered fit criteria is actively maintained" },
      { q: "Disqualification criteria are explicit and applied consistently", low: "We rarely disqualify; every lead gets chased", high: "Reps can articulate why they said no to a deal" },
      { q: "Marketing and sales agree on what a qualified lead looks like", low: "Marketing measures MQLs; sales ignores most of them", high: "Shared MQL definition with a documented SLA and conversion review" },
      { q: "ICP is regularly revisited using closed-won and churned account data", low: "ICP hasn't changed since the last planning cycle", high: "Closed-won analysis informs ICP refinement quarterly" },
    ]
  },
  {
    id: "pricing",
    label: "Pricing Discipline",
    icon: "◉",
    color: "#E85D26",
    questions: [
      { q: "List prices are documented and consistently communicated to buyers", low: "Pricing is communicated ad hoc; varies by rep", high: "Price books exist and are enforced as the starting point" },
      { q: "Discounting authority is tiered and requires documentation", low: "Reps discount freely to close; no approval needed", high: "Discount tiers require manager/VP sign-off with a documented rationale" },
      { q: "Win/loss analysis includes deal margin, not just revenue", low: "We measure win rate; margin is a finance problem", high: "Every deal is reviewed for margin; low-margin wins are flagged" },
      { q: "Pricing changes are A/B tested or piloted before full rollout", low: "Pricing changes are made based on competitor intel or gut", high: "Pricing experiments are run with defined success metrics" },
    ]
  },
  {
    id: "attribution",
    label: "Attribution & Measurement",
    icon: "◐",
    color: "#A855F7",
    questions: [
      { q: "Marketing investment is tied to pipeline and revenue outcomes", low: "Marketing reports on impressions, clicks, and MQLs", high: "Marketing has a defined pipeline and revenue contribution target" },
      { q: "Lead source attribution is tracked through close", low: "Attribution is lost after the MQL handoff to sales", high: "Multi-touch attribution is tracked from first touch to close" },
      { q: "Campaign ROI is calculated and used to make reinvestment decisions", low: "Campaign spend is based on last year's budget plus a percentage", high: "Campaigns are ranked by ROI; underperformers are cut or restructured" },
      { q: "A/B testing is used regularly to improve conversion rates", low: "Creative and messaging decisions are made by committee", high: "CRO is an ongoing practice with documented learnings" },
    ]
  },
  {
    id: "enablement",
    label: "Sales Enablement",
    icon: "◑",
    color: "#EAB308",
    questions: [
      { q: "New reps reach quota attainment target within a defined onboarding window", low: "Ramp time is undefined; new reps figure it out", high: "Structured onboarding with milestone gates and a defined ramp period" },
      { q: "A standard sales methodology is applied consistently across the team", low: "Every rep has their own approach; coaching is ad hoc", high: "A defined methodology (MEDDIC, Challenger, etc.) is trained and reinforced" },
      { q: "Win/loss reviews are conducted and learnings are shared with the full team", low: "Loss reviews happen occasionally; wins are celebrated, not analyzed", high: "Formal win/loss process with findings shared monthly" },
      { q: "Competitive intelligence is current, accessible, and rep-ready", low: "Reps handle competitive situations on their own", high: "Battlecards are maintained, tested, and updated quarterly" },
    ]
  }
];

const maturityLevels = [
  { min: 0, max: 25, label: "Ad Hoc", color: "#E85D26", description: "Commercial operations are informal and founder/rep-dependent. Value leakage is significant and often invisible. The business is growing despite its commercial infrastructure, not because of it." },
  { min: 26, max: 50, label: "Developing", color: "#EAB308", description: "Core processes exist but aren't enforced consistently. Revenue is predictable in good quarters but fragile. Leadership has identified the gaps; the organization hasn't yet closed them." },
  { min: 51, max: 75, label: "Defined", color: "#3B82F6", description: "Commercial infrastructure is documented and largely followed. Forecasting is reliable. Marketing and sales are aligned on the basics. The ceiling is execution consistency and measurement rigor." },
  { min: 76, max: 100, label: "Optimized", color: "#2EC27E", description: "The commercial engine is a competitive advantage. Attribution is tight, pricing is disciplined, and the ICP is continuously refined by data. The team is improving the system, not just operating it." },
];

export default function CommercialScorecard() {
  const [scores, setScores] = useState({});
  const [view, setView] = useState("survey"); // survey | results

  const setScore = (dimId, qIdx, val) => {
    setScores(prev => ({ ...prev, [`${dimId}-${qIdx}`]: val }));
  };

  const getScore = (dimId, qIdx) => scores[`${dimId}-${qIdx}`] ?? null;

  const dimScore = (dim) => {
    const vals = dim.questions.map((_, i) => getScore(dim.id, i)).filter(v => v !== null);
    if (vals.length === 0) return null;
    return Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 4)) * 100);
  };

  const totalAnswered = Object.keys(scores).length;
  const totalQuestions = dimensions.reduce((a, d) => a + d.questions.length, 0);
  const overallScore = totalAnswered > 0
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / (totalAnswered * 4) * 100)
    : 0;

  const maturity = maturityLevels.find(m => overallScore >= m.min && overallScore <= m.max) || maturityLevels[0];

  const weakest = [...dimensions].sort((a, b) => {
    const sa = dimScore(a) ?? 999, sb = dimScore(b) ?? 999;
    return sa - sb;
  }).slice(0, 2).filter(d => dimScore(d) !== null);

  const complete = totalAnswered === totalQuestions;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
      `}</style>

      {/* Header */}
      <div style={{ background: "#111827", padding: "28px 40px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#E85D26", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>
            Commercial Infrastructure Assessment
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#f9fafb", letterSpacing: "-0.02em" }}>
            Commercial Maturity Scorecard
          </h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 13, lineHeight: 1.5 }}>
            20 questions · 5 dimensions · ~8 minutes · Built for operators assessing their commercial infrastructure
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {["survey", "results"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view === v ? "#E85D26" : "transparent",
                color: view === v ? "white" : "#6b7280",
                border: `1px solid ${view === v ? "#E85D26" : "#374151"}`,
                borderRadius: 6, padding: "6px 16px",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                textTransform: "capitalize", letterSpacing: "0.04em",
                transition: "all 0.15s"
              }}>{v === "survey" ? "Assessment" : "Results"}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 40px 80px" }}>

        {view === "survey" && (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "'DM Mono', monospace" }}>{totalAnswered}/{totalQuestions} answered</span>
                {complete && <span style={{ fontSize: 12, color: "#2EC27E", fontWeight: 600 }}>✓ Complete — view results</span>}
              </div>
              <div style={{ background: "#e5e7eb", height: 4, borderRadius: 2 }}>
                <div style={{ background: "#E85D26", height: "100%", borderRadius: 2, width: `${(totalAnswered / totalQuestions) * 100}%`, transition: "width 0.3s" }} />
              </div>
            </div>

            {dimensions.map(dim => (
              <div key={dim.id} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <span style={{ fontSize: 18, color: dim.color }}>{dim.icon}</span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>{dim.label}</h2>
                    {dimScore(dim) !== null && (
                      <span style={{ fontSize: 11, color: dim.color, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{dimScore(dim)}% mature</span>
                    )}
                  </div>
                </div>

                {dim.questions.map((q, i) => {
                  const val = getScore(dim.id, i);
                  return (
                    <div key={i} style={{
                      background: "white", border: "1px solid #e5e7eb",
                      borderRadius: 10, padding: "18px 20px", marginBottom: 10,
                      borderLeft: val !== null ? `3px solid ${dim.color}` : "3px solid #e5e7eb",
                      transition: "border-color 0.2s"
                    }}>
                      <p style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.5 }}>{q.q}</p>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#9ca3af", flex: 1, lineHeight: 1.3 }}>{q.low}</span>
                        <div style={{ display: "flex", gap: 6 }}>
                          {[1, 2, 3, 4].map(v => (
                            <button key={v} onClick={() => setScore(dim.id, i, v)} style={{
                              width: 34, height: 34, borderRadius: 6,
                              background: val === v ? dim.color : val !== null && v <= val ? dim.color + "33" : "#f3f4f6",
                              color: val === v ? "white" : val !== null && v <= val ? dim.color : "#6b7280",
                              border: val === v ? `2px solid ${dim.color}` : "2px solid transparent",
                              fontWeight: 700, fontSize: 13, cursor: "pointer",
                              transition: "all 0.15s", fontFamily: "'DM Mono', monospace"
                            }}>{v}</button>
                          ))}
                        </div>
                        <span style={{ fontSize: 11, color: "#9ca3af", flex: 1, textAlign: "right", lineHeight: 1.3 }}>{q.high}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {complete && (
              <button onClick={() => setView("results")} style={{
                background: "#E85D26", color: "white", border: "none",
                borderRadius: 8, padding: "14px 32px", fontSize: 14,
                fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em",
                width: "100%", marginTop: 8
              }}>
                View Your Results →
              </button>
            )}
          </div>
        )}

        {view === "results" && (
          <div style={{ animation: "fadeIn 0.4s ease both" }}>
            {totalAnswered < 4 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>◈</div>
                <p style={{ fontSize: 15 }}>Complete at least one dimension in the Assessment tab to see results.</p>
              </div>
            ) : (
              <>
                {/* Overall */}
                <div style={{
                  background: "#111827", borderRadius: 12, padding: "28px 32px",
                  marginBottom: 24, display: "flex", gap: 28, alignItems: "center"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 52, fontWeight: 800, color: maturity.color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{overallScore}</div>
                    <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>Overall Score</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: maturity.color, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>Maturity Level</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#f9fafb", marginBottom: 8 }}>{maturity.label}</div>
                    <p style={{ margin: 0, color: "#9ca3af", fontSize: 13, lineHeight: 1.6 }}>{maturity.description}</p>
                  </div>
                </div>

                {/* Dimension bars */}
                <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "24px", marginBottom: 24 }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 700, color: "#111827" }}>Dimension Breakdown</h3>
                  {dimensions.map(dim => {
                    const s = dimScore(dim);
                    if (s === null) return null;
                    return (
                      <div key={dim.id} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{dim.label}</span>
                          <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: dim.color, fontWeight: 600 }}>{s}%</span>
                        </div>
                        <div style={{ background: "#f3f4f6", height: 8, borderRadius: 4 }}>
                          <div style={{ background: dim.color, height: "100%", borderRadius: 4, width: `${s}%`, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Priorities */}
                {weakest.length > 0 && (
                  <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "24px", marginBottom: 24 }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#92400e" }}>
                      Highest-Leverage Improvement Areas
                    </h3>
                    {weakest.map(dim => (
                      <div key={dim.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #fed7aa" }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 4 }}>{dim.label} · {dimScore(dim)}%</div>
                        <p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>
                          {dim.id === "pipeline" && "Pipeline integrity is the foundation of forecast reliability and commercial credibility. Start with a pipeline audit and stage-gate criteria."}
                          {dim.id === "icp" && "Targeting clarity drives everything downstream — MQL quality, win rates, onboarding success. A joint ICP definition session with sales and marketing typically unlocks fast gains."}
                          {dim.id === "pricing" && "Pricing discipline is the highest-ROI commercial lever most teams under-invest in. Begin with a discount audit before touching list prices."}
                          {dim.id === "attribution" && "Without attribution, marketing investment decisions are political rather than analytical. Even a basic first-touch/last-touch model beats no model."}
                          {dim.id === "enablement" && "Enablement gaps compound — every quarter a rep underperforms due to poor onboarding is a quarter of lost productivity. Ramp time and methodology consistency are the first two levers."}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ padding: "16px 20px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "'DM Mono', monospace" }}>David Hopper · Commercial Operations & Transformation</span>
                  <button onClick={() => setView("survey")} style={{ background: "none", border: "none", color: "#E85D26", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>← Revise answers</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
