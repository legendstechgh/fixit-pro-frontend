// ========== BACKEND CONFIGURATION ==========
// Automatically switches between local and production
const PROD_BACKEND = "https://fixit-pro-backend.onrender.com";
const BACKEND_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : PROD_BACKEND;

// ========== SAFETY LOCK ==========
let diagnosisInProgress = false;


// ─── DOM REFERENCES ──────────────────────────────────────────
const diagnoseBtn     = document.getElementById("diagnoseBtn");
const resultBox       = document.getElementById("result");
const loader          = document.getElementById("loader");
const symptomInput    = document.getElementById("symptom");
const deviceSelect    = document.getElementById("device");
const connectionPanel = document.getElementById("connectionPanel");  // dev panel wrapper
const connectionResult= document.getElementById("connectionResult");

// ─── EVENT LISTENERS ─────────────────────────────────────────
if (diagnoseBtn) {
  diagnoseBtn.addEventListener("click", startDiagnosis);
}

if (symptomInput) {
  symptomInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      startDiagnosis();
    }
  });
}

// ─── HIDE DEV PANEL IN PRODUCTION (Bug 3 fix) ────────────────
// Dev tools panel is invisible in production.
// Unlock with Ctrl+Shift+D for internal testing.
(function hideDevPanel() {
  if (!connectionPanel) return;
  if (window.location.hostname !== "localhost") {
    connectionPanel.style.display = "none";
  }
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "D") {
      connectionPanel.style.display =
        connectionPanel.style.display === "none" ? "block" : "none";
    }
  });
})();

// ─── DEMO FALLBACK DATA ───────────────────────────────────────
// Used when backend is unreachable. Device is filled in at runtime.
const DEMO_FALLBACK = {
  diagnosis: "Battery degradation detected",
  causes: [
    "Battery health below recommended threshold",
    "Background applications consuming excessive power",
    "Charging cycle count exceeded manufacturer recommendation"
  ],
  steps: {
    beginner: [
      "Reduce screen brightness to 50% or below",
      "Enable battery saver / low-power mode",
      "Close unused background applications"
    ],
    intermediate: [
      "Review battery usage statistics in device settings",
      "Calibrate battery: full discharge, then full recharge",
      "Install pending operating system updates"
    ],
    advanced: [
      "Replace battery if health is below 80%",
      "Inspect charging port for debris or corrosion",
      "Request a professional diagnostic test"
    ]
  },
  doNot: [
    "Do not use uncertified third-party chargers",
    "Do not allow the battery to fully drain repeatedly",
    "Do not expose the device to temperatures above 35°C"
  ],
  severity: "medium",
  confidence: "high",
  costEstimate: "$20 – $60",
  technicianRequired: false,
  probabilityOfSuccess: "85%",
  lifespanNotes: "Device should remain usable for 6–12 months with proper battery care.",
  aiEnhanced: {
    improvedDiagnosis: "Battery degradation detected. This matches a well-documented failure pattern — gradual capacity loss is the most common cause of fast drain on devices over 2 years old.",
    extraAdvice: "Start with the beginner steps — checking battery health and enabling battery saver costs nothing and resolves this in 40% of cases. Only consider a battery replacement if health is confirmed below 80%.",
    riskLevel:      "Low",
    riskScore:      18,
    urgency:        "🟢 Low urgency — monitor the issue",
    repairPriority: "DIY",
    warnings:       [],
    combinations:   [],
    ageAdvice:      "Consider your phone's age when deciding between repair and replacement. Devices under 3 years old are almost always worth repairing.",
    reasoning: [
      "01. Severity \"medium\" → +25 points",
      "02. Difficulty \"easy\" → +0 points",
      "03. Confidence \"high\" → +0 uncertainty points",
      "04. No amplifiers triggered",
      "05. No high-risk symptom signals detected",
      "06. No combination patterns fired",
      "07. Risk capped at 18 → Low Risk"
    ]
  },
  timestamp: Date.now()
};

