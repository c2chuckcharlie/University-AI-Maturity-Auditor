
import { T, ROLE_TO_EN } from "../constants";
import { dimScore, lvlLabel, riskFor, priorFor, cleanStr } from "../utils";
import { PDF } from "./pdfEngine";

export function buildPdfDataUri(allResponses: any[], myResponse: any, report: any) {
  const EN = T["en"];
  const dims = EN.dimensions;
  const scores = dims.map((d: any) => {
    const score = dimScore(allResponses, d.id);
    return { id: d.id, label: d.label, score, levelLabel: lvlLabel(score, "en"), risk: riskFor(score), priority: priorFor(score) };
  });

  const meta = {
    institution: cleanStr(myResponse.institution) || "",
    name: cleanStr(myResponse.name) || "Anonymous",
    role: ROLE_TO_EN[myResponse.role] || cleanStr(myResponse.role) || "Participant",
    total: allResponses.length,
  };

  const pdfStr = PDF.generate({ meta, scores, report });
  return "data:application/pdf;base64," + btoa(pdfStr);
}

export function triggerDownload(uri: string) {
  try {
    const a = document.createElement("a"); a.href = uri;
    a.download = "AI_Governance_Report.pdf"; a.style.display = "none";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } catch (_) { }
}

export function buildFallbackReport(overallScore: number, scores: any[]) {
  const lo = overallScore < 2.5, hi = overallScore >= 3.8;
  const verdict = lo ? "Emerging" : hi ? "Strategic" : "Defined";
  return {
    s1_exec: `This institution has achieved an overall AI maturity score of ${overallScore.toFixed(2)}/5.0, placing it in the ${verdict} category of the EDUCAUSE AI Maturity Framework. ${lo ? "This result signals urgent need for strategic investment across all five dimensions to avoid competitive disadvantage and compliance exposure." : hi ? "This result positions the institution as a sector leader, with focus now shifting toward sustaining excellence and contributing to national benchmarking." : "This result indicates meaningful progress in select areas, while targeted improvements in governance, literacy, and infrastructure are needed to reach a fully Managed posture."}\n\nThe assessment reveals ${scores.filter(s => s.risk === "High").length} high-risk dimensions requiring immediate leadership attention: ${scores.filter(s => s.risk === "High").map(s => s.label).join(", ") || "none identified"}. Dimensions performing at or above expectations include ${scores.filter(s => s.risk === "Low").map(s => s.label).join(", ") || "none yet"}. Bridging these gaps is essential to achieving coherent, institution-wide AI governance.\n\nWithout deliberate action, the institution risks falling behind peer institutions that are advancing rapidly in AI literacy, policy infrastructure, and student career preparation. The strategic roadmap in Section 4 provides a path to closing identified gaps within a 36-month horizon.`,
    priorities: [
      "Establish an AI Governance Task Force with direct C-suite accountability within 90 days",
      "Draft and ratify an institutional AI Acceptable Use Policy aligned to EDUCAUSE and Jisc frameworks",
      "Launch a mandatory AI Foundations professional development programme for all staff cohorts",
      "Conduct a comprehensive data infrastructure and vendor governance audit",
      "Integrate AI literacy and career readiness outcomes into all undergraduate programme frameworks",
    ],
    s2_dashboard: {
      intro: "The dashboard below translates raw maturity scores into a structured decision framework, enabling leadership to identify priority investment areas at a glance.",
      scoreExplanations: scores.map(sc => `A score of ${sc.score.toFixed(2)} in ${sc.label} indicates ${sc.score < 2.5 ? "a critical absence of formal AI planning." : sc.score < 3.8 ? "developing structures that require formalisation." : "strong institutional leadership."}`),
    },
    s3_risks: {
      intro: "These results carry significant implications for institutional planning.",
      risks: [
        "Strategic drift risk — without a formal AI strategy, the institution cedes competitive ground",
        "Regulatory and compliance risk — absence of AI policy and data governance frameworks exposes the institution",
        "Academic integrity risk — ungoverned AI use in teaching and assessment creates endemic integrity violations",
        "Workforce capability risk — low staff AI literacy directly reduces teaching quality",
        "Graduate employability risk — students leaving without verified AI competencies face disadvantage",
      ],
      opportunities: [
        "Research funding advantage — institutions with demonstrated AI governance maturity are more successful",
        "Student experience differentiation — AI-enhanced learning design represents a powerful differentiator",
        "Industry partnership acceleration — a visible commitment to responsible AI governance attracts employers",
        "Operational efficiency gains — systematic AI tool deployment can yield significant cost savings",
        "National governance leadership — institutions that move early can establish themselves as sector exemplars",
      ],
      competitive: "Peer institutions that have advanced to Managed or Optimizing maturity are already securing competitive advantages.",
    },
    s4_roadmap: {
      intro: "The following phased roadmap translates maturity assessment findings into a concrete implementation pathway.",
      phase1: { title: "Phase 1 — Immediate Actions (0–6 Months)", items: ["Establish AI Task Force", "Draft AI Acceptable Use Policy", "Conduct data infrastructure audit", "Launch AI literacy baseline assessment"] },
      phase2: { title: "Phase 2 — Institutional Adoption (6–18 Months)", items: ["Deploy enterprise AI platform", "Implement tiered AI professional development", "Establish AI Ethics Review Board", "Integrate AI learning outcomes into curriculum"] },
      phase3: { title: "Phase 3 — Strategic Transformation (2–3 Years)", items: ["Establish Centre for AI-Enhanced Learning", "Publish annual AI Maturity Impact Report", "Contribute to national benchmarking", "Secure major AI research grants"] },
    },
    s5_dimensions: scores.map(sc => ({
      interpretation: "Current maturity level indicates specific areas for improvement.",
      gaps: "Key gaps identified include insufficient formal structures and limited cross-departmental coordination.",
      importance: `${sc.label} is a foundational dimension for responsible and scalable AI deployment.`,
      actions: "Specific recommended actions are detailed in the full report.",
    })),
    s6_stakeholders: {
      intro: "Institutional AI maturity can only be achieved through coordinated action across all stakeholder groups.",
      leadership: ["Champion AI transformation", "Establish AI Steering Committee", "Approve institutional AI strategy", "Set KPIs for AI maturity"],
      it: ["Lead data governance programme", "Manage centralised AI vendor catalogue", "Deploy technical infrastructure", "Provide technical training"],
      faculty: ["Integrate AI tools into teaching", "Contribute to AI ethics review", "Model responsible AI use", "Engage with student AI learning"],
      students: ["Participate in AI literacy programmes", "Provide feedback on AI tool experiences", "Engage with AI governance consultation", "Apply AI competencies in placements"]},
    s7_methodology: "Maturity scores are calculated using a weighted average formula aligned with the EDUCAUSE AI Horizon Report maturity model and the Jisc Digital Capabilities Framework.",
  };
}
