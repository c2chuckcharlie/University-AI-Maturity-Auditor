
/* ══════════════════════════════════════════════════════════════════════════
   PDF ENGINE — Clean Academic Black-and-White Report
   Plain text layout: Helvetica, no colours, no graphics, no decorations.
   Sections: Cover | Exec Summary | Scores | Risks | Opportunities |
             Roadmap | Dimension Analysis | Stakeholders | Methodology
   ══════════════════════════════════════════════════════════════════════════ */
export const PDF = (() => {
  /* ── Core PDF plumbing ─────────────────────────────────────────────────── */
  const esc = (s: string) => String(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const pt = (mm: number) => +(mm * 2.8346).toFixed(2);
  const PW = 210, PH = 297;          // A4 mm
  const ML = 20, MR = 20;            // left / right margins mm
  const TW = PW - ML - MR;           // text width mm
  const MB = 18;                     // bottom margin mm (above page number line)

  function compile(pages: string[][]) {
    const O: any[] = []; const push = (s: any) => { O.push(s); return O.length; };
    push(null); push(null);
    const pids: number[] = [];
    pages.forEach(pg => {
      const cs = pg.join("\n");
      const ci = push(`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`);
      const pi = push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pt(PW)} ${pt(PH)}] ` +
        `/Contents ${ci} 0 R /Resources << /Font << ` +
        `/F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> ` +
        `/F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >> ` +
        `/F3 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >> ` +
        `>> >> >>`
      );
      pids.push(pi);
    });
    O[1] = `<< /Type /Pages /Kids [${pids.map(i => `${i} 0 R`).join(" ")}] /Count ${pids.length} >>`;
    O[0] = `<< /Type /Catalog /Pages 2 0 R >>`;
    let b = "%PDF-1.4\n"; const offs: number[] = [];
    O.forEach((o, i) => { offs.push(b.length); b += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const xp = b.length;
    b += `xref\n0 ${O.length + 1}\n0000000000 65535 f \n`;
    offs.forEach(o => { b += String(o).padStart(10, "0") + " 00000 n \n"; });
    b += `trailer\n<< /Size ${O.length + 1} /Root 1 0 R >>\nstartxref\n${xp}\n%%EOF`;
    return b;
  }

  /* ── Safety: strip non-Latin-1 characters ─────────────────────────────── */
  const safe = (s: string) => String(s).replace(/[^\x00-\xFF]/g, ch => {
    const m: Record<string, string> = {
      "\u2019": "'", "\u2018": "'", "\u201C": '"', "\u201D": '"',
      "\u2013": "-", "\u2014": "-", "\u2026": "...", "\u2022": "*",
      "\u25B8": ">", "\u25A0": "*", "\u2192": ">", "\u2713": "v"
    };
    return m[ch] || "";
  });

  /* ── Text primitives ───────────────────────────────────────────────────── */
  const TL = (s: string, x: number, y: number, sz: number, bold = false, italic = false) => {
    const f = bold ? "F2" : italic ? "F3" : "F1";
    return `BT /${f} ${sz} Tf 0 0 0 rg ${pt(x)} ${pt(y)} Td (${esc(safe(s))}) Tj ET`;
  };
  const TC = (s: string, cx: number, y: number, sz: number, bold = false) => {
    const w = safe(s).length * sz * 0.50;
    const xPt = pt(cx) - w / 2;
    return `BT /${bold ? "F2" : "F1"} ${sz} Tf 0 0 0 rg ${xPt} ${pt(y)} Td (${esc(safe(s))}) Tj ET`;
  };
  const HR = (y: number, x1 = ML, x2 = PW - MR, lw = 0.4) =>
    `${lw} w 0 0 0 RG ${pt(x1)} ${pt(y)} m ${pt(x2)} ${pt(y)} l S`;

  /* ── Word-wrap ─────────────────────────────────────────────────────────── */
  function wrap(s: string, maxCh: number) {
    const words = String(s).replace(/[^\x00-\xFF]/g, "").split(" ");
    const lines: string[] = []; let cur = "";
    words.forEach(w => {
      if (!w) return;
      if ((cur + " " + w).trim().length > maxCh) { if (cur) lines.push(cur.trim()); cur = w; }
      else cur = (cur + " " + w).trim();
    });
    if (cur.trim()) lines.push(cur.trim());
    return lines.length ? lines : [""];
  }

  /* ── Cursor-based page writer ──────────────────────────────────────────── */
  function makeDoc() {
    const pages: string[][] = [];   // completed ops arrays
    let ops: string[] = [];       // current page ops
    let y = PH - 22;    // current vertical cursor (mm from bottom)
    let pageNum = 1;

    function newPage() {
      if (ops.length) pages.push(ops);
      ops = [];
      y = PH - 22;
      pageNum++;
    }

    const USABLE_Y = MB + 6;

    function ensureSpace(needed: number) {
      if (y - needed < USABLE_Y) newPage();
    }

    function addOp(op: string) { if (op) ops.push(op); }

    function centredLine(text: string, sz: number, bold = false, gapAfter = 4) {
      ensureSpace(sz * 0.35 + gapAfter);
      addOp(TC(text, PW / 2, y, sz, bold));
      y -= sz * 0.35 + gapAfter;
    }

    function sectionHeading(title: string, sz = 13) {
      ensureSpace(sz * 0.35 + 10);
      y -= 5;
      addOp(HR(y + 1));
      y -= 2;
      addOp(TL(title, ML, y, sz, true));
      y -= sz * 0.35 + 1;
      addOp(HR(y));
      y -= 6;
    }

    function subHeading(title: string, sz = 11) {
      ensureSpace(sz * 0.35 + 6);
      y -= 3;
      addOp(TL(title, ML, y, sz, true));
      y -= sz * 0.35 + 3;
    }

    function bodyText(text: string, sz = 10.5, indent = 0, maxCh = 85) {
      const lines = wrap(text, maxCh - Math.round(indent / 2.5));
      lines.forEach(line => {
        ensureSpace(sz * 0.35 + 1.5);
        addOp(TL(line, ML + indent, y, sz));
        y -= sz * 0.35 + 1.5;
      });
    }

    function bullet(text: string, sz = 10.5, indent = 4) {
      const maxCh = 82 - Math.round(indent / 2.5);
      const lines = wrap(text, maxCh);
      lines.forEach((line, i) => {
        ensureSpace(sz * 0.35 + 1.8);
        addOp(TL(i === 0 ? ("- " + line) : ("  " + line), ML + indent, y, sz));
        y -= sz * 0.35 + 1.8;
      });
      y -= 0.5;
    }

    function labelLine(label: string, value: string, sz = 10.5) {
      ensureSpace(sz * 0.35 + 2);
      addOp(TL(label + ":  " + safe(value), ML, y, sz));
      y -= sz * 0.35 + 2;
    }

    function tableRow2(col1: string, col2: string, sz = 10, bold = false, c1w = 80) {
      ensureSpace(sz * 0.35 + 2);
      addOp(TL(safe(col1), ML, y, sz, bold));
      addOp(TL(safe(col2), ML + c1w, y, sz, bold));
      y -= sz * 0.35 + 2;
    }

    function gap(mm = 4) { y -= mm; }

    function finish(dateStr: string) {
      if (ops.length) pages.push(ops);
      const total = pages.length;
      return pages.map((pgOps, i) => {
        const footer = [
          HR(MB - 1),
          TC(`Page ${i + 1} of ${total}`, PW / 2, MB - 6, 9),
          TL(dateStr, ML, MB - 6, 9),
          TL("University AI Maturity & Governance Report", PW - MR - 80, MB - 6, 9),
        ];
        return [...pgOps, ...footer];
      });
    }

    return { centredLine, sectionHeading, subHeading, bodyText, bullet, labelLine, tableRow2, gap, newPage, finish };
  }

  function generate(d: any) {
    const { meta, scores, report } = d;
    const overall = scores.reduce((s: number, sc: any) => s + sc.score, 0) / scores.length;
    const dateStr = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
    const D = makeDoc();

    D.gap(30);
    D.centredLine("UNIVERSITY AI MATURITY &", 18, true, 6);
    D.centredLine("GOVERNANCE ASSESSMENT", 18, true, 10);
    D.centredLine("Strategic Decision-Support Report for University Leadership", 11, false, 8);

    D.gap(4);
    D.gap(2);
    D.centredLine("────────────────────────────────────────", 10, false, 6);
    D.gap(4);

    D.centredLine("ASSESSMENT RESULTS", 13, true, 6);
    D.centredLine(`Overall Maturity Score:  ${overall.toFixed(2)} / 5.0`, 12, false, 4);
    const lvlNames = ["", "Ad Hoc / Wild West", "Emerging / Early Adopters", "Defined / Safe Harbor", "Managed / Strategic", "Optimizing / Leading Edge"];
    const lvl = Math.max(1, Math.min(5, Math.round(overall)));
    D.centredLine(`Maturity Level:  ${lvlNames[lvl]}`, 11, false, 8);

    D.gap(6);
    D.centredLine("────────────────────────────────────────", 10, false, 6);
    D.gap(4);

    if (meta.institution) D.centredLine(`Institution:  ${meta.institution}`, 11, false, 4);
    D.centredLine(`Respondent:  ${meta.name}  |  Role:  ${meta.role}`, 11, false, 4);
    D.centredLine(`Total Survey Participants:  ${meta.total}`, 11, false, 4);
    D.centredLine(`Report Date:  ${dateStr}`, 11, false, 8);

    D.gap(4);
    D.centredLine("────────────────────────────────────────", 10, false, 6);
    D.gap(4);

    D.centredLine("Reference Frameworks", 10, true, 3);
    D.centredLine("EDUCAUSE AI Horizon Report  |  Jisc Digital Capabilities Framework", 9, false, 3);
    D.centredLine("IEEE Ethically Aligned Design  |  EU AI Act  |  NIST AI Risk Management", 9, false, 3);

    D.gap(8);
    D.centredLine("CONFIDENTIAL — For Senior Leadership", 9, true, 4);
    D.centredLine("AI analysis generated by Claude (Anthropic)", 9, false, 4);

    D.newPage();
    D.sectionHeading("SECTION 1 — EXECUTIVE SUMMARY");
    const execParas = (report.s1_exec || "").split(/\n+/).filter(Boolean);
    execParas.forEach((para: string) => { D.bodyText(para); D.gap(3); });
    D.gap(2);
    D.subHeading("Top Strategic Priorities");
    (report.priorities || []).slice(0, 5).forEach((p: string, i: number) => D.bullet(`${i + 1}. ${p}`));

    D.sectionHeading("SECTION 2 — INSTITUTIONAL MATURITY SCORES");
    D.bodyText(`Overall Score:  ${overall.toFixed(2)} / 5.0  —  ${lvlNames[lvl]}`);
    D.gap(3);
    const dashIntro = report.s2_dashboard?.intro || "";
    if (dashIntro) { D.bodyText(dashIntro); D.gap(3); }
    D.subHeading("Dimension Scores at a Glance");
    D.tableRow2("Dimension", "Score / Level / Risk / Priority", 10, true, 90);
    D.gap(1);
    scores.forEach((sc: any) => {
      const row = `${sc.score.toFixed(2)} / 5.0  |  ${sc.levelLabel}  |  Risk: ${sc.risk}  |  Priority: ${sc.priority}`;
      D.tableRow2(sc.label, row, 10, false, 90);
    });
    D.gap(4);
    const expls = report.s2_dashboard?.scoreExplanations || [];
    if (expls.length) {
      D.subHeading("Score Interpretation");
      scores.forEach((sc: any, i: number) => {
        if (expls[i]) { D.bullet(`${sc.label}: ${expls[i]}`); }
      });
    }
    D.gap(3);
    D.subHeading("The AI Maturity Ladder");
    const ladder = [
      ["Level 1", "Ad Hoc / Wild West", "No formal processes. AI use uncoordinated with no institutional awareness."],
      ["Level 2", "Emerging / Early Adopters", "Individual experimentation. Leadership aware but no formal structures."],
      ["Level 3", "Defined / Safe Harbor", "Policies documented. Intentional adoption but not fully integrated."],
      ["Level 4", "Managed / Strategic", "AI embedded in strategy with KPIs. Systematic governance and training."],
      ["Level 5", "Optimizing / Leading Edge", "Recognized sector leader. Continuous improvement and adaptive governance."],
    ];
    ladder.forEach(([lvlLabel, name, desc]) => {
      D.bodyText(`${lvlLabel}  —  ${name}`, 10.5, 0, 85);
      D.bodyText(desc, 10, 8, 85);
      D.gap(2);
    });

    D.sectionHeading("SECTION 3 — KEY RISKS");
    const riskIntro = report.s3_risks?.intro || "";
    if (riskIntro) { D.bodyText(riskIntro); D.gap(3); }
    (report.s3_risks?.risks || []).slice(0, 6).forEach((r: string) => D.bullet(r));
    if (report.s3_risks?.competitive) {
      D.gap(3);
      D.subHeading("Competitive Context");
      D.bodyText(report.s3_risks.competitive);
    }

    D.sectionHeading("SECTION 4 — STRATEGIC OPPORTUNITIES");
    (report.s3_risks?.opportunities || []).slice(0, 6).forEach((o: string) => D.bullet(o));

    D.sectionHeading("SECTION 5 — STRATEGIC AI ROADMAP");
    const rmIntro = report.s4_roadmap?.intro || "";
    if (rmIntro) { D.bodyText(rmIntro); D.gap(3); }
    const phases = [
      report.s4_roadmap?.phase1,
      report.s4_roadmap?.phase2,
      report.s4_roadmap?.phase3,
    ].filter(Boolean);
    phases.forEach(ph => {
      D.subHeading(ph.title || "Phase");
      (ph.items || []).slice(0, 5).forEach((item: string) => D.bullet(item));
      D.gap(2);
    });

    D.sectionHeading("SECTION 6 — DIMENSION ANALYSIS");
    scores.forEach((sc: any, idx: number) => {
      const dimReport = (report.s5_dimensions || [])[idx] || {};
      D.subHeading(`${sc.label}  (Score: ${sc.score.toFixed(2)} / 5.0  —  ${sc.levelLabel})`);
      D.labelLine("Risk Level", sc.risk);
      D.labelLine("Strategic Priority", sc.priority);
      D.gap(1);
      if (dimReport.interpretation) {
        D.bodyText("Current Maturity Interpretation:", 10.5, 0, 85);
        D.bodyText(dimReport.interpretation, 10, 4, 83);
        D.gap(1);
      }
      if (dimReport.gaps) {
        D.bodyText("Key Institutional Gaps:", 10.5, 0, 85);
        D.bodyText(dimReport.gaps, 10, 4, 83);
        D.gap(1);
      }
      if (dimReport.importance) {
        D.bodyText("Strategic Importance:", 10.5, 0, 85);
        D.bodyText(dimReport.importance, 10, 4, 83);
        D.gap(1);
      }
      if (dimReport.actions) {
        D.bodyText("Recommended Actions:", 10.5, 0, 85);
        const actItems = dimReport.actions.split(/\.\s+/).filter((a: string) => a.trim().length > 5);
        if (actItems.length > 1) {
          actItems.forEach((a: string) => D.bullet(a.trim().replace(/\.*$/, "") + "."));
        } else {
          D.bodyText(dimReport.actions, 10, 4, 83);
        }
      }
      D.gap(4);
    });

    D.sectionHeading("SECTION 7 — STAKEHOLDER RESPONSIBILITIES");
    const shIntro = report.s6_stakeholders?.intro || "";
    if (shIntro) { D.bodyText(shIntro); D.gap(3); }
    const stakeholders = [
      ["University Leadership", report.s6_stakeholders?.leadership],
      ["IT & Administration", report.s6_stakeholders?.it],
      ["Faculty", report.s6_stakeholders?.faculty],
      ["Students", report.s6_stakeholders?.students],
    ];
    stakeholders.forEach(([role, items]) => {
      if (!items?.length) return;
      D.subHeading(role);
      items.slice(0, 4).forEach((item: string) => D.bullet(item));
      D.gap(2);
    });

    D.sectionHeading("SECTION 8 — METHODOLOGY");
    const meth = report.s7_methodology || "Scores are calculated using a weighted average formula aligned with the EDUCAUSE AI Horizon Report and Jisc Digital Capabilities Framework.";
    const methParas = meth.split(/\.\s+/).filter((p: string) => p.trim().length > 10);
    if (methParas.length > 1) {
      methParas.forEach((p: string) => { D.bodyText(p.trim().replace(/\.*$/, "") + "."); D.gap(2); });
    } else {
      D.bodyText(meth);
    }
    D.gap(4);
    D.subHeading("Reference Frameworks");
    [
      "EDUCAUSE AI Horizon Report — AI strategic planning benchmarks",
      "Jisc Digital Capabilities Framework — literacy and workforce readiness",
      "IEEE Ethically Aligned Design — ethical AI governance principles",
      "EU AI Act (Education Provisions) — regulatory compliance framework",
      "NIST AI Risk Management Framework — infrastructure and data governance",
      "Internet2 Next Generation Principles — network and platform strategy",
    ].forEach(ref => D.bullet(ref));

    return compile(D.finish(dateStr));
  }

  return { generate };
})();
