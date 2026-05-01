// breathe.js — Guided Breathing page

const BREATHING_PATTERNS = {
    box: {
        name: 'Box Breathing',
        emoji: '□',
        description: 'Navy SEALs use this to stay calm under pressure.',
        phases: [
            { name: 'Inhale', duration: 4, color: '#7c6fff' },
            { name: 'Hold', duration: 4, color: '#4ecdc4' },
            { name: 'Exhale', duration: 4, color: '#ff6b9d' },
            { name: 'Hold', duration: 4, color: '#ffd166' },
        ],
        totalCycle: 16,
    },
    '478': {
        name: '4-7-8 Breathing',
        emoji: '◉',
        description: 'Dr. Weil\'s technique — sleep inducing, anxiety reducing.',
        phases: [
            { name: 'Inhale', duration: 4, color: '#7c6fff' },
            { name: 'Hold', duration: 7, color: '#4ecdc4' },
            { name: 'Exhale', duration: 8, color: '#ff6b9d' },
        ],
        totalCycle: 19,
    },
    relaxed: {
        name: 'Relaxed Breathing',
        emoji: '∿',
        description: 'Slow, deep belly breathing. Good for everyday calm.',
        phases: [
            { name: 'Inhale', duration: 5, color: '#6bcb77' },
            { name: 'Exhale', duration: 7, color: '#74a0d4' },
        ],
        totalCycle: 12,
    },
    energizing: {
        name: 'Energizing Breath',
        emoji: '↑',
        description: 'Quick, sharp inhales. Natural caffeine.',
        phases: [
            { name: 'Inhale', duration: 2, color: '#ffd166' },
            { name: 'Hold', duration: 1, color: '#ff9a56' },
            { name: 'Exhale', duration: 3, color: '#ff6b9d' },
        ],
        totalCycle: 6,
    },
};

let breatheState = {
    pattern: null,
    running: false,
    phase: 0,
    timeLeft: 0,
    elapsed: 0,
    totalTime: 0,
    timer: null,
    phaseTimer: null,
    cycles: 0,
    sessionStart: null,
};