// ─── RESULT REVEAL STATE ─────────────────────────────────────
// Tracks which step tab is active in the repair steps section.
let activeStepTab = "beginner";

// ─── MAIN DIAGNOSIS FUNCTION ─────────────────────────────────
async function startDiagnosis() {
  if (diagnosisInProgress) return;

  const symptom = (symptomInput?.value || "").trim();
  const device  = deviceSelect?.value || "phone";

  if (!symptom) {
    showResult({ error: "Please describe your device issue before running a diagnosis." });
    symptomInput?.focus();
    return;
  }

  diagnosisInProgress = true;
  activeStepTab = "beginner";
  setLoading(true);
  if (connectionResult) connectionResult.style.display = "none";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000); // 20s — accommodates Render cold start

  try {
    const res = await fetch(`${BACKEND_URL}/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device, symptom }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Server ${res.status}: ${errText.substring(0, 120)}`);
    }

    const payload = await res.json();
    showResult({ data: payload });

  } catch (err) {
    clearTimeout(timeout);

    const isNetworkError =
      err.name === "AbortError" ||
      err.message.includes("Failed to fetch") ||
      err.message.includes("NetworkError") ||
      err.message.includes("Load failed");

    if (isNetworkError) {
      // Silent fallback — user sees a real diagnosis, not an error screen
      showResult({ data: { ...DEMO_FALLBACK, device }, isDemoFallback: true });
    } else {
      showResult({ error: err.message || "An unexpected error occurred." });
    }

  } finally {
    diagnosisInProgress = false;
    setLoading(false);
  }
}

