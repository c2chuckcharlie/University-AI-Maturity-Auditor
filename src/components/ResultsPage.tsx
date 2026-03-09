
import { useState } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { T } from "../constants";
import { dimScore, radarData, lvlLabel, lvlColor, riskFor, priorFor, getRec, ff, clearAll, cleanStr } from "../utils";
import { generateStrategicReport } from "../services/claudeService";
import { buildPdfDataUri, triggerDownload, buildFallbackReport } from "../services/reportService";

export function ResultsPage({ allResponses, myResponse, lang }: { allResponses: any[], myResponse: any, lang: string }) {
  const t = T[lang];
  const [status, setStatus] = useState("idle");
  const [step, setStep] = useState("");
  const [pdfReady, setPdfReady] = useState<string | null>(null);
  const rd = radarData(allResponses, lang);
  const total = allResponses.length;
  const enDims = T["en"].dimensions;
  const overall = enDims.reduce((s: number, d: any) => s + dimScore(allResponses, d.id), 0) / enDims.length;
  const scores = T[lang].dimensions.map((d: any) => ({ dim: d, score: dimScore(allResponses, d.id) }));
  const busy = status === "analysing" || status === "building";

  const handlePDF = async () => {
    setStatus("analysing"); setStep(lang === "zh" ? "步驟 1/3 — AI 正在分析評估結果…" : "Step 1/3 — AI analysing your assessment results…");
    setPdfReady(null);
    try {
      const enScores = enDims.map((d: any) => ({ id: d.id, label: d.label, score: dimScore(allResponses, d.id), levelLabel: lvlLabel(dimScore(allResponses, d.id), "en"), risk: riskFor(dimScore(allResponses, d.id)), priority: priorFor(dimScore(allResponses, d.id)) }));
      const meta = { institution: cleanStr(myResponse.institution) || "", name: cleanStr(myResponse.name) || "Anonymous", role: myResponse.role || "Participant", total: allResponses.length };

      let report;
      setStep(lang === "zh" ? "步驟 2/3 — 生成 7 節策略報告內容…" : "Step 2/3 — Generating 7-section strategic report content…");
      try {
        report = await generateStrategicReport(overall, enScores, meta);
      } catch (apiErr) {
        console.warn("API unavailable, using fallback:", apiErr);
        report = buildFallbackReport(overall, enScores);
      }

      setStatus("building"); setStep(lang === "zh" ? "步驟 3/3 — 建構 8 頁 PDF 報告…" : "Step 3/3 — Building 8-page PDF report…");
      await new Promise(r => setTimeout(r, 80));

      const uri = buildPdfDataUri(allResponses, myResponse, report);
      setPdfReady(uri);
      triggerDownload(uri);
      setStatus("ready"); setStep("");
    } catch (e: any) {
      console.error(e); setStatus("error"); setStep("Error: " + e.message);
    }
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%)", borderRadius: 14, padding: "28px 32px", color: "#fff", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4, fontFamily: ff(lang) }}>{t.assessmentComplete}</div>
          <h1 style={{ fontFamily: ff(lang, "head"), fontSize: lang === "zh" ? 18 : 20, margin: 0 }}>{t.aiMaturityReport}</h1>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4, fontFamily: ff(lang) }}>{total} {t.participants} · {myResponse.role}{myResponse.institution ? ` · ${myResponse.institution}` : ""}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1 }}>{overall.toFixed(1)}</div>
          <div style={{ fontSize: 11, opacity: 0.75, fontFamily: ff(lang) }}>/ 5.0 {t.overallScore}</div>
          <div style={{ fontSize: 11, marginTop: 4, background: "rgba(255,255,255,0.18)", borderRadius: 4, padding: "2px 10px", fontFamily: ff(lang) }}>{lvlLabel(overall, lang)}</div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #dde4f0", marginBottom: 24, boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
        <h2 style={{ fontSize: 16, color: "#1e3a8a", marginBottom: 4, fontFamily: ff(lang, "head") }}>{t.institutionalRadar}</h2>
        <p style={{ fontSize: 12, color: "#6b7a99", marginBottom: 16, fontFamily: ff(lang) }}>{t.radarSubtitle}</p>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={rd} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
            <PolarGrid stroke="#dde4f0" />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "#374151", fontFamily: lang === "zh" ? "'Noto Sans TC',sans-serif" : "Georgia,serif" }} />
            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10, fill: "#9aaccc" }} tickCount={6} />
            <Radar name={lang === "zh" ? "整體" : "Overall"} dataKey="overall" stroke="#1e3a8a" fill="#1e3a8a" fillOpacity={0.15} strokeWidth={2.5} />
            <Radar name="Admin/IT" dataKey="Admin/IT" stroke="#2563eb" fill="#2563eb" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 2" />
            <Radar name={lang === "zh" ? "教師" : "Faculty"} dataKey="Faculty" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 2" />
            <Legend wrapperStyle={{ fontSize: 12, fontFamily: ff(lang) }} />
            <Tooltip formatter={(v: number) => v.toFixed(2)} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #dde4f0", marginBottom: 24, boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
        <h2 style={{ fontSize: 16, color: "#1e3a8a", marginBottom: 20, fontFamily: ff(lang, "head") }}>{t.dimensionBreakdown}</h2>
        {scores.map(({ dim, score }: any) => (
          <div key={dim.id} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid #f0f4f8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 20, color: dim.color }}>{dim.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#1a2a4a", fontSize: 14, fontFamily: ff(lang, "head") }}>{dim.label}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: riskFor(score) === "High" ? "#fee2e2" : riskFor(score) === "Medium" ? "#fef3c7" : "#dcfce7", color: riskFor(score) === "High" ? "#dc2626" : riskFor(score) === "Medium" ? "#d97706" : "#16a34a", fontWeight: 600 }}>{riskFor(score)} Risk</span>
                    <span style={{ fontWeight: 800, color: lvlColor(score), fontSize: 16 }}>{score.toFixed(2)}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <div style={{ flex: 1, height: 8, background: "#e8edf5", borderRadius: 4 }}>
                    <div style={{ height: "100%", width: `${(score / 5) * 100}%`, background: lvlColor(score), borderRadius: 4, transition: "width 0.6s ease" }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#6b7a99", whiteSpace: "nowrap", fontFamily: ff(lang) }}>{lvlLabel(score, lang)}</span>
                </div>
              </div>
            </div>
            <div style={{ background: "#f8faff", border: "1px solid #e8edf5", borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: "#374151", lineHeight: 1.8, fontFamily: ff(lang) }}>
              <strong style={{ color: "#1e3a8a", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{t.priorityRec}</strong>
              <br />{getRec(dim.id, score, lang)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "linear-gradient(135deg,#f0f4ff,#e8edf8)", borderRadius: 12, padding: "24px", border: "1px solid #c7d2e8", marginBottom: 16, boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 32 }}>📋</div>
          <div>
            <h3 style={{ fontSize: 16, color: "#1e3a8a", margin: "0 0 6px", fontFamily: ff(lang, "head") }}>
              {lang === "zh" ? "8 頁 AI 策略治理報告（英文版）" : "8-Page Strategic AI Governance Report (English)"}
            </h3>
            <p style={{ fontSize: 13, color: "#4a5568", margin: 0, lineHeight: 1.65, fontFamily: ff(lang) }}>
              {lang === "zh"
                ? "AI 將根據您的評估結果，自動生成一份完整的 8 頁英文策略報告，包含 7 大章節，適合提交給校長、教務長及董事會。"
                : "AI analyses your results and generates a complete 8-page strategic governance report with all 7 sections — suitable for the President, Provost, Board, and institutional governance documents."}
            </p>
          </div>
        </div>
        <button onClick={handlePDF} disabled={busy} style={{ width: "100%", padding: "15px 20px", background: busy ? "#5b7bbf" : "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", fontFamily: ff(lang, "head"), display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center", gap: 12, transition: "all 0.2s", boxShadow: busy ? "none" : "0 4px 16px rgba(30,58,138,0.35)" }}>
          {busy
            ? <><span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />{step || t.downloading}</>
            : t.downloadPDF}
        </button>
      </div>

      {(status === "ready" || status === "error") && (
        <div style={{ marginBottom: 16, padding: "16px 20px", background: status === "ready" ? "#f0fdf4" : "#fef2f2", border: `1.5px solid ${status === "ready" ? "#86efac" : "#fca5a5"}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 22 }}>{status === "ready" ? "✅" : "❌"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: status === "ready" ? "#166534" : "#dc2626", fontFamily: "Georgia,serif" }}>
              {status === "ready"
                ? "Strategic Governance Report ready — 8 pages, all 7 sections, English PDF."
                : "Report generation failed. Please try again."}
            </div>
            {status === "ready" && <div style={{ fontSize: 12, color: "#15803d", marginTop: 2 }}>Report is standardised in English for international sharing. If the file did not download automatically, click <strong>Save PDF</strong>.</div>}
            {status === "error" && <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 2 }}>{step}</div>}
          </div>
          {status === "ready" && pdfReady && (
            <a href={pdfReady} download="AI_Governance_Report.pdf" style={{ padding: "11px 24px", background: "linear-gradient(135deg,#166534,#16a34a)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 3px 10px rgba(22,101,52,0.3)" }}>
              ⬇ Save PDF
            </a>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button onClick={() => window.location.reload()} style={{ flex: 1, minWidth: 140, padding: "13px 20px", border: "1.5px solid #1e3a8a", background: "#fff", color: "#1e3a8a", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: ff(lang) }}>{t.addRespondent}</button>
        <button onClick={() => { clearAll(); window.location.reload(); }} style={{ padding: "13px 16px", border: "1.5px solid #fca5a5", background: "#fff", color: "#dc2626", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: ff(lang) }}>{t.clearData}</button>
      </div>
      <p style={{ fontSize: 11, color: "#9aaccc", textAlign: "center", marginTop: 10, fontFamily: ff(lang) }}>{t.privacyNote}</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
