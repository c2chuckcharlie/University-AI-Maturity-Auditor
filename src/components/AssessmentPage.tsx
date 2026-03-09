
import { T } from "../constants";
import { ff } from "../utils";
import { ProgressStepper } from "./ProgressStepper";
import { QuestionCard } from "./QuestionCard";

export function AssessmentPage({ dimIndex, participant, answers, onAnswerChange, onNext, onBack, lang }: { dimIndex: number, participant: any, answers: any, onAnswerChange: (d: string, q: string, v: number) => void, onNext: () => void, onBack: () => void, lang: string }) {
  const t = T[lang]; const dim = t.dimensions[dimIndex];
  const dimAnswers = answers[dim.id] || {};
  const allAnswered = dim.questions.every((q: any) => dimAnswers[q.id]);
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <ProgressStepper current={dimIndex} lang={lang} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: "16px 20px", background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", borderRadius: 10, color: "#fff" }}>
        <span style={{ fontSize: 28 }}>{dim.icon}</span>
        <div>
          <div style={{ fontSize: 11, opacity: 0.72, letterSpacing: 1, textTransform: "uppercase", fontFamily: ff(lang) }}>{t.dimension} {dimIndex + 1} {t.of} 5</div>
          <div style={{ fontSize: lang === "zh" ? 17 : 19, fontFamily: ff(lang, "head"), fontWeight: 700 }}>{dim.label}</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right", fontSize: 12, opacity: 0.82, fontFamily: ff(lang) }}>
          {t.respondingAs}<br /><strong>{participant.role}</strong>
        </div>
      </div>
      {dim.questions.map((q: any) => (
        <QuestionCard key={q.id} question={q} value={dimAnswers[q.id]} onChange={val => onAnswerChange(dim.id, q.id, val)} lang={lang} />
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {dimIndex > 0 && <button onClick={onBack} style={{ flex: 1, padding: "12px", border: "1.5px solid #dde4f0", borderRadius: 8, background: "#fff", color: "#374151", cursor: "pointer", fontSize: 14, fontFamily: ff(lang) }}>{t.back}</button>}
        <button onClick={onNext} disabled={!allAnswered} style={{ flex: 2, padding: "12px", background: allAnswered ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : "#dde4f0", color: allAnswered ? "#fff" : "#9aaccc", border: "none", borderRadius: 8, cursor: allAnswered ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 700, transition: "all 0.2s", fontFamily: ff(lang) }}>
          {dimIndex < t.dimensions.length - 1 ? `${t.next} ${t.dimensions[dimIndex + 1].label.split(/[\s&\/／]/)[0]} →` : t.submitAssessment}
        </button>
      </div>
      {!allAnswered && <p style={{ textAlign: "center", fontSize: 12, color: "#9aaccc", marginTop: 10, fontFamily: ff(lang) }}>{t.answerAllPrompt}</p>}
    </div>
  );
}
