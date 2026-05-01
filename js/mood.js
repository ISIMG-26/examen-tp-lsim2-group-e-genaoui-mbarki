// mood.js — Mood Oracle page

const MOOD_OPTIONS = [
  { score: 10, label: "Ecstatic", emoji: "🔥", color: "#ffd166" },
  { score: 9, label: "Radiant", emoji: "🌟", color: "#ffdc80" },
  { score: 8, label: "Happy", emoji: "😄", color: "#6bcb77" },
  { score: 7, label: "Good", emoji: "😊", color: "#4ecdc4" },
  { score: 6, label: "Okay", emoji: "🙂", color: "#7c9ff7" },
  { score: 5, label: "Neutral", emoji: "😐", color: "#7c6fff" },
  { score: 4, label: "Meh", emoji: "😕", color: "#a8a8c8" },
  { score: 3, label: "Sad", emoji: "😢", color: "#74a0d4" },
  { score: 2, label: "Anxious", emoji: "😰", color: "#ff9a56" },
  { score: 1, label: "Dark", emoji: "😔", color: "#9b7eb8" },
];

const MOOD_INSIGHTS = {
  10: [
    "You're radiating pure energy today — harness it.",
    "This high is real. Bottle this feeling in words.",
    "The world feels aligned. What made it so?",
  ],
  9: [
    "Something wonderful is alive in you today.",
    "Gratitude amplifies joy. What are you grateful for?",
    "Share your light — it's contagious.",
  ],
  8: [
    "Good energy finds good things. Stay open.",
    "You're in flow. What's driving it?",
    "This is worth remembering. Document it.",
  ],
  7: [
    "Steady and solid — a good place to be.",
    "Good is enough. Good is actually great.",
    "What small thing elevated your day?",
  ],
  6: [
    "You're holding it together. That counts.",
    "Okay is a perfectly valid landing strip.",
    "One good thing happened today. Find it.",
  ],
  5: [
    "The middle is honest. Neutrality is awareness.",
    "Equanimity is a skill. You're practicing it.",
    "No direction is sometimes direction enough.",
  ],
  4: [
    "Something's a little off. Honor that.",
    "Low tides are part of the ocean. This is temporary.",
    "What would feel like a 5 right now?",
  ],
  3: [
    "You're in the heavy part. It's okay to rest here.",
    "Sadness is not weakness — it's honesty.",
    "What do you need most right now?",
  ],
  2: [
    "Anxiety lies. You are safer than it feels.",
    "Breathe. Your nervous system needs you.",
    "This feeling is passing through you, not becoming you.",
  ],
  1: [
    "You showed up today. That is everything.",
    "Dark hours will pass. You've survived before.",
    "Please be gentle with yourself right now.",
  ],
};

const MOOD_TAGS = [
  "work",
  "social",
  "health",
  "family",
  "creative",
  "tired",
  "excited",
  "lonely",
  "loved",
  "stressed",
  "grateful",
  "motivated",
  "anxious",
  "peaceful",
  "bored",
];

function renderMoodPage(container) {
  container.innerHTML = `
        <div class="page-enter">
            <div class="page-header">
                <h1 class="page-title">Mood Oracle</h1>
                <p class="page-subtitle">Check in with yourself — no judgment, just awareness.</p>
            </div>
            <div class="page-body" id="moodBody"></div>
        </div>
    `;
  loadMoodPage();
}

