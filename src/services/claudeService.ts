
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateStrategicReport(overallScore: number, scores: any[], meta: any) {
  const scoreSummary = scores.map(s =>
    `  - ${s.label}: ${s.score.toFixed(2)}/5 | Level: ${s.levelLabel} | Risk: ${s.risk} | Priority: ${s.priority}`
  ).join("\n");

  const prompt = `You are an AI governance strategist and higher education transformation expert.

Analyze this university's AI Maturity Assessment and transform it into a structured strategic governance report for university leadership, following the exact seven-section format below.

ASSESSMENT DATA:
- Institution: ${meta.institution || "Not specified"}
- Overall Score: ${overallScore.toFixed(2)} / 5.0
- Total Participants: ${meta.total}
DIMENSION SCORES:
${scoreSummary}

INSTRUCTIONS:
Generate the full report as a valid JSON object. Output ONLY the JSON, no markdown, no preamble, no extra keys.

{
  "s1_exec": "3–4 paragraph executive summary for the President/Provost. Include: maturity verdict, current situation, major risks, opportunities, and urgency of action. Use formal policy-report language.",
  "priorities": ["Priority 1 (specific and actionable)", "Priority 2", "Priority 3", "Priority 4", "Priority 5"],
  "s2_dashboard": {
    "intro": "2-sentence introduction to the dashboard for non-technical leaders.",
    "scoreExplanations": [
      "One sentence explaining what the Strategy & Governance score means institutionally.",
      "One sentence explaining the Policy & Ethics score.",
      "One sentence explaining the Infrastructure & Data score.",
      "One sentence explaining the Literacy & Prof Dev score.",
      "One sentence explaining the Career Readiness score."
    ]
  },
  "s3_risks": {
    "intro": "1-2 sentence framing of why these results matter for leadership planning.",
    "risks": [
      "Strategic risk 1 — explain consequence if unaddressed",
      "Strategic risk 2",
      "Operational risk 3",
      "Educational risk 4",
      "Reputational risk 5"
    ],
    "opportunities": [
      "Opportunity 1 — frame as competitive advantage",
      "Opportunity 2",
      "Opportunity 3",
      "Opportunity 4",
      "Opportunity 5"
    ],
    "competitive": "2-sentence competitive context: what happens if this institution does not act vs. peer institutions that are advancing."
  },
  "s4_roadmap": {
    "intro": "1-sentence roadmap framing.",
    "phase1": {
      "title": "Phase 1 — Immediate Actions (0–6 Months)",
      "items": ["Action 1", "Action 2", "Action 3", "Action 4", "Action 5"]
    },
    "phase2": {
      "title": "Phase 2 — Institutional Adoption (6–18 Months)",
      "items": ["Action 1", "Action 2", "Action 3", "Action 4", "Action 5"]
    },
    "phase3": {
      "title": "Phase 3 — Strategic Transformation (2–3 Years)",
      "items": ["Action 1", "Action 2", "Action 3", "Action 4", "Action 5"]
    }
  },
  "s5_dimensions": [
    {
      "interpretation": "What this score means for the institution in practical terms.",
      "gaps": "Key institutional gaps revealed by this score.",
      "importance": "Why this dimension is strategically important for leadership.",
      "actions": "2-3 specific recommended actions for this dimension."
    },
    { "interpretation": "...", "gaps": "...", "importance": "...", "actions": "..." },
    { "interpretation": "...", "gaps": "...", "importance": "...", "actions": "..." },
    { "interpretation": "...", "gaps": "...", "importance": "...", "actions": "..." },
    { "interpretation": "...", "gaps": "...", "importance": "...", "actions": "..." }
  ],
  "s6_stakeholders": {
    "intro": "1 sentence on why stakeholder accountability matters.",
    "leadership": ["Responsibility 1", "Responsibility 2", "Responsibility 3", "Responsibility 4"],
    "it": ["Responsibility 1", "Responsibility 2", "Responsibility 3", "Responsibility 4"],
    "faculty": ["Responsibility 1", "Responsibility 2", "Responsibility 3", "Responsibility 4"],
    "students": ["Responsibility 1", "Responsibility 2", "Responsibility 3", "Responsibility 4"]
  },
  "s7_methodology": "3-4 sentence explanation of: how scores were calculated, alignment with EDUCAUSE and Jisc frameworks, how to interpret scores, and how institutions should use this data."
}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned an empty response");
  return JSON.parse(text);
}
