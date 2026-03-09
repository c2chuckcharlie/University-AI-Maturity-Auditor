
import { T, LEVEL_COLORS } from "../constants";
import { ff } from "../utils";

export function LevelExplainer({ open, onToggle, lang }: { open: boolean, onToggle: () => void, lang: string }) {
  const t = T[lang];
  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={onToggle} style={{ background: open ? "#1e3a8a" : "transparent", border: "1.5px solid #1e3a8a", color: open ? "#fff" : "#1e3a8a", borderRadius: 6, padding: "5px 14px", fontSize: 12, fontFamily: ff(lang), cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
        ⓘ {t.explainLevels}
      </button>
      {open && (
        <div style={{ marginTop: 8, border: "1px solid #c7d2e8", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 12px rgba(30,58,138,0.08)" }}>
          {[1, 2, 3, 4, 5].map((lvl: any) => (
            <div key={lvl} style={{ padding: "10px 14px", borderBottom: lvl < 5 ? "1px solid #e8edf5" : "none", background: "#f8faff", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ minWidth: 26, height: 26, borderRadius: "50%", background: LEVEL_COLORS[lvl], color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{lvl}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12.5, color: "#1e3a8a", fontFamily: ff(lang, "head") }}>{t.levelDescriptors[lvl].label}</div>
                <div style={{ fontSize: 12, color: "#4a5568", lineHeight: 1.75, marginTop: 2, fontFamily: ff(lang) }}>{t.levelDescriptors[lvl].desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
