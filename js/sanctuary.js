// sanctuary.js — The Sanctuary (ambient + focus + affirmations)

const SOUNDS = [
  { id: "rain", label: "Rainfall", emoji: "🌧", desc: "Gentle rain on windows" },
  {
    id: "ocean",
    label: "Ocean Waves",
    emoji: "🌊",
    desc: "Rhythmic shore breaks",
  },
  {
    id: "forest",
    label: "Forest",
    emoji: "🌲",
    desc: "Birds & rustling leaves",
  },
  { id: "fire", label: "Fireplace", emoji: "🔥", desc: "Warm crackling fire" },
  { id: "café", label: "Café", emoji: "☕", desc: "Ambient coffee shop hum" },
  { id: "space", label: "Deep Space", emoji: "🌌", desc: "Cosmic drone tones" },
  { id: "thunder", label: "Storm", emoji: "⛈", desc: "Distant thunder & rain" },
  {
    id: "wind",
    label: "Mountain Wind",
    emoji: "🏔",
    desc: "High altitude gusts",
  },
];

const AFFIRMATIONS = [
  "You are enough, exactly as you are right now.",
  "Every breath you take is a new beginning.",
  "Your feelings are valid, even the complicated ones.",
  "Healing is not linear. Slow progress is still progress.",
  "You have survived every hard day so far.",
  "Rest is not laziness — it is wisdom.",
  "You are more resilient than you know.",
  "This moment is enough. You are enough.",
  "Your mind deserves the same care as your body.",
  "You are not your thoughts. You are the observer.",
  "Small steps taken consistently create profound change.",
  "It's okay to not be okay. It's also okay to be okay.",
  "You are allowed to take up space.",
  "The fact that you're trying matters enormously.",
  "Your story is still being written.",
];

const POMODORO_PRESETS = [
  { label: "Quick Focus", work: 15, rest: 3 },
  { label: "Classic", work: 25, rest: 5 },
  { label: "Deep Work", work: 45, rest: 10 },
  { label: "Flow State", work: 90, rest: 20 },
];

let sanctuaryState = {
  audioCtx: null,
  gainNodes: {},
  sourceNodes: {},
  activeSound: null,
  timerRunning: false,
  timerPhase: "work", // 'work' | 'rest'
  timerRemaining: 0,
  timerTotal: 0,
  timerInterval: null,
  selectedPreset: 1,
  affirmationIdx: Math.floor(Math.random() * AFFIRMATIONS.length),
  volume: 0.6,
  sessionStart: null,
};

