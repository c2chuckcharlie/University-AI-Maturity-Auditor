
import { T } from "../constants";

export function LangToggle({ lang, setLang, inHero }: { lang: string, setLang: (l: string) => void, inHero?: boolean }) {
  return (
    <div style={{ display: "flex", background: inHero ? "rgba(255,255,255,0.18)" : "#f0f4ff", borderRadius: 8, padding: 3, border: inHero ? "1px solid rgba(255,255,255,0.3)" : "1px solid #c7d2e8", gap: 2 }}>
      {["en", "zh"].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{ padding: "5px 13px", borderRadius: 6, border: "none", background: lang === l ? (inHero ? "rgba(255,255,255,0.9)" : "#1e3a8a") : "transparent", color: lang === l ? (inHero ? "#1e3a8a" : "#fff") : (inHero ? "rgba(255,255,255,0.85)" : "#4a5568"), fontWeight: lang === l ? 700 : 400, cursor: "pointer", fontSize: 13, transition: "all 0.18s", fontFamily: l === "zh" ? "'Noto Serif TC',serif" : "inherit" }}>
          {l === "en" ? "EN" : "繁中"}
        </button>
      ))}
    </div>
  );
}