// ─── RESULT RENDERER ─────────────────────────────────────────
function showResult({ data = null, error = null, isDemoFallback = false } = {}) {
  if (!resultBox) return;

  resultBox.style.display = "block";

  // ── Error state ──
  if (error) {
    resultBox.innerHTML = `
      <div style="color:#EF4444;text-align:center;padding:30px 20px;">
        <div style="font-size:2.5rem;margin-bottom:12px;">⚠️</div>
        <div style="font-weight:600;font-size:1.1rem;margin-bottom:8px;">Diagnosis Error</div>
        <div style="font-size:0.9rem;color:#9CA3AF;">${escapeHtml(error)}</div>
      </div>`;
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (!data || typeof data !== "object") {
    resultBox.innerHTML = `<div style="text-align:center;padding:20px;color:#9CA3AF;">No diagnosis data received.</div>`;
    return;
  }

  // ── Extract all fields with safe fallbacks ──
  const title             = data.diagnosis           || "Diagnosis Result";
  const device            = data.device              || "";
  const causes            = Array.isArray(data.causes)                ? data.causes : [];
  const severity          = data.severity            || "medium";
  const confidence        = String(data.confidence   || "medium").toLowerCase();
  const beginner          = Array.isArray(data.steps?.beginner)       ? data.steps.beginner : [];
  const intermediate      = Array.isArray(data.steps?.intermediate)   ? data.steps.intermediate : [];
  const advanced          = Array.isArray(data.steps?.advanced)       ? data.steps.advanced : [];
  const doNotItems        = Array.isArray(data.doNot)                 ? data.doNot : [];
  const costEstimate      = data.costEstimate        || "Contact a technician for a quote";
  const lifespanNotes     = data.lifespanNotes       || "No lifespan notes available.";
  const probabilityOfSuccess = data.probabilityOfSuccess || "–";
  const technicianRequired   = !!data.technicianRequired;
  const timestamp            = data.timestamp        || Date.now();
  const aiEnhanced           = data.aiEnhanced       || null;

  // ── Severity styling ──
  const severityMap = {
    low:      { color: "#10B981", label: "Low",      icon: "🟢" },
    medium:   { color: "#F59E0B", label: "Medium",   icon: "🟡" },
    high:     { color: "#EF4444", label: "High",     icon: "🔴" },
    critical: { color: "#7C3AED", label: "Critical", icon: "🚨" }
  };
  const sev = severityMap[severity.toLowerCase()] || severityMap.medium;

  // ── Confidence styling ──
  const confMap = {
    high:   { color: "#10B981", label: "High" },
    medium: { color: "#F59E0B", label: "Medium" },
    low:    { color: "#EF4444", label: "Low" }
  };
  const conf = confMap[confidence] || confMap.medium;

  // ── Risk level styling (aiEnhanced) ──
  const riskLevelVal = aiEnhanced?.riskLevel || "Low";
  const riskColor = riskLevelVal === "Critical" ? "#7C3AED"
                  : riskLevelVal === "High"     ? "#EF4444"
                  : riskLevelVal === "Medium"   ? "#F59E0B"
                  : "#10B981";
  const riskScore = aiEnhanced?.riskScore ?? 0;

  // ── Repair priority styling ──
  const repairPriority = aiEnhanced?.repairPriority || "";
  const priorityColor  = repairPriority === "Replace"          ? "#7C3AED"
                       : repairPriority === "Professional"     ? "#EF4444"
                       : repairPriority === "DIY with caution" ? "#F59E0B"
                       : "#10B981";

  // ── Build the step tabs ──
  const allTabs = [
    { key: "beginner",     label: "🟢 Beginner",     steps: beginner },
    { key: "intermediate", label: "🔵 Intermediate",  steps: intermediate },
    { key: "advanced",     label: "🔴 Advanced",      steps: advanced }
  ].filter(t => t.steps.length > 0);

  const tabsHTML = allTabs.length ? `
    <div class="section">
      <strong>🔧 Repair Steps</strong>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
        ${allTabs.map(tab => `
          <button
            id="tab-${tab.key}"
            onclick="switchTab('${tab.key}')"
            style="padding:6px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);
                   background:${activeStepTab === tab.key ? "var(--primary)" : "rgba(255,255,255,0.05)"};
                   color:${activeStepTab === tab.key ? "#000" : "var(--text-main)"};
                   cursor:pointer;font-size:0.85rem;font-weight:600;transition:all 0.2s;">
            ${escapeHtml(tab.label)}
          </button>`).join("")}
      </div>
      ${allTabs.map(tab => `
        <div id="steps-${tab.key}" style="display:${activeStepTab === tab.key ? "block" : "none"};">
          <ol style="padding-left:20px;">
            ${tab.steps.map(s => `<li style="margin-bottom:8px;line-height:1.5;">${escapeHtml(s)}</li>`).join("")}
          </ol>
        </div>`).join("")}
    </div>` : "";

  // ── Build full result HTML ──
  let html = `
    ${isDemoFallback ? `
      <div style="font-size:0.8rem;background:rgba(245,158,11,0.1);color:#F59E0B;
                  padding:8px 12px;border-radius:8px;margin-bottom:16px;border-left:3px solid #F59E0B;">
        ⚡ Offline mode — showing sample diagnosis. Start the backend to get live results.
      </div>` : ""}

    <div style="font-size:1.4rem;font-weight:700;margin-bottom:16px;line-height:1.3;">
      🩺 ${escapeHtml(title)}
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:6px;">
      ${device ? `
        <div style="background:rgba(255,255,255,0.04);padding:12px;border-radius:10px;">
          <div style="font-size:0.75rem;color:#9CA3AF;margin-bottom:4px;">DEVICE</div>
          <div style="font-weight:600;">🛠 ${escapeHtml(device)}</div>
        </div>` : ""}

      <div style="background:rgba(255,255,255,0.04);padding:12px;border-radius:10px;">
        <div style="font-size:0.75rem;color:#9CA3AF;margin-bottom:4px;">SEVERITY</div>
        <div style="font-weight:600;color:${sev.color};">${sev.icon} ${escapeHtml(sev.label)}</div>
      </div>

      <div style="background:rgba(255,255,255,0.04);padding:12px;border-radius:10px;">
        <div style="font-size:0.75rem;color:#9CA3AF;margin-bottom:4px;">CONFIDENCE</div>
        <div style="font-weight:600;color:${conf.color};">● ${escapeHtml(conf.label)}</div>
      </div>

      <div style="background:rgba(255,255,255,0.04);padding:12px;border-radius:10px;">
        <div style="font-size:0.75rem;color:#9CA3AF;margin-bottom:4px;">SUCCESS RATE</div>
        <div style="font-weight:600;">${escapeHtml(probabilityOfSuccess)}</div>
      </div>

      <div style="background:rgba(255,255,255,0.04);padding:12px;border-radius:10px;">
        <div style="font-size:0.75rem;color:#9CA3AF;margin-bottom:4px;">EST. COST</div>
        <div style="font-weight:600;">${escapeHtml(costEstimate)}</div>
      </div>

      <div style="background:rgba(255,255,255,0.04);padding:12px;border-radius:10px;">
        <div style="font-size:0.75rem;color:#9CA3AF;margin-bottom:4px;">TECHNICIAN</div>
        <div style="font-weight:600;color:${technicianRequired ? "#F59E0B" : "#10B981"};">
          ${technicianRequired ? "⚠️ Recommended" : "✅ Not required"}
        </div>
      </div>
    </div>`;

  if (causes.length) {
    html += `
      <div class="section">
        <strong>🔍 Possible Causes</strong>
        <ul>
          ${causes.map(c => `<li style="margin-bottom:6px;">${escapeHtml(c)}</li>`).join("")}
        </ul>
      </div>`;
  }

  html += tabsHTML;

  if (doNotItems.length) {
    html += `
      <div class="section danger-box">
        <strong>⛔ Do NOT Do These</strong>
        <ul>
          ${doNotItems.map(i => `<li style="margin-bottom:6px;">${escapeHtml(i)}</li>`).join("")}
        </ul>
      </div>`;
  }

  if (aiEnhanced) {

    // ── Safety warnings — rendered first if present ──
    const warnings = Array.isArray(aiEnhanced.warnings) ? aiEnhanced.warnings : [];
    if (warnings.length) {
      html += `
        <div class="section danger-box" style="margin-bottom:10px;">
          <strong>🚨 Safety Alerts</strong>
          <ul style="margin-top:8px;">
            ${warnings.map(w => `<li style="margin-bottom:6px;font-weight:500;">${escapeHtml(w)}</li>`).join("")}
          </ul>
        </div>`;
    }

    // ── Main AI intelligence panel ──
    html += `
      <div class="section ai-box">
        <strong>🧠 Diagnostic Intelligence</strong>

        <p style="margin:10px 0 14px;line-height:1.65;">
          ${escapeHtml(aiEnhanced.improvedDiagnosis || "")}
        </p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">

          <div style="background:rgba(0,0,0,0.2);padding:12px;border-radius:8px;">
            <div style="font-size:0.72rem;color:#9CA3AF;margin-bottom:6px;letter-spacing:.05em;">COMPOSITE RISK SCORE</div>
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="flex:1;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${riskScore}%;background:${riskColor};border-radius:3px;transition:width 0.6s ease;"></div>
              </div>
              <span style="font-weight:700;color:${riskColor};min-width:34px;text-align:right;">${riskScore}/100</span>
            </div>
            <div style="font-size:0.82rem;font-weight:600;color:${riskColor};margin-top:6px;">
              ${escapeHtml(riskLevelVal)} Risk
            </div>
          </div>

          <div style="background:rgba(0,0,0,0.2);padding:12px;border-radius:8px;">
            <div style="font-size:0.72rem;color:#9CA3AF;margin-bottom:6px;letter-spacing:.05em;">REPAIR PRIORITY</div>
            <div style="font-size:1.05rem;font-weight:700;color:${priorityColor};">
              ${repairPriority === "Replace"          ? "🔄 Replace device"
              : repairPriority === "Professional"     ? "👨‍🔧 Professional repair"
              : repairPriority === "DIY with caution" ? "⚠️ DIY with caution"
              : "🛠 DIY repair"}
            </div>
            ${aiEnhanced.urgency ? `
            <div style="font-size:0.82rem;color:#9CA3AF;margin-top:6px;">
              ${escapeHtml(aiEnhanced.urgency)}
            </div>` : ""}
          </div>

        </div>

        <strong>💡 Recommendation</strong>
        <p style="margin:8px 0 14px;line-height:1.65;color:#D1D5DB;">
          ${escapeHtml(aiEnhanced.extraAdvice || "")}
        </p>

        ${Array.isArray(aiEnhanced.combinations) && aiEnhanced.combinations.length ? `
        <strong>🔗 Multi-Symptom Pattern Detected</strong>
        <div style="margin:8px 0 14px;">
          ${aiEnhanced.combinations.map(c => `
            <div style="background:rgba(124,58,237,0.12);border-left:3px solid #7C3AED;
                        padding:10px 12px;border-radius:0 8px 8px 0;margin-bottom:8px;
                        font-size:0.88rem;line-height:1.6;color:#D1D5DB;">
              ${escapeHtml(c)}
            </div>`).join("")}
        </div>` : ""}

        ${aiEnhanced.ageAdvice ? `
        <strong>📅 Device Age Advice</strong>
        <p style="margin:8px 0 14px;font-size:0.9rem;line-height:1.6;color:#D1D5DB;">
          ${escapeHtml(aiEnhanced.ageAdvice)}
        </p>` : ""}

        ${Array.isArray(aiEnhanced.reasoning) && aiEnhanced.reasoning.length ? `
        <details style="margin-top:4px;">
          <summary style="font-size:0.82rem;color:#9CA3AF;cursor:pointer;user-select:none;
                          padding:6px 0;list-style:none;display:flex;align-items:center;gap:6px;">
            <span>⚙️</span>
            <span>Show diagnostic reasoning (${aiEnhanced.reasoning.length} rules fired)</span>
          </summary>
          <div style="margin-top:8px;padding:10px 12px;background:rgba(0,0,0,0.25);
                      border-radius:8px;font-size:0.78rem;font-family:monospace;
                      color:#9CA3AF;line-height:2;">
            ${aiEnhanced.reasoning.map((r, i) =>
              `<div>${String(i + 1).padStart(2, "0")}. ${escapeHtml(r)}</div>`
            ).join("")}
          </div>
        </details>` : ""}

      </div>`;
  }

  html += `
    <div class="section">
      <strong>📋 Lifespan Notes</strong>
      <p style="margin-top:6px;color:#9CA3AF;">${escapeHtml(lifespanNotes)}</p>
    </div>

    <div class="feedback-box">
      <p style="margin-bottom:12px;font-size:0.9rem;color:#9CA3AF;">Did this diagnosis help?</p>
      <button onclick="sendFeedback(true, ${timestamp})"
        style="margin-right:10px;padding:9px 22px;border-radius:8px;border:none;cursor:pointer;
               background:linear-gradient(135deg,#10B981,#059669);color:white;font-weight:600;">
        👍 Yes, it helped
      </button>
      <button onclick="sendFeedback(false, ${timestamp})"
        style="padding:9px 22px;border-radius:8px;border:none;cursor:pointer;
               background:linear-gradient(135deg,#EF4444,#DC2626);color:white;font-weight:600;">
        👎 Needs improvement
      </button>
    </div>`;

  resultBox.innerHTML = html;
  resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── STEP TAB SWITCHER ────────────────────────────────────────
function switchTab(tabKey) {
  activeStepTab = tabKey;
  ["beginner", "intermediate", "advanced"].forEach(key => {
    const panel = document.getElementById(`steps-${key}`);
    const btn   = document.getElementById(`tab-${key}`);
    if (!panel || !btn) return;
    const isActive = key === tabKey;
    panel.style.display = isActive ? "block" : "none";
    btn.style.background = isActive ? "var(--primary)" : "rgba(255,255,255,0.05)";
    btn.style.color      = isActive ? "#000" : "var(--text-main)";
  });
}

// ─── FEEDBACK ────────────────────────────────────────────────
async function sendFeedback(success, timestamp) {
  try {
    await fetch(`${BACKEND_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp, success })
    });
    alert(success
      ? "✅ Thanks! Your feedback helps improve FixIt Pro."
      : "⚠️ Feedback recorded. We'll use this to improve accuracy."
    );
  } catch {
    alert("⚠️ Feedback could not be sent right now.");
  }
}

// ─── CONNECTION TEST (dev panel) ─────────────────────────────
async function runConnectionTest() {
  if (!connectionResult) return;
  connectionResult.style.display = "block";
  connectionResult.innerHTML = "🔍 Testing backend connection...";
  connectionResult.style.color = "#F59E0B";

  try {
    const data = await fetch(`${BACKEND_URL}/test`).then(r => r.json());
    connectionResult.innerHTML = `
      <strong style="color:#10B981;">✅ Backend connected</strong><br>
      <span style="font-size:0.85rem;color:#9CA3AF;">
        Status: ${escapeHtml(data.status || "ok")} &nbsp;·&nbsp;
        URL: ${escapeHtml(BACKEND_URL)} &nbsp;·&nbsp;
        ${new Date().toLocaleTimeString()}
      </span>`;
    connectionResult.style.color = "#10B981";
  } catch (err) {
    connectionResult.innerHTML = `
      <strong style="color:#EF4444;">❌ Connection failed</strong><br>
      <span style="font-size:0.85rem;">${escapeHtml(err.message)}<br>
      Make sure the backend is running: <code>cd backend && node server.js</code></span>`;
    connectionResult.style.color = "#EF4444";
  }
}

async function runDiagnosisTest() {
  if (!connectionResult) return;
  connectionResult.style.display = "block";
  connectionResult.innerHTML = "🧪 Running diagnosis test...";
  connectionResult.style.color = "#F59E0B";

  try {
    const res = await fetch(`${BACKEND_URL}/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device: "phone", symptom: "battery drains quickly" })
    });
    const data = await res.json();
    showResult({ data });
    connectionResult.innerHTML = `<strong style="color:#10B981;">✅ Diagnosis API working</strong> — result rendered above.`;
    connectionResult.style.color = "#10B981";
  } catch (err) {
    connectionResult.innerHTML = `<strong style="color:#EF4444;">❌ Diagnosis test failed</strong><br>
      <span style="font-size:0.85rem;">${escapeHtml(err.message)}</span>`;
    connectionResult.style.color = "#EF4444";
  }
}

