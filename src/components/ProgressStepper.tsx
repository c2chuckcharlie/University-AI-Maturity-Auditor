
import { T } from "../constants";
import { ff } from "../utils";

export function ProgressStepper({ current, lang }: { current: number, lang: string }) {
  const dims = T[lang].dimensions;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        {dims.map((d: any, i: number) => (
          <div key={d.id} style={{ textAlign: "center", opacity: i <= current ? 1 : 0.38, transition: "opacity 0.3s", flex: 1 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: i < current ? "#1e3a8a" : i === current ? "#3b82f6" : "#dde4f0", color: i <= current ? "#fff" : "#9aaccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, margin: "0 auto 4px", fontWeight: 700, border: i === current ? "3px solid #93c5fd" : "none", boxSizing: "border-box" }}>
              {i < current ? "✓" : d.icon}
            </div>
            <div style={{ fontSize: 9, color: i <= current ? "#1e3a8a" : "#9aaccc", maxWidth: 60, margin: "0 auto", lineHeight: 1.25, fontFamily: ff(lang) }}>
              {d.label.split(/[\s&\/／]/)[0]}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 4, background: "#e8edf5", borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${(current / (dims.length - 1)) * 100}%`, background: "linear-gradient(90deg,#1e3a8a,#3b82f6)", borderRadius: 2, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}
