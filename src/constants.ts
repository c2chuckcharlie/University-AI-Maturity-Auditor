
export const LEVEL_COLORS: Record<number, string> = {
  1: "#e74c3c",
  2: "#e67e22",
  3: "#f1c40f",
  4: "#2ecc71",
  5: "#1abc9c"
};

export const SK = "uai_v6";

export const ROLE_TO_EN: Record<string, string> = {
  "Faculty": "Faculty",
  "Admin/IT": "Admin/IT",
  "Senior Administrator": "Senior Administrator",
  "Student Representative": "Student Representative",
  "教師／教職員": "Faculty",
  "行政／資訊人員": "Admin/IT",
  "高階行政主管": "Senior Administrator",
  "學生代表": "Student Representative"
};

export const T: any = {
  en: {
    appTitle: "University AI Maturity Auditor",
    appSubtitle: "A structured self-assessment framework aligned with EDUCAUSE and Jisc best practices.",
    appStats: ["5 Dimensions", "15 Questions", "Radar Analysis", "8-Page Strategic PDF"],
    participantInfo: "Participant Information",
    yourName: "Your Name (optional)",
    namePlaceholder: "e.g. Dr. Jane Smith",
    institution: "Institution Name (optional)",
    institutionPlaceholder: "e.g. State University",
    yourRole: "Your Role",
    beginAssessment: "Begin Assessment →",
    dimension: "Dimension",
    of: "of",
    respondingAs: "Responding as:",
    explainLevels: "Explain the Levels",
    back: "← Back",
    next: "Next:",
    submitAssessment: "Submit Assessment ✓",
    answerAllPrompt: "Please answer all questions to continue.",
    assessmentComplete: "Assessment Complete",
    aiMaturityReport: "Strategic AI Governance Report",
    participants: "participants",
    overallScore: "Overall Score",
    institutionalRadar: "Institutional Radar — 5-Dimension View",
    radarSubtitle: "Overlay shows perception gap between Admin/IT and Faculty respondents.",
    radarNote: "ℹ️ Role overlays appear when both Admin/IT and Faculty responses exist.",
    dimensionBreakdown: "Dimension Breakdown & Recommendations",
    priorityRec: "Priority Recommendation:",
    refFrameworks: "📚 Reference Frameworks",
    downloadPDF: "⬇  Generate Strategic Governance Report (English PDF)",
    downloading: "Generating…",
    addRespondent: "+ Add Another Respondent",
    clearData: "🗑 Clear All Data",
    privacyNote: "All data stored locally in your browser. No data is sent to any server.",
    roles: ["Faculty", "Admin/IT", "Senior Administrator", "Student Representative"],
    roleIcons: {
      "Faculty": "👩‍🏫",
      "Admin/IT": "⚙️",
      "Senior Administrator": "🏛️",
      "Student Representative": "🎓"
    },
    levelDescriptors: {
      1: { label: "Ad Hoc / Wild West", desc: "No formal processes. AI use entirely uncoordinated with no institutional awareness, policy, or support." },
      2: { label: "Emerging / Early Adopters", desc: "Individuals experimenting. Leadership aware but no committed resources or formal structures yet." },
      3: { label: "Defined / Safe Harbor", desc: "Policies documented and communicated. Baseline support exists. Intentional but not fully integrated." },
      4: { label: "Managed / Strategic", desc: "AI embedded in strategy with measurable KPIs. Cross-departmental governance. Systematic training." },
      5: { label: "Optimizing / Leading Edge", desc: "Recognized sector leader. Continuous improvement, research contributions, adaptive governance." },
    },
    dimensions: [
      {
        id: "strategy", label: "Strategy & Governance", icon: "◈", color: "#1e3a8a", questions: [
          { id: "s1", text: "How well-articulated is your institution's AI strategy?", hint: "Consider whether there is a documented plan with clear ownership and timelines." },
          { id: "s2", text: "To what extent does institutional leadership actively champion AI transformation?", hint: "Think about whether the President, Provost, or CIO publicly drive the AI agenda." },
          { id: "s3", text: "How integrated is AI into the institution's long-term strategic plan?", hint: "Is AI a standalone initiative or woven into accreditation, enrollment, and research goals?" },
        ]
      },
      {
        id: "policy", label: "Policy & Ethics", icon: "⚖", color: "#1e40af", questions: [
          { id: "p1", text: "How comprehensive is your institution's AI acceptable use policy (AUP)?", hint: "Does the AUP cover academic integrity, data privacy, bias, and staff use cases?" },
          { id: "p2", text: "How clearly are ethical guidelines for AI communicated to all stakeholders?", hint: "Are there training modules, signed acknowledgments, or visible codes of conduct?" },
          { id: "p3", text: "How effectively does the institution address AI bias and equity concerns?", hint: "Is there a review process for AI tools to evaluate differential impact on student groups?" },
        ]
      },
      {
        id: "infrastructure", label: "Infrastructure & Data", icon: "⬡", color: "#1d4ed8", questions: [
          { id: "i1", text: "How mature is the institution's data infrastructure to support AI initiatives?", hint: "Consider data warehouses, APIs, data quality programs, and governance frameworks." },
          { id: "i2", text: "How well does the institution manage AI vendor contracts and procurement?", hint: "Are there standard data processing agreements (DPAs) and risk assessments for EdTech AI?" },
          { id: "i3", text: "How equipped is the technical infrastructure to support scalable AI tools?", hint: "Think about compute resources, cloud strategy, LMS integration, and cybersecurity." },
        ]
      },
      {
        id: "literacy", label: "Literacy & Professional Dev", icon: "✦", color: "#2563eb", questions: [
          { id: "l1", text: "How widespread is foundational AI literacy across faculty and staff?", hint: "Can most employees articulate what generative AI is, how it works, and its limitations?" },
          { id: "l2", text: "How robust are professional development programs for using AI in teaching and administration?", hint: "Are there workshops, communities of practice, or incentive structures for upskilling?" },
          { id: "l3", text: "How effectively are AI literacy concepts integrated into the curriculum for students?", hint: "Do students learn about AI tools, critical evaluation, and ethical use across disciplines?" },
        ]
      },
      {
        id: "career", label: "Career Readiness", icon: "◉", color: "#3b82f6", questions: [
          { id: "c1", text: "How well does the institution prepare students for AI-augmented workplaces?", hint: "Are graduates equipped with both technical and soft skills needed in AI-transformed industries?" },
          { id: "c2", text: "How actively does the institution partner with industry on AI-related employability?", hint: "Consider co-ops, advisory boards, research partnerships, and curriculum co-design." },
          { id: "c3", text: "How systematically does the institution track AI-related career outcomes?", hint: "Are employment rates, salary premiums, or skills certifications tracked and reported?" },
        ]
      },
    ],
    recommendations: {
      strategy: { low: "Establish an AI Task Force with cross-functional representation. Reference EDUCAUSE AI Horizon Report for strategic framing. Develop a 3-year roadmap with KPIs aligned to accreditation.", mid: "Elevate AI from project to institutional priority. Create AI Steering Committee with C-suite accountability.", high: "Contribute to Jisc national AI benchmarking. Seek EDUCAUSE Award recognition. Share playbooks sector-wide." },
      policy: { low: "Adopt an AI Acceptable Use Policy immediately. Reference Jisc Thinking about AI and EDUCAUSE guidance for templates.", mid: "Implement AI Ethics Review Board. Align with IEEE Ethically Aligned Design and EU AI Act requirements.", high: "Share policy framework openly. Commission annual independent policy audits." },
      infrastructure: { low: "Conduct data audit to establish a single source of truth. Require all EdTech vendors to sign FERPA/GDPR-compliant DPAs.", mid: "Build centralized AI tool catalogue. Integrate LMS data pipelines with analytics dashboards.", high: "Lead in research data infrastructure. Publish data governance model. Contribute to open-source EdTech AI." },
      literacy: { low: "Launch mandatory AI Foundations module for all staff (8-10 hours). Reference Jisc Digital Capabilities and EDUCAUSE Digital Fluency models.", mid: "Create tiered professional development pathways. Embed AI literacy in faculty orientation. Fund micro-credentials.", high: "Establish Center for AI-Enhanced Teaching. Publish open courseware on AI literacy." },
      career: { low: "Map AI skills to top 10 degree programs. Partner with employers to co-design learning outcomes. Add AI literacy to graduate attributes.", mid: "Integrate AI in the Workplace module. Build industry advisory board. Track AI employment outcomes.", high: "Position as regional AI talent hub. Co-invest in apprenticeships. Publish annual AI Employability Impact Reports." },
    },
    refList: ["EDUCAUSE AI Horizon Report", "Jisc Digital Capabilities Framework", "IEEE Ethically Aligned Design", "EU AI Act (Education Provisions)", "NIST AI Risk Management Framework", "Internet2 Next Generation Principles"],
  },
  zh: {
    appTitle: "大學人工智慧成熟度審核系統",
    appSubtitle: "依據 EDUCAUSE 及 Jisc 最佳實踐所建立的結構化自評框架。",
    appStats: ["5 個評估維度", "15 道題目", "雷達圖分析", "8 頁策略 PDF 報告"],
    participantInfo: "受測者資料",
    yourName: "您的姓名（選填）",
    namePlaceholder: "例如：王大明博士",
    institution: "學校名稱（選填）",
    institutionPlaceholder: "例如：國立台灣大學",
    yourRole: "您的角色",
    beginAssessment: "開始評估 →",
    dimension: "維度",
    of: "之",
    respondingAs: "目前角色：",
    explainLevels: "說明各級別",
    back: "← 返回",
    next: "下一步：",
    submitAssessment: "提交評估 v",
    answerAllPrompt: "請回答本頁所有題目後才能繼續。",
    assessmentComplete: "評估完成",
    aiMaturityReport: "AI 策略治理報告",
    participants: "位受測者",
    overallScore: "整體得分",
    institutionalRadar: "機構雷達圖 — 五維度綜覽",
    radarSubtitle: "疊加圖層顯示行政／資訊人員與教師的認知差距。",
    radarNote: "ℹ️ 當行政／資訊與教師均提交後，角色別圖層將顯示。",
    dimensionBreakdown: "各維度得分與建議",
    priorityRec: "優先建議：",
    refFrameworks: "📚 參考框架",
    downloadPDF: "⬇  產生策略治理報告（英文 PDF）",
    downloading: "AI 分析中，請稍候…",
    addRespondent: "+ 新增受測者",
    clearData: "🗑 清除所有資料",
    privacyNote: "所有資料僅儲存於瀏覽器本機，不會傳送至任何伺服器。",
    roles: ["教師／教職員", "行政／資訊人員", "高階行政主管", "學生代表"],
    roleIcons: {
      "教師／教職員": "👩‍🏫",
      "行政／資訊人員": "⚙️",
      "高階行政主管": "🏛️",
      "學生代表": "🎓"
    },
    levelDescriptors: {
      1: { label: "Ad Hoc - Uncoordinated", desc: "No formal processes. AI use uncoordinated with no institutional awareness." },
      2: { label: "Emerging - Early Adopters", desc: "Individuals experimenting. Leadership aware but no formal structures." },
      3: { label: "Defined - Safe Harbor", desc: "Policies documented. Intentional but not fully integrated." },
      4: { label: "Managed - Strategic", desc: "AI embedded in strategy with KPIs. Systematic governance." },
      5: { label: "Optimizing - Leading Edge", desc: "Recognized sector leader. Continuous improvement and research." },
    },
    dimensions: [
      {
        id: "strategy", label: "Strategy & Governance", icon: "◈", color: "#1e3a8a", questions: [
          { id: "s1", text: "貴校的 AI 策略清晰度與完整性如何？", hint: "請思考是否有明確所有權與時程的書面計畫。" },
          { id: "s2", text: "機構領導層積極推動 AI 轉型的程度為何？", hint: "校長、教務長或資訊長是否公開推動 AI 議程？" },
          { id: "s3", text: "AI 整合至機構長期策略計畫的程度為何？", hint: "AI 是獨立專案，還是已融入認證、招生及研究目標？" },
        ]
      },
      {
        id: "policy", label: "Policy & Ethics", icon: "⚖", color: "#1e40af", questions: [
          { id: "p1", text: "貴校 AI 可接受使用政策（AUP）的完整性如何？", hint: "AUP 是否涵蓋學術誠信、資料隱私、偏見及員工使用情境？" },
          { id: "p2", text: "AI 倫理準則向各利害關係人傳達的清晰度如何？", hint: "是否有培訓模組、簽署確認書或可見的行為準則？" },
          { id: "p3", text: "機構處理 AI 偏見與公平性問題的有效性如何？", hint: "是否有審查流程評估 AI 工具對不同學生群體的差異化影響？" },
        ]
      },
      {
        id: "infrastructure", label: "Infrastructure & Data", icon: "⬡", color: "#1d4ed8", questions: [
          { id: "i1", text: "支援 AI 計畫的資料基礎設施成熟度為何？", hint: "請考量資料倉儲、API、資料品質計畫及治理框架。" },
          { id: "i2", text: "機構管理 AI 廠商合約與採購的完善度如何？", hint: "是否有針對 EdTech AI 的標準資料處理協議及風險評估？" },
          { id: "i3", text: "技術基礎設施支援可擴展 AI 工具的完備程度為何？", hint: "請思考運算資源、雲端策略、LMS 整合與資安。" },
        ]
      },
      {
        id: "literacy", label: "Literacy & Prof Dev", icon: "✦", color: "#2563eb", questions: [
          { id: "l1", text: "教師與行政人員的基礎 AI 素養普及程度為何？", hint: "大多數員工是否能說明生成式 AI 是什麼及其局限性？" },
          { id: "l2", text: "AI 應用於教學與行政的專業發展計畫完善度如何？", hint: "是否有工作坊、實踐社群或提升技能的激勵機制？" },
          { id: "l3", text: "AI 素養概念融入學生課程的有效性為何？", hint: "學生是否在各學科中學習 AI 工具與倫理使用？" },
        ]
      },
      {
        id: "career", label: "Career Readiness", icon: "◉", color: "#3b82f6", questions: [
          { id: "c1", text: "機構為學生準備投入 AI 擴增職場的完善度如何？", hint: "畢業生是否具備 AI 轉型產業所需的技術與軟實力？" },
          { id: "c2", text: "機構與產業在 AI 相關就業力方面的合作積極程度為何？", hint: "請考量實習、諮詢委員會、研究合作及課程共同設計。" },
          { id: "c3", text: "機構系統性追蹤 AI 相關職涯成果的完善度如何？", hint: "是否追蹤並報告就業率、薪資溢酬或技能認證？" },
        ]
      },
    ],
    recommendations: {
      strategy: { low: "成立跨職能 AI 工作小組。制定包含可量測 KPI 的三年 AI 路線圖。", mid: "將 AI 從專案提升為機構優先要務。成立 AI 指導委員會。", high: "向 Jisc 貢獻 AI 基準資料。爭取 EDUCAUSE 獎項肯定。" },
      policy: { low: "立即採用 AI 可接受使用政策。參考 Jisc 及 EDUCAUSE 範本。", mid: "設立 AI 倫理審查委員會。與 IEEE 及歐盟 AI 法案對齊。", high: "開放分享政策框架。每年委託獨立政策稽核。" },
      infrastructure: { low: "進行資料稽核。要求所有 EdTech 廠商簽署資料處理協議。", mid: "建立集中式 AI 工具目錄。整合 LMS 資料管道。", high: "公開資料治理模型。貢獻開源 EdTech AI 計畫。" },
      literacy: { low: "為所有員工推出必修的 AI 基礎模組（8-10 小時）。", mid: "建立分層專業發展路徑。資助教育 AI 微認證。", high: "成立 AI 增強教學與學習中心。發布開放式課程。" },
      career: { low: "將 AI 技能對應至主要學位課程。與企業合作設計學習成果。", mid: "整合跨學科 AI 模組。建立產業諮詢委員會。", high: "定位為區域 AI 人才樞紐。每年發布 AI 就業影響力報告。" },
    },
    refList: ["EDUCAUSE AI Horizon Report", "Jisc Digital Capabilities Framework", "IEEE Ethically Aligned Design", "EU AI Act - Education Provisions", "NIST AI Risk Management Framework", "Internet2 Next Generation Principles"],
  },
};
