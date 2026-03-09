
import { useState } from "react";
import { T, LEVEL_COLORS } from "../constants";
import { ff } from "../utils";
import { LevelExplainer } from "./LevelExplainer";

interface QuestionCardProps {
  key?: any;
  question: any;
  value: number;
  onChange: (v: number) => void;
  lang: string;
}

export function QuestionCard({ question, value, onChange, lang }: QuestionCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", border: "1px solid #dde4f0", borderRadius: 12, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 6px rgba(30,58,138,0.06)" }}>
      <p style={{ fontSize: 15.5, color: "#1a2a4a", lineHeight: 1.7, marginBottom: 6, fontWeight: 600, fontFamily: ff(lang, "head") }}>{question.text}</p>
      <p style={{ fontSize: 12, color: "#6b7a99", marginBottom: 14, fontStyle: lang === "en" ? "italic" : "normal", fontFamily: ff(lang) }}>{question.hint}</p>
      <LevelExplainer open={open} onToggle={() => setOpen(o => !o)} lang={lang} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {[1, 2, 3, 4, 5].map((lvl: any) => (
          <button key={lvl} onClick={() => onChange(lvl)} style={{ flex: 1, minWidth: 56, padding: "10px 4px", border: `2px solid ${value === lvl ? LEVEL_COLORS[lvl] : "#dde4f0"}`, borderRadius: 8, background: value === lvl ? LEVEL_COLORS[lvl] : "#f8faff", color: value === lvl ? "#fff" : "#4a5568", cursor: "pointer", transition: "all 0.18s", fontSize: 13, fontWeight: value === lvl ? 700 : 400 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{lvl}</div>
            <div style={{ fontSize: 9, lineHeight: 1.2, marginTop: 2, fontFamily: ff(lang) }}>
              {lang === "en" ? T.en.levelDescriptors[lvl].label.split(" / ")[0].substring(0, 9) : T.zh.levelDescriptors[lvl].label.substring(0, 6)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