// ─── LOADING STATE ────────────────────────────────────────────
function setLoading(on) {
  if (!loader || !diagnoseBtn) return;
  if (on) {
    loader.style.display = "block";
    loader.classList.add("show");
    diagnoseBtn.disabled = true;
    diagnoseBtn.textContent = "Analyzing...";
  } else {
    loader.style.display = "none";
    loader.classList.remove("show");
    diagnoseBtn.disabled = false;
    diagnoseBtn.textContent = "🔧 Diagnose Device";
  }
}

// ─── XSS PROTECTION ──────────────────────────────────────────
function escapeHtml(unsafe) {
  if (unsafe === null || unsafe === undefined) return "";
  return String(unsafe)
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#039;")
    .replace(/\n/g, "<br>");
}

// ─── INITIALIZATION ───────────────────────────────────────────
function init() {
  if (loader) { loader.classList.remove("show"); loader.style.display = "none"; }
  if (connectionResult) connectionResult.style.display = "none";
  if (symptomInput) symptomInput.focus();
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", init)
  : init();

// ─── GLOBAL EXPORTS ───────────────────────────────────────────
window.startDiagnosis    = startDiagnosis;
window.sendFeedback      = sendFeedback;
window.switchTab         = switchTab;
window.runConnectionTest = runConnectionTest;
window.runDiagnosisTest  = runDiagnosisTest;