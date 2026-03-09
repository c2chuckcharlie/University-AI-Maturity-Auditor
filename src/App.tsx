/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { T } from "./constants";
import { loadAll, saveOne, ff } from "./utils";
import { LangToggle } from "./components/LangToggle";
import { LandingPage } from "./components/LandingPage";
import { AssessmentPage } from "./components/AssessmentPage";
import { ResultsPage } from "./components/ResultsPage";

export default function App() {
  const [lang, setLang] = useState("en");
  const [stage, setStage] = useState("landing");
  const [participant, setParticipant] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [dimIndex, setDimIndex] = useState(0);
  const [allResponses, setAllResponses] = useState<any[]>([]);
  const [myResponse, setMyResponse] = useState<any>(null);

  useEffect(() => {
    setAllResponses(loadAll());
  }, []);

  const handleStart = (info: any) => {
    setParticipant(info);
    setLang(info.lang);
    setAnswers({});
    setDimIndex(0);
    setStage("assessing");
  };

  const handleChange = (dimId: string, qId: string, val: number) => {
    setAnswers((prev: any) => ({
      ...prev,
      [dimId]: { ...(prev[dimId] || {}), [qId]: val }
    }));
  };

  const handleNext = () => {
    const dims = T[lang].dimensions;
    if (dimIndex < dims.length - 1) {
      setDimIndex(i => i + 1);
    } else {
      const entry = {
        ...participant,
        answers,
        timestamp: Date.now(),
        id: Math.random().toString(36).slice(2)
      };
      saveOne(entry);
      setAllResponses(loadAll());
      setMyResponse(entry);
      setStage("results");
    }
  };

  const rc = allResponses.length;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f4ff 0%,#fafbff 60%,#f5f7ff 100%)", fontFamily: ff(lang) }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;600;700&family=Noto+Serif+TC:wght@400;700&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
      `}</style>
      
      <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid #dde4f0", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22, color: "#1e3a8a" }}>⬡</span>
          <span style={{ fontWeight: 700, color: "#1e3a8a", fontSize: 14, fontFamily: ff(lang, "head") }}>
            {lang === "zh" ? "AI 成熟度審核系統" : "AI Maturity Auditor"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {rc > 0 && (
            <span style={{ fontSize: 12, color: "#6b7a99", fontFamily: ff(lang) }}>
              {lang === "zh" ? `已收集 ${rc} 份回覆` : `${rc} response${rc !== 1 ? "s" : ""} collected`}
            </span>
          )}
          {stage !== "landing" && <LangToggle lang={lang} setLang={setLang} />}
        </div>
      </div>

      <div style={{ padding: "32px 20px 60px" }}>
        {stage === "landing" && (
          <LandingPage onStart={handleStart} lang={lang} setLang={setLang} />
        )}
        {stage === "assessing" && (
          <AssessmentPage
            dimIndex={dimIndex}
            participant={participant}
            answers={answers}
            onAnswerChange={handleChange}
            onNext={handleNext}
            onBack={() => dimIndex > 0 && setDimIndex(i => i - 1)}
            lang={lang}
          />
        )}
        {stage === "results" && (
          <ResultsPage allResponses={allResponses} myResponse={myResponse} lang={lang} />
        )}
      </div>
    </div>
  );
}
