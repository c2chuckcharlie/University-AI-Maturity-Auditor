
import { useState } from "react";
import { T } from "../constants";
import { ff } from "../utils";
import { LangToggle } from "./LangToggle";

export function LandingPage({ onStart, lang, setLang }: { onStart: (info: any) => void, lang: string, setLang: (l: string) => void }) {
  const t = T[lang];
  const [name, setName] = useState(""), [role, setRole] = useState(""), [institution, setInstitution] = useState("");
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 28, padding: "44px 32px 34px", background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#2563eb 100%)", borderRadius: 16, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "radial-gradient(circle at 15% 85%,rgba(255,255,255,0.07) 0%,transparent 50%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 14, right: 14 }}><LangToggle lang={lang} setLang={setLang} inHero /></div>
        <div style={{ fontSize: 38, marginBottom: 12 }}>⬡</div>
        <h1 style={{ fontSize: lang === "zh" ? 21 : 24, fontFamily: ff(lang, "head"), fontWeight: 700, margin: "0 0 10px", lineHeight: 1.3 }}>{t.appTitle}</h1>
        <p style={{ fontSize: 13.5, opacity: 0.83, maxWidth: 420, margin: "0 auto", lineHeight: 1.75, fontFamily: ff(lang) }}>{t.appSubtitle}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 18, fontSize: 12, opacity: 0.75, flexWrap: "wrap", fontFamily: ff(lang) }}>
          {t.appStats.map((s: string) => <span key={s}>✦ {s}</span>)}
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: "28px", border: "1px solid #dde4f0", boxShadow: "0 2px 16px rgba(30,58,138,0.07)" }}>
        <h2 style={{ fontSize: 17, color: "#1e3a8a", marginBottom: 20, fontFamily: ff(lang, "head") }}>{t.participantInfo}</h2>
        {[{ label: t.yourName, val: name, set: setName, ph: t.namePlaceholder }, { label: t.institution, val: institution, set: setInstitution, ph: t.institutionPlaceholder }].map(({ label, val, set, ph }) => (
          <div key={label} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, fontFamily: ff(lang) }}>{label}</label>
            <input value={val} onChange={e => set(e.target.value)} placeholder={ph} style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1.5px solid #dde4f0", borderRadius: 8, fontSize: 14, color: "#1a2a4a", outline: "none", fontFamily: ff(lang) }} />
          </div>
        ))}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10, fontFamily: ff(lang) }}>{t.yourRole} <span style={{ color: "#e74c3c" }}>*</span></label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {t.roles.map((r: string) => (
              <button key={r} onClick={() => setRole(r)} style={{ padding: "12px 14px", border: `2px solid ${role === r ? "#1e3a8a" : "#dde4f0"}`, borderRadius: 8, background: role === r ? "#1e3a8a" : "#f8faff", color: role === r ? "#fff" : "#374151", cursor: "pointer", fontSize: 13, fontWeight: role === r ? 700 : 400, textAlign: "left", transition: "all 0.18s", fontFamily: ff(lang) }}>
                {t.roleIcons[r]} {r}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => role && onStart({ name, role, institution, lang })} disabled={!role} style={{ width: "100%", padding: "14px", background: role ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : "#dde4f0", color: role ? "#fff" : "#9aaccc", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: role ? "pointer" : "not-allowed", transition: "all 0.2s", fontFamily: ff(lang, "head"), letterSpacing: 0.4 }}>
          {t.beginAssessment}
        </button>
      </div>
    </div>
  );
}