function renderSanctuaryPage(container) {
  container.innerHTML = `
        <div class="page-enter">
            <div class="page-header">
                <h1 class="page-title">Sanctuary</h1>
                <p class="page-subtitle">Your private space for deep focus and inner calm.</p>
            </div>
            <div class="page-body">
                <div class="grid-2" style="gap:28px;align-items:start">
                    <div>
                        <!-- Ambient sounds -->
                        <div class="card" style="margin-bottom:20px">
                            <div class="section-title">Ambient Soundscape</div>
                            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px" id="soundGrid"></div>

                            <!-- Volume control -->
                            <div style="display:flex;align-items:center;gap:12px">
                                <span style="font-size:16px">🔈</span>
                                <input type="range" class="mood-slider" id="volumeSlider" min="0" max="100" value="60"
                                    oninput="setVolume(this.value / 100)" style="flex:1">
                                <span style="font-size:16px">🔊</span>
                            </div>

                            <div id="soundStatus" style="margin-top:14px;text-align:center;font-size:13px;color:var(--text-muted)">
                                Choose a soundscape to begin
                            </div>
                        </div>

                        <!-- Focus Timer -->
                        <div class="card">
                            <div class="section-title">Focus Timer</div>

                            <!-- Presets -->
                            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:20px">
                                ${POMODORO_PRESETS.map(
                                  (p, i) => `
                                    <button class="btn btn-sm ${
                                      i === 1 ? "btn-primary" : "btn-secondary"
                                    }"
                                        id="preset-${i}" onclick="selectTimerPreset(${i})">
                                        ${p.label}
                                        <span style="opacity:0.6;font-size:11px">${
                                          p.work
                                        }/${p.rest}m</span>
                                    </button>
                                `
                                ).join("")}
                            </div>

                            <!-- Timer display -->
                            <div style="text-align:center;padding:32px 0">
                                <div id="timerPhaseLabel" style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--accent);margin-bottom:10px">
                                    FOCUS TIME
                                </div>
                                <div id="timerDisplay" style="font-family:'Playfair Display',serif;font-size:64px;font-weight:700;letter-spacing:-2px;line-height:1;margin-bottom:10px">
                                    25:00
                                </div>
                                <div id="timerProgress" style="height:3px;background:var(--surface3);border-radius:2px;margin:0 40px 20px">
                                    <div id="timerBar" style="height:100%;width:100%;background:var(--accent);border-radius:2px;transition:width 1s linear"></div>
                                </div>
                                <div style="display:flex;gap:12px;justify-content:center">
                                    <button class="btn btn-primary" id="timerStartBtn" onclick="toggleTimer()">Start Focus</button>
                                    <button class="btn btn-ghost" onclick="resetTimer()">Reset</button>
                                </div>
                            </div>

                            <div id="sessionCount" style="text-align:center;font-size:12px;color:var(--text-muted)">
                                Sessions completed: <span id="sessCount">0</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <!-- Affirmation card -->
                        <div class="card" id="affirmCard" style="text-align:center;padding:40px 28px;margin-bottom:20px;cursor:pointer;transition:all 0.3s"
                            onclick="nextAffirmation()" title="Click for next">
                            <div style="font-size:32px;margin-bottom:16px">✦</div>
                            <div id="affirmText" style="font-family:'Playfair Display',serif;font-size:22px;line-height:1.5;color:var(--text);font-style:italic;transition:opacity 0.4s">
                                "${AFFIRMATIONS[sanctuaryState.affirmationIdx]}"
                            </div>
                            <div style="margin-top:20px;font-size:12px;color:var(--text-dim)">Click for next affirmation</div>
                        </div>

                        <!-- Ambient visual -->
                        <div class="card" id="ambientVisual" style="padding:32px;text-align:center;min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:20px">
                            <div id="visualEmoji" style="font-size:80px;filter:blur(0px);transition:all 1s;opacity:0.3">🌙</div>
                            <div id="visualLabel" style="margin-top:16px;font-size:13px;color:var(--text-muted)">Choose a sound to set the scene</div>
                        </div>

                        <!-- Gratitude quick entry -->
                        <div class="card">
                            <div class="section-title">Quick Gratitude</div>
                            <p style="font-size:13px;color:var(--text-muted);margin-bottom:14px">Name 3 things you're grateful for right now.</p>
                            <input class="input" id="grat1" placeholder="1. I'm grateful for..." style="margin-bottom:8px">
                            <input class="input" id="grat2" placeholder="2. I appreciate..." style="margin-bottom:8px">
                            <input class="input" id="grat3" placeholder="3. Today I noticed..." style="margin-bottom:12px">
                            <button class="btn btn-secondary btn-full btn-sm" onclick="saveGratitude()">Save to Journal</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  renderSoundGrid();
  initTimerDisplay();
}

function renderSoundGrid() {
  const grid = document.getElementById("soundGrid");
  SOUNDS.forEach((sound) => {
    const btn = document.createElement("div");
    btn.id = `sound-${sound.id}`;
    btn.title = sound.desc;
    btn.style.cssText = `
            padding: 14px 8px;
            border-radius: 12px;
            border: 1px solid var(--border);
            background: var(--surface2);
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
        `;
    btn.innerHTML = `
            <div style="font-size:26px;margin-bottom:4px">${sound.emoji}</div>
            <div style="font-size:10px;color:var(--text-muted);font-weight:500">${sound.label}</div>
        `;
    btn.onclick = () => toggleSound(sound);
    grid.appendChild(btn);
  });
}

function toggleSound(sound) {
  const btn = document.getElementById(`sound-${sound.id}`);
  if (sanctuaryState.activeSound === sound.id) {
    // Stop
    stopAllSounds();
    document.getElementById("soundStatus").textContent =
      "Choose a soundscape to begin";
    document.getElementById("visualEmoji").style.opacity = "0.3";
    document.getElementById("visualEmoji").textContent = "🌙";
    document.getElementById("visualLabel").textContent =
      "Choose a sound to set the scene";
  } else {
    // Reset all buttons
    SOUNDS.forEach((s) => {
      const b = document.getElementById(`sound-${s.id}`);
      if (b) {
        b.style.borderColor = "var(--border)";
        b.style.background = "var(--surface2)";
      }
    });
    btn.style.borderColor = "var(--accent3)";
    btn.style.background = "var(--accent3-light)";

    sanctuaryState.activeSound = sound.id;
    playAmbientSound(sound);

    document.getElementById("soundStatus").innerHTML = `
            <span style="color:var(--accent3)">▶</span> ${sound.label} — ${sound.desc}
        `;
    document.getElementById("visualEmoji").textContent = sound.emoji;
    document.getElementById("visualEmoji").style.opacity = "1";
    document.getElementById("visualLabel").textContent = sound.desc;
    document.getElementById("ambientVisual").style.background =
      "var(--accent3-light)";
    document.getElementById("ambientVisual").style.borderColor =
      "rgba(78,205,196,0.2)";
  }
}

function stopAllSounds() {
  SOUNDS.forEach((s) => {
    const b = document.getElementById(`sound-${s.id}`);
    if (b) {
      b.style.borderColor = "var(--border)";
      b.style.background = "var(--surface2)";
    }
  });
  sanctuaryState.activeSound = null;
  if (sanctuaryState.audioCtx) {
    sanctuaryState.audioCtx.close();
    sanctuaryState.audioCtx = null;
  }
  document.getElementById("ambientVisual").style.background = "";
  document.getElementById("ambientVisual").style.borderColor = "";
}

// Web Audio API — procedural ambient sound generation
function playAmbientSound(sound) {
  if (sanctuaryState.audioCtx) sanctuaryState.audioCtx.close();
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  sanctuaryState.audioCtx = ctx;

  const masterGain = ctx.createGain();
  masterGain.gain.value = sanctuaryState.volume;
  masterGain.connect(ctx.destination);

  switch (sound.id) {
    case "rain":
      playRain(ctx, masterGain);
      break;
    case "ocean":
      playOcean(ctx, masterGain);
      break;
    case "forest":
      playForest(ctx, masterGain);
      break;
    case "fire":
      playFire(ctx, masterGain);
      break;
    case "café":
      playCafe(ctx, masterGain);
      break;
    case "space":
      playSpace(ctx, masterGain);
      break;
    case "thunder":
      playThunder(ctx, masterGain);
      break;
    case "wind":
      playWind(ctx, masterGain);
      break;
  }
}

function createWhiteNoise(ctx, gain, master) {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const gainNode = ctx.createGain();
  gainNode.gain.value = gain;
  source.connect(gainNode);
  gainNode.connect(master);
  source.start();
  return { source, gainNode };
}

function playRain(ctx, master) {
  // Pink noise filtered
  const { gainNode } = createWhiteNoise(ctx, 0.3, master);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2000;
  gainNode.connect(filter);
  filter.connect(master);
}

function playOcean(ctx, master) {
  const noise = createWhiteNoise(ctx, 0.2, master);
  // Oscillating filter for wave effect
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 600;
  filter.Q.value = 2;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.12;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 300;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();
  noise.gainNode.connect(filter);
  filter.connect(master);
}

function playForest(ctx, master) {
  createWhiteNoise(ctx, 0.04, master);
  // Bird-like oscillators
  function bird() {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 800 + Math.random() * 1200;
    const g = ctx.createGain();
    g.gain.value = 0;
    osc.connect(g);
    g.connect(master);
    osc.start();
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.05, now + 0.05);
    g.gain.linearRampToValueAtTime(0, now + 0.3);
    setTimeout(() => osc.stop(), 400);
    setTimeout(bird, 1500 + Math.random() * 4000);
  }
  bird();
}

function playFire(ctx, master) {
  createWhiteNoise(ctx, 0.15, master);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 700;
  const g = ctx.createGain();
  g.gain.value = 0.15;
  function crackle() {
    g.gain.setValueAtTime(0.15 + Math.random() * 0.05, ctx.currentTime);
    setTimeout(crackle, 100 + Math.random() * 300);
  }
  crackle();
  g.connect(master);
}

function playCafe(ctx, master) {
  createWhiteNoise(ctx, 0.05, master);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1500;
  filter.Q.value = 1;
  const buf = createWhiteNoise(ctx, 0.06, master);
  buf.gainNode.connect(filter);
  filter.connect(master);
}

function playSpace(ctx, master) {
  [55, 82.5, 110, 165].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = 0.08;
    osc.connect(g);
    g.connect(master);
    osc.start();
  });
}

function playThunder(ctx, master) {
  createWhiteNoise(ctx, 0.3, master);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;
  function thunder() {
    const g = ctx.createGain();
    g.gain.value = 0;
    const noise = createWhiteNoise(ctx, 0.6, g);
    g.connect(master);
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.4, now + 0.05);
    g.gain.linearRampToValueAtTime(0, now + 2);
    setTimeout(thunder, 8000 + Math.random() * 12000);
  }
  setTimeout(thunder, 3000);
}

function playWind(ctx, master) {
  createWhiteNoise(ctx, 0.2, master);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 400;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 200;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();
}

function setVolume(val) {
  sanctuaryState.volume = val;
  if (sanctuaryState.audioCtx) {
    sanctuaryState.audioCtx.destination;
    // Restart sound to apply volume (simple approach)
    if (sanctuaryState.activeSound) {
      const sound = SOUNDS.find((s) => s.id === sanctuaryState.activeSound);
      if (sound) playAmbientSound(sound);
    }
  }
}

// ── Pomodoro Timer ────────────────────────────────────────────────────────

function selectTimerPreset(idx) {
  sanctuaryState.selectedPreset = idx;
  document.querySelectorAll('[id^="preset-"]').forEach((btn, i) => {
    btn.classList.toggle("btn-primary", i === idx);
    btn.classList.toggle("btn-secondary", i !== idx);
  });
  resetTimer();
}

function initTimerDisplay() {
  const preset = POMODORO_PRESETS[sanctuaryState.selectedPreset];
  updateTimerDisplay(preset.work * 60);
}

function updateTimerDisplay(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  document.getElementById("timerDisplay").textContent = `${m}:${s}`;
}

function toggleTimer() {
  if (sanctuaryState.timerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  const preset = POMODORO_PRESETS[sanctuaryState.selectedPreset];
  if (!sanctuaryState.timerRemaining) {
    sanctuaryState.timerPhase = "work";
    sanctuaryState.timerRemaining = preset.work * 60;
    sanctuaryState.timerTotal = preset.work * 60;
  }
  sanctuaryState.timerRunning = true;
  sanctuaryState.sessionStart = Date.now();
  document.getElementById("timerStartBtn").textContent = "Pause";
  document.getElementById("timerStartBtn").className = "btn btn-ghost";

  sanctuaryState.timerInterval = setInterval(() => {
    sanctuaryState.timerRemaining--;
    updateTimerDisplay(sanctuaryState.timerRemaining);

    const pct =
      (sanctuaryState.timerRemaining / sanctuaryState.timerTotal) * 100;
    document.getElementById("timerBar").style.width = `${pct}%`;

    if (sanctuaryState.timerRemaining <= 0) {
      if (sanctuaryState.timerPhase === "work") {
        // Switch to rest
        sanctuaryState.timerPhase = "rest";
        sanctuaryState.timerRemaining = preset.rest * 60;
        sanctuaryState.timerTotal = preset.rest * 60;
        document.getElementById("timerPhaseLabel").textContent = "BREAK TIME";
        document.getElementById("timerPhaseLabel").style.color =
          "var(--accent3)";
        document.getElementById("timerBar").style.background = "var(--accent3)";
        toast(
          `Focus session complete! Take a ${preset.rest}min break. 🌿`,
          "success",
          6000
        );
        const count =
          parseInt(document.getElementById("sessCount").textContent) + 1;
        document.getElementById("sessCount").textContent = count;
        logSanctuarySession(preset.work, true);
      } else {
        // Done
        resetTimer();
        toast("Break over. Ready for another session? 🎯", "info", 5000);
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(sanctuaryState.timerInterval);
  sanctuaryState.timerRunning = false;
  document.getElementById("timerStartBtn").textContent = "Resume";
  document.getElementById("timerStartBtn").className = "btn btn-primary";
}

function resetTimer() {
  clearInterval(sanctuaryState.timerInterval);
  sanctuaryState.timerRunning = false;
  sanctuaryState.timerRemaining = 0;
  sanctuaryState.timerPhase = "work";

  const preset = POMODORO_PRESETS[sanctuaryState.selectedPreset];
  updateTimerDisplay(preset.work * 60);
  document.getElementById("timerBar").style.width = "100%";
  document.getElementById("timerBar").style.background = "var(--accent)";
  document.getElementById("timerPhaseLabel").textContent = "FOCUS TIME";
  document.getElementById("timerPhaseLabel").style.color = "var(--accent)";
  document.getElementById("timerStartBtn").textContent = "Start Focus";
  document.getElementById("timerStartBtn").className = "btn btn-primary";
}

async function logSanctuarySession(duration, completed) {
  await api("api/sessions.php?action=log_sanctuary", {
    method: "POST",
    body: JSON.stringify({
      sound: sanctuaryState.activeSound || "none",
      duration,
      completed: completed ? 1 : 0,
    }),
  });
}

// ── Affirmations ─────────────────────────────────────────────────────────

function nextAffirmation() {
  const el = document.getElementById("affirmText");
  el.style.opacity = "0";
  setTimeout(() => {
    sanctuaryState.affirmationIdx =
      (sanctuaryState.affirmationIdx + 1) % AFFIRMATIONS.length;
    el.textContent = `"${AFFIRMATIONS[sanctuaryState.affirmationIdx]}"`;
    el.style.opacity = "1";
  }, 200);
}

// ── Gratitude quick-save ──────────────────────────────────────────────────

async function saveGratitude() {
  const g1 = document.getElementById("grat1").value.trim();
  const g2 = document.getElementById("grat2").value.trim();
  const g3 = document.getElementById("grat3").value.trim();

  const items = [g1, g2, g3].filter(Boolean);
  if (!items.length)
    return toast("Write at least one thing you're grateful for", "error");

  const content = items.map((item, i) => `${i + 1}. ${item}`).join("\n");
  await api("api/journal.php?action=create", {
    method: "POST",
    body: JSON.stringify({
      title: `Gratitude — ${new Date().toLocaleDateString()}`,
      content,
      type: "gratitude",
      tags: ["gratitude"],
    }),
  });

  document.getElementById("grat1").value = "";
  document.getElementById("grat2").value = "";
  document.getElementById("grat3").value = "";
  toast("Gratitude saved to your Mind Map 🙏", "success");
}

window.renderSanctuaryPage = renderSanctuaryPage;
window.toggleTimer = toggleTimer;
window.resetTimer = resetTimer;
window.selectTimerPreset = selectTimerPreset;
window.nextAffirmation = nextAffirmation;
window.saveGratitude = saveGratitude;
window.setVolume = setVolume;