function renderBreathePage(container) {
    container.innerHTML = `
        <div class="page-enter">
            <div class="page-header">
                <h1 class="page-title">Breathe</h1>
                <p class="page-subtitle">Intentional breathing is the fastest route to calm.</p>
            </div>
            <div class="page-body">
                <div class="grid-2" style="gap:28px;align-items:start">
                    <div>
                        <div class="section-title">Choose a pattern</div>
                        <div id="patternGrid" style="display:grid;gap:12px;margin-bottom:24px"></div>

                        <div class="card" id="durationCard" style="display:none">
                            <div class="section-title">Session length</div>
                            <div style="display:flex;gap:8px;flex-wrap:wrap" id="durationBtns"></div>
                        </div>
                    </div>

                    <div>
                        <div class="card" id="breatheVisual" style="text-align:center;padding:48px 28px">
                            <div class="empty-state">
                                <div class="empty-icon">◎</div>
                                <div class="empty-title">Choose a pattern to begin</div>
                                <div class="empty-sub">Select from the left to start your session</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderPatternGrid();
}

function renderPatternGrid() {
    const grid = document.getElementById('patternGrid');
    Object.entries(BREATHING_PATTERNS).forEach(([key, pattern]) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'pointer';
        card.id = `pattern-${key}`;
        card.innerHTML = `
            <div style="display:flex;align-items:center;gap:14px">
                <div style="width:44px;height:44px;border-radius:12px;background:var(--surface3);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">
                    ${pattern.emoji}
                </div>
                <div>
                    <div style="font-size:15px;font-weight:600;margin-bottom:3px">${pattern.name}</div>
                    <div style="font-size:12px;color:var(--text-muted)">${pattern.description}</div>
                </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
                ${pattern.phases.map(p => `
                    <div style="flex:1;text-align:center;background:var(--surface3);border-radius:8px;padding:6px">
                        <div style="font-size:11px;color:var(--text-muted)">${p.name}</div>
                        <div style="font-size:16px;font-weight:700;color:${p.color}">${p.duration}s</div>
                    </div>
                `).join('')}
            </div>
        `;
        card.onclick = () => selectPattern(key);
        grid.appendChild(card);
    });
}

function selectPattern(key) {
    document.querySelectorAll('[id^="pattern-"]').forEach(c => {
        c.style.borderColor = 'var(--border)';
        c.style.background = 'rgba(20,20,38,0.8)';
    });
    const selected = document.getElementById(`pattern-${key}`);
    selected.style.borderColor = 'var(--accent)';
    selected.style.background = 'var(--accent-light)';

    breatheState.pattern = BREATHING_PATTERNS[key];
    breatheState.patternKey = key;

    // Show duration options
    const durationCard = document.getElementById('durationCard');
    durationCard.style.display = 'block';
    const btns = document.getElementById('durationBtns');
    btns.innerHTML = '';
    [2, 5, 10, 15, 20].forEach(mins => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.textContent = `${mins} min`;
        btn.onclick = () => {
            document.querySelectorAll('#durationBtns .btn').forEach(b => b.classList.remove('btn-primary'));
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-secondary');
            breatheState.totalTime = mins * 60;
            setupBreathVisual();
        };
        btns.appendChild(btn);
    });
}

function setupBreathVisual() {
    const visual = document.getElementById('breatheVisual');
    const pattern = breatheState.pattern;

    visual.innerHTML = `
        <div id="breathCircleWrap" style="position:relative;width:200px;height:200px;margin:0 auto 28px">
            <svg viewBox="0 0 200 200" style="position:absolute;inset:0;width:100%;height:100%">
                <circle cx="100" cy="100" r="90" fill="none" stroke="var(--surface3)" stroke-width="4"/>
                <circle id="progressRing" cx="100" cy="100" r="90" fill="none"
                    stroke="var(--accent)" stroke-width="4" stroke-linecap="round"
                    stroke-dasharray="565.49" stroke-dashoffset="565.49"
                    transform="rotate(-90,100,100)" style="transition:stroke 0.5s"/>
            </svg>
            <div id="breathCircle" style="
                position:absolute;inset:16px;border-radius:50%;
                background:radial-gradient(circle at 40% 35%, var(--accent-light), transparent 70%);
                border:2px solid var(--accent);
                display:flex;flex-direction:column;align-items:center;justify-content:center;
                transition:all 1s cubic-bezier(0.4,0,0.2,1);
            ">
                <div id="breathPhase" style="font-size:14px;font-weight:600;color:var(--accent);letter-spacing:0.08em;text-transform:uppercase"></div>
                <div id="breathCount" style="font-family:'Playfair Display',serif;font-size:42px;font-weight:700;line-height:1"></div>
            </div>
        </div>

        <div id="breathStatus" style="font-size:14px;color:var(--text-muted);margin-bottom:20px">
            Ready — <span style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--text)">
                ${Math.floor(breatheState.totalTime / 60)} min
            </span> session
        </div>

        <div style="display:flex;gap:12px;justify-content:center;margin-bottom:24px">
            <button class="btn btn-primary btn-lg" id="breathStartBtn" onclick="toggleBreathe()">
                Begin Session
            </button>
        </div>

        <div id="phaseIndicators" style="display:flex;gap:8px;justify-content:center">
            ${pattern.phases.map((p, i) => `
                <div class="phase-dot" id="phase-dot-${i}" style="
                    padding:6px 12px;border-radius:20px;font-size:11px;font-weight:600;
                    background:var(--surface3);color:var(--text-muted);transition:all 0.3s;
                    border:1px solid transparent;
                ">
                    ${p.name} ${p.duration}s
                </div>
            `).join('')}
        </div>

        <div id="cycleCounter" style="margin-top:20px;font-size:12px;color:var(--text-dim)">
            Cycles: <span id="cycleNum">0</span>
        </div>
    `;
}

function toggleBreathe() {
    if (breatheState.running) {
        stopBreathe();
    } else {
        startBreathe();
    }
}

function startBreathe() {
    const pattern = breatheState.pattern;
    breatheState.running = true;
    breatheState.phase = 0;
    breatheState.elapsed = 0;
    breatheState.cycles = 0;
    breatheState.sessionStart = Date.now();

    document.getElementById('breathStartBtn').textContent = 'Pause';
    document.getElementById('breathStartBtn').className = 'btn btn-ghost btn-lg';

    runPhase();

    // Overall session timer
    breatheState.timer = setInterval(() => {
        breatheState.elapsed++;
        const remaining = breatheState.totalTime - breatheState.elapsed;
        if (remaining <= 0) {
            stopBreathe(true);
            return;
        }
        const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
        const secs = (remaining % 60).toString().padStart(2, '0');
        document.getElementById('breathStatus').innerHTML = `
            <span style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--text)">${mins}:${secs}</span> remaining
        `;
        // Progress ring
        const progress = breatheState.elapsed / breatheState.totalTime;
        const offset = 565.49 * (1 - progress);
        const ring = document.getElementById('progressRing');
        if (ring) ring.style.strokeDashoffset = offset;
    }, 1000);
}

function runPhase() {
    if (!breatheState.running) return;
    const pattern = breatheState.pattern;
    const phase = pattern.phases[breatheState.phase];

    // Update UI
    document.querySelectorAll('[id^="phase-dot-"]').forEach((el, i) => {
        el.style.background = i === breatheState.phase ? `${phase.color}22` : 'var(--surface3)';
        el.style.color = i === breatheState.phase ? phase.color : 'var(--text-muted)';
        el.style.borderColor = i === breatheState.phase ? phase.color : 'transparent';
    });

    const circle = document.getElementById('breathCircle');
    const phaseEl = document.getElementById('breathPhase');
    const ring = document.getElementById('progressRing');

    phaseEl.textContent = phase.name;
    phaseEl.style.color = phase.color;
    circle.style.borderColor = phase.color;
    circle.style.background = `radial-gradient(circle at 40% 35%, ${phase.color}18, transparent 70%)`;
    if (ring) ring.style.stroke = phase.color;

    // Animate circle for inhale/exhale
    if (phase.name === 'Inhale') {
        circle.style.transform = 'scale(1.2)';
    } else if (phase.name === 'Exhale') {
        circle.style.transform = 'scale(0.85)';
    } else {
        circle.style.transform = 'scale(1)';
    }

    // Countdown
    let count = phase.duration;
    document.getElementById('breathCount').textContent = count;

    breatheState.phaseTimer = setInterval(() => {
        count--;
        document.getElementById('breathCount').textContent = Math.max(0, count);
        if (count <= 0) {
            clearInterval(breatheState.phaseTimer);
            breatheState.phase = (breatheState.phase + 1) % pattern.phases.length;
            if (breatheState.phase === 0) {
                breatheState.cycles++;
                document.getElementById('cycleNum').textContent = breatheState.cycles;
            }
            if (breatheState.running) runPhase();
        }
    }, 1000);
}

async function stopBreathe(completed = false) {
    breatheState.running = false;
    clearInterval(breatheState.timer);
    clearInterval(breatheState.phaseTimer);

    const duration = Math.floor((Date.now() - (breatheState.sessionStart || Date.now())) / 1000);

    if (duration > 10) {
        await api('api/sessions.php?action=log_breathing', {
            method: 'POST',
            body: JSON.stringify({
                pattern: breatheState.patternKey,
                duration,
                completed: completed ? 1 : 0,
            }),
        });
    }

    if (completed) {
        const visual = document.getElementById('breatheVisual');
        visual.innerHTML = `
            <div style="text-align:center;padding:20px">
                <div style="font-size:64px;margin-bottom:16px">🌿</div>
                <h2 style="font-family:'Playfair Display',serif;font-size:28px;margin-bottom:8px">Session Complete</h2>
                <p style="color:var(--text-muted);margin-bottom:24px">
                    ${breatheState.cycles} cycles · ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')} of conscious breathing.
                </p>
                <p style="font-style:italic;color:var(--text-muted);font-size:14px;margin-bottom:28px">
                    "The breath is the bridge between the body and the mind."
                </p>
                <button class="btn btn-primary" onclick="setupBreathVisual()">Session Again</button>
            </div>
        `;
        toast('Breathing session complete. You did something good for yourself. 🌿', 'success', 5000);
    } else {
        const btn = document.getElementById('breathStartBtn');
        if (btn) {
            btn.textContent = 'Begin Session';
            btn.className = 'btn btn-primary btn-lg';
        }
        const circle = document.getElementById('breathCircle');
        if (circle) circle.style.transform = 'scale(1)';
    }
}

window.renderBreathePage = renderBreathePage;
window.toggleBreathe = toggleBreathe;