async function loadMoodPage() {
  const body = document.getElementById("moodBody");
  body.innerHTML = `<div class="text-center" style="padding:60px"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;

  const [todayData, histData] = await Promise.all([
    api("api/mood.php?action=today"),
    api("api/mood.php?action=history&limit=7"),
  ]);

  if (todayData.mood) {
    renderTodayMood(body, todayData.mood, histData.moods);
  } else {
    renderMoodForm(body, histData.moods);
  }
}

function renderMoodForm(body, recentMoods) {
  let selectedMood = MOOD_OPTIONS[4]; // default neutral
  let selectedTags = [];

  body.innerHTML = `
        <div class="grid-2" style="gap:28px;align-items:start">
            <div>
                <!-- Emotion Wheel -->
                <div class="card" style="margin-bottom:20px">
                    <div class="section-title">How are you feeling?</div>
                    <div id="moodWheel" class="mood-wheel-grid"></div>
                </div>

                <!-- Sliders -->
                <div class="card" style="margin-bottom:20px">
                    <div class="section-title">Fine-tune</div>
                    <div style="margin-bottom:20px">
                        <div class="flex justify-between items-center" style="margin-bottom:8px">
                            <label class="field-label" style="margin:0">Energy Level</label>
                            <span id="energyVal" class="text-sm text-accent">5</span>
                        </div>
                        <input type="range" class="mood-slider" id="energySlider" min="1" max="10" value="5"
                            oninput="document.getElementById('energyVal').textContent=this.value">
                        <div class="flex justify-between text-xs text-muted" style="margin-top:4px">
                            <span>Drained</span><span>Energized</span>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between items-center" style="margin-bottom:8px">
                            <label class="field-label" style="margin:0">Anxiety Level</label>
                            <span id="anxietyVal" class="text-sm text-accent2">3</span>
                        </div>
                        <input type="range" class="mood-slider" id="anxietySlider" min="1" max="10" value="3"
                            oninput="document.getElementById('anxietyVal').textContent=this.value">
                        <div class="flex justify-between text-xs text-muted" style="margin-top:4px">
                            <span>Calm</span><span>Anxious</span>
                        </div>
                    </div>
                </div>

                <!-- Tags -->
                <div class="card">
                    <div class="section-title">What's influencing it?</div>
                    <div id="moodTags" class="flex" style="flex-wrap:wrap;gap:8px"></div>
                </div>
            </div>

            <div>
                <!-- Selected mood display -->
                <div class="card" id="moodPreview" style="text-align:center;padding:36px 28px;margin-bottom:20px">
                    <div id="previewEmoji" style="font-size:72px;margin-bottom:12px;transition:all 0.3s">😐</div>
                    <div id="previewLabel" style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;margin-bottom:8px">Neutral</div>
                    <div id="previewScore" class="text-muted text-sm">Score: 5 / 10</div>
                    <div id="moodInsight" style="margin-top:20px;padding:16px;background:var(--surface3);border-radius:10px;font-size:14px;color:var(--text-muted);font-style:italic;line-height:1.6;min-height:60px"></div>
                </div>

                <!-- Note -->
                <div class="card" style="margin-bottom:20px">
                    <label class="field-label">Add a note (optional)</label>
                    <textarea class="input" id="moodNote" rows="4" placeholder="What's on your mind? A few words or a few pages — both work."></textarea>
                </div>

                <!-- Submit -->
                <button class="btn btn-primary btn-full btn-lg" onclick="submitMood()">
                    Log This Feeling ✦
                </button>

                <!-- Recent -->
                ${recentMoods?.length ? renderRecentMiniMoods(recentMoods) : ""}
            </div>
        </div>
    `;

  // Render mood wheel
  const wheel = document.getElementById("moodWheel");
  wheel.style.cssText =
    "display:grid;grid-template-columns:repeat(5,1fr);gap:8px";
  MOOD_OPTIONS.forEach((mood) => {
    const btn = document.createElement("button");
    btn.className = "mood-option-btn";
    btn.style.cssText = `
            background: var(--surface2);
            border: 2px solid transparent;
            border-radius: 12px;
            padding: 10px 6px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            color: var(--text);
            font-family: 'DM Sans', sans-serif;
        `;
    btn.innerHTML = `<span style="font-size:22px">${mood.emoji}</span><span style="font-size:10px;font-weight:500">${mood.label}</span>`;
    btn.onclick = () => selectMood(mood);
    btn.id = `mood-btn-${mood.score}`;
    wheel.appendChild(btn);
  });

  // Render tags
  const tagsEl = document.getElementById("moodTags");
  MOOD_TAGS.forEach((tag) => {
    const el = document.createElement("span");
    el.className = "tag";
    el.textContent = tag;
    el.onclick = () => toggleMoodTag(tag, el);
    tagsEl.appendChild(el);
  });

  // Select neutral by default
  selectMood(selectedMood);

  function selectMood(mood) {
    selectedMood = mood;
    document.querySelectorAll(".mood-option-btn").forEach((b) => {
      b.style.borderColor = "transparent";
      b.style.background = "var(--surface2)";
      b.style.transform = "scale(1)";
    });
    const btn = document.getElementById(`mood-btn-${mood.score}`);
    if (btn) {
      btn.style.borderColor = mood.color;
      btn.style.background = `${mood.color}18`;
      btn.style.transform = "scale(1.08)";
    }

    document.getElementById("previewEmoji").textContent = mood.emoji;
    document.getElementById("previewLabel").textContent = mood.label;
    document.getElementById("previewLabel").style.color = mood.color;
    document.getElementById(
      "previewScore"
    ).textContent = `Score: ${mood.score} / 10`;

    const insights = MOOD_INSIGHTS[mood.score] || [];
    document.getElementById("moodInsight").textContent =
      insights[Math.floor(Math.random() * insights.length)] || "";
  }

  function toggleMoodTag(tag, el) {
    const idx = selectedTags.indexOf(tag);
    if (idx > -1) {
      selectedTags.splice(idx, 1);
      el.classList.remove("active");
    } else {
      selectedTags.push(tag);
      el.classList.add("active");
    }
  }

  window._getMoodFormData = () => ({
    mood_score: selectedMood.score,
    mood_label: selectedMood.label,
    mood_emoji: selectedMood.emoji,
    energy_level: parseInt(document.getElementById("energySlider").value),
    anxiety_level: parseInt(document.getElementById("anxietySlider").value),
    note: document.getElementById("moodNote").value,
    tags: selectedTags,
  });
}

function renderRecentMiniMoods(moods) {
  const items = moods
    .slice(0, 5)
    .map(
      (m) => `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
            <span style="font-size:20px">${m.mood_emoji}</span>
            <div style="flex:1">
                <div style="font-size:13px;font-weight:500">${
                  m.mood_label
                }</div>
                <div style="font-size:11px;color:var(--text-muted)">${timeAgo(
                  m.logged_at
                )}</div>
            </div>
            <div style="font-size:20px;font-weight:700;color:${moodColor(
              m.mood_score
            )}">${m.mood_score}</div>
        </div>
    `
    )
    .join("");
  return `
        <div class="card" style="margin-top:20px">
            <div class="section-title">Recent Check-ins</div>
            ${items}
        </div>
    `;
}

function renderTodayMood(body, mood, recentMoods) {
  const moodObj =
    MOOD_OPTIONS.find((m) => m.score === mood.mood_score) || MOOD_OPTIONS[4];
  const insights = MOOD_INSIGHTS[mood.mood_score] || [];
  const insight = insights[Math.floor(Math.random() * insights.length)] || "";

  body.innerHTML = `
        <div class="grid-2" style="gap:28px;align-items:start">
            <div>
                <div class="card" style="text-align:center;padding:48px 28px;margin-bottom:20px">
                    <div style="font-size:80px;margin-bottom:16px">${
                      mood.mood_emoji
                    }</div>
                    <h2 style="font-family:'Playfair Display',serif;font-size:36px;font-weight:700;color:${
                      moodObj.color
                    };margin-bottom:6px">${mood.mood_label}</h2>
                    <div class="text-muted text-sm">Logged today • Score: ${
                      mood.mood_score
                    }/10</div>
                    <div style="margin-top:24px;padding:18px;background:var(--surface3);border-radius:12px;font-style:italic;color:var(--text-muted);line-height:1.7">
                        "${insight}"
                    </div>
                    ${
                      mood.note
                        ? `<div style="margin-top:16px;padding:16px;background:var(--surface2);border-radius:12px;text-align:left;font-size:14px;line-height:1.7;border-left:3px solid ${moodObj.color}">
                        <div class="text-xs text-muted" style="margin-bottom:6px">Your note</div>
                        ${mood.note}
                    </div>`
                        : ""
                    }
                </div>
                <button class="btn btn-secondary btn-full" onclick="loadMoodPage()">
                    Log again (update)
                </button>
            </div>
            <div>
                <div class="card" style="margin-bottom:20px">
                    <div class="section-title">Today's vitals</div>
                    <div class="grid-2" style="gap:12px">
                        <div class="stat-card">
                            <div class="stat-label">Energy</div>
                            <div class="stat-value" style="font-size:28px;color:var(--accent)">${
                              mood.energy_level
                            }/10</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Anxiety</div>
                            <div class="stat-value" style="font-size:28px;color:var(--accent2)">${
                              mood.anxiety_level
                            }/10</div>
                        </div>
                    </div>
                </div>
                ${recentMoods?.length ? renderRecentMiniMoods(recentMoods) : ""}
            </div>
        </div>
    `;
}

async function submitMood() {
  const data = window._getMoodFormData?.();
  if (!data) return;

  const btn = document.querySelector(".btn-primary");
  btn.disabled = true;
  btn.textContent = "Logging...";

  const result = await api("api/mood.php?action=log", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (result.success) {
    document.getElementById("moodBadge").classList.remove("show");
    toast("Mood logged. Awareness is the first step. ✦", "success");
    loadMoodPage();
  } else {
    toast(result.error || "Something went wrong", "error");
    btn.disabled = false;
    btn.textContent = "Log This Feeling ✦";
  }
}

window.renderMoodPage = renderMoodPage;
window.submitMood = submitMood;
