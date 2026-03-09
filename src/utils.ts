
import { SK, T, ROLE_TO_EN } from "./constants";

export const loadAll = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem(SK) || "[]");
  } catch {
    return [];
  }
};

export const saveOne = (e: any) => {
  const a = loadAll();
  a.push(e);
  localStorage.setItem(SK, JSON.stringify(a));
};

export const clearAll = () => localStorage.removeItem(SK);

export const dimScore = (responses: any[], id: string) => {
  const v: number[] = [];
  responses.forEach(r => r.answers?.[id] && Object.values(r.answers[id]).forEach((x: any) => x && v.push(x)));
  return v.length ? v.reduce((a, b) => a + b) / v.length : 0;
};

export const normRole = (r: string) => ["Faculty", "教師／教職員"].includes(r) ? "Faculty" : ["Admin/IT", "行政／資訊人員"].includes(r) ? "Admin/IT" : r;

export const radarData = (responses: any[], lang: string) => T[lang].dimensions.map((d: any) => {
  const rs: Record<string, number[]> = {};
  responses.forEach(r => {
    const k = normRole(r.role);
    if (!rs[k]) rs[k] = [];
    if (r.answers?.[d.id]) {
      const v = Object.values(r.answers[d.id]).filter(Boolean) as number[];
      if (v.length) rs[k].push(...v);
    }
  });
  const avg = (k: string) => rs[k]?.length ? rs[k].reduce((a, b) => a + b) / rs[k].length : 0;
  return {
    dimension: d.label.split(" ")[0],
    overall: +dimScore(responses, d.id).toFixed(2),
    "Admin/IT": +avg("Admin/IT").toFixed(2),
    Faculty: +avg("Faculty").toFixed(2)
  };
});

export const getRec = (id: string, s: number, lang: string) => {
  const r = T[lang].recommendations[id];
  return s < 2.5 ? r.low : s < 3.8 ? r.mid : r.high;
};

export const lvlIdx = (s: number) => Math.max(1, Math.min(5, Math.round(s)));

export const lvlLabel = (s: number, lang: string) => T[lang].levelDescriptors[lvlIdx(s)]?.label || "";

export const lvlColor = (s: number) => [undefined, "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#1abc9c"][lvlIdx(s)];

export const riskFor = (s: number) => s < 2 ? "High" : s < 3.5 ? "Medium" : "Low";

export const priorFor = (s: number) => s < 2 ? "Critical" : s < 3 ? "High" : s < 4 ? "Medium" : "Low";

export const ff = (lang: string, v = "body") => lang === "zh" ? (v === "head" ? "'Noto Serif TC',Georgia,serif" : "'Noto Sans TC',sans-serif") : (v === "head" ? "'Playfair Display','Crimson Pro',Georgia,serif" : "'Crimson Pro',Georgia,serif");

export const cleanStr = (s: string) => (s || "").replace(/[^\x00-\xFF]/g, ch => {
  const m: Record<string, string> = { "，": ",", "。": ".", "：": ":", "（": "(", "）": ")", "／": "/" };
  return m[ch] || "";
});
