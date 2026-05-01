// dashboard.js — Insights & Analytics page

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function renderDashboardPage(container) {
  container.innerHTML = `
        <div class="page-enter">
            <div class="page-header">
                <h1 class="page-title">Insights</h1>
                <p class="page-subtitle">Your patterns, your progress, your story.</p>
            </div>
            <div class="page-body" id="dashBody">
                <div class="text-center" style="padding:60px">
                    <div class="loading-dots"><span></span><span></span><span></span></div>
                </div>
            </div>
        </div>
    `;
  loadDashboard();
}

async function loadDashboard() {
  const body = document.getElementById("dashBody");
  const [statsData, calData, userStatsData] = await Promise.all([
    api("api/mood.php?action=stats"),
    api(
      `api/mood.php?action=calendar&year=${new Date().getFullYear()}&month=${
        new Date().getMonth() + 1
      }`
    ),
    api("api/sessions.php?action=user_stats"),
  ]);

  const stats = statsData.stats || {};
  const user = userStatsData.user || {};
  const journal = userStatsData.journal || {};
  const breathing = userStatsData.breathing || {};

  body.innerHTML = `
        <!-- Top stats row -->
        <div class="grid-4" style="margin-bottom:24px">
            <div class="stat-card">
                <div class="stat-label">Avg Mood</div>
                <div class="stat-value" style="color:${moodColor(
                  stats.avg_mood || 5
                )}">
                    ${parseFloat(stats.avg_mood || 0).toFixed(1)}
                </div>
                <div class="stat-sub">out of 10</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Streak</div>
                <div class="stat-value" style="color:var(--accent4)">
                    🔥 ${user.streak_count || 0}
                </div>
                <div class="stat-sub">days consecutive</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Journal Words</div>
                <div class="stat-value" style="color:var(--accent3)">
                    ${formatNumber(journal.total_words || 0)}
                </div>
                <div class="stat-sub">${journal.count || 0} entries</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Breath Sessions</div>
                <div class="stat-value" style="color:var(--accent2)">
                    ${breathing.count || 0}
                </div>
                <div class="stat-sub">${formatMinutes(
                  breathing.total_seconds || 0
                )} total</div>
            </div>
        </div>

        <!-- Calendar heatmap + weekly trend -->
        <div class="grid-2" style="gap:24px;margin-bottom:24px;align-items:start">
            <div class="card">
                <div class="section-title">
                    Mood Calendar
                    <div style="display:flex;gap:8px;margin-left:auto">
                        <button class="btn btn-ghost btn-sm" onclick="changeCalMonth(-1)">‹</button>
                        <span id="calMonthLabel" style="font-size:13px;font-weight:500;color:var(--text);padding:4px 8px"></span>
                        <button class="btn btn-ghost btn-sm" onclick="changeCalMonth(1)">›</button>
                    </div>
                </div>
                <div id="calendarGrid"></div>
                <div style="display:flex;align-items:center;gap:8px;margin-top:14px;flex-wrap:wrap">
                    <span style="font-size:11px;color:var(--text-muted)">Mood:</span>
                    ${[1, 3, 5, 7, 10]
                      .map(
                        (s) => `
                        <div style="display:flex;align-items:center;gap:4px">
                            <div style="width:12px;height:12px;border-radius:3px;background:${moodColor(
                              s
                            )}"></div>
                            <span style="font-size:11px;color:var(--text-muted)">${moodLabel(
                              s
                            )}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>

            <div class="card">
                <div class="section-title">7-Day Trend</div>
                <div id="weeklyChart" style="height:180px;position:relative;margin-bottom:8px"></div>
                <div id="weeklyLegend"></div>
            </div>
        </div>

        <!-- Mood distribution + Monthly trend -->
        <div class="grid-2" style="gap:24px;margin-bottom:24px">
            <div class="card">
                <div class="section-title">Mood Distribution</div>
                <div id="distributionChart"></div>
            </div>
            <div class="card">
                <div class="section-title">Monthly Trend (6 months)</div>
                <div id="monthlyChart" style="height:180px;position:relative"></div>
            </div>
        </div>

        <!-- Energy vs Anxiety (best vs worst) -->
        <div class="grid-2" style="gap:24px">
            <div class="stat-card">
                <div class="stat-label">Best Mood Ever</div>
                <div class="stat-value" style="color:var(--green)">${moodEmoji(
                  stats.best_mood || 5
                )} ${stats.best_mood || "—"}</div>
                <div class="stat-sub">Peak recorded</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Avg Energy Level</div>
                <div class="stat-value" style="color:var(--accent)">${parseFloat(
                  stats.avg_energy || 0
                ).toFixed(1)}</div>
                <div class="stat-sub">Your energy baseline</div>
            </div>
        </div>
    `;

  // Render calendar
  window._calYear = new Date().getFullYear();
  window._calMonth = new Date().getMonth() + 1;
  renderCalendar(calData.calendar || {});

  // Charts
  renderWeeklyTrend(statsData.weekly_trend || []);
  renderDistribution(statsData.distribution || []);
  renderMonthlyTrend(statsData.monthly_trend || []);
}

function renderCalendar(calData) {
  const year = window._calYear;
  const month = window._calMonth;
  document.getElementById("calMonthLabel").textContent = `${
    MONTH_NAMES[month - 1]
  } ${year}`;

  const grid = document.getElementById("calendarGrid");
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();

  let html = `
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:6px">
            ${DAY_NAMES.map(
              (d) =>
                `<div style="font-size:10px;text-align:center;color:var(--text-dim);font-weight:600">${d}</div>`
            ).join("")}
        </div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">
    `;

  // Empty cells for first row
  for (let i = 0; i < firstDay; i++) {
    html += `<div style="height:32px"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const dayData = calData[dateStr];
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() + 1 === month &&
      today.getDate() === day;

    const bg = dayData ? moodColor(dayData.avg_mood) : "var(--surface3)";
    const opacity = dayData ? "1" : "0.4";
    const title = dayData
      ? `${dayData.emoji} ${dayData.label} (${dayData.avg_mood})`
      : "No data";

    html += `
            <div title="${title}" style="
                height:32px;border-radius:6px;background:${bg};opacity:${opacity};
                display:flex;align-items:center;justify-content:center;
                font-size:11px;font-weight:600;color:rgba(0,0,0,0.7);
                border:${isToday ? "2px solid white" : "2px solid transparent"};
                cursor:${dayData ? "pointer" : "default"};
                transition:transform 0.15s;
            " onmouseenter="this.style.transform='scale(1.15)'" onmouseleave="this.style.transform='scale(1)'">
                ${dayData ? dayData.emoji : day}
            </div>
        `;
  }

  html += "</div>";
  grid.innerHTML = html;
}

async function changeCalMonth(dir) {
  window._calMonth += dir;
  if (window._calMonth > 12) {
    window._calMonth = 1;
    window._calYear++;
  }
  if (window._calMonth < 1) {
    window._calMonth = 12;
    window._calYear--;
  }
  const data = await api(
    `api/mood.php?action=calendar&year=${window._calYear}&month=${window._calMonth}`
  );
  renderCalendar(data.calendar || {});
}

function renderWeeklyTrend(trend) {
  const container = document.getElementById("weeklyChart");
  if (!trend.length) {
    container.innerHTML = `<div class="empty-state" style="padding:30px"><div class="empty-sub">Log moods to see your trend</div></div>`;
    return;
  }

  const max = 10,
    min = 0;
  const w = container.offsetWidth || 300;
  const h = 160;
  const pad = 30;
  const sw = w - pad * 2;
  const sh = h - pad;
  const step = trend.length > 1 ? sw / (trend.length - 1) : sw;

  const points = trend.map((d, i) => ({
    x: pad + i * (trend.length > 1 ? sw / (trend.length - 1) : 0),
    y: h - pad - ((d.avg_mood - min) / (max - min)) * sh,
    mood: d.avg_mood,
    date: d.date,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");
  const areaD = `${pathD} L${points[points.length - 1].x},${h} L${
    points[0].x
  },${h} Z`;

  container.innerHTML = `
        <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;overflow:visible">
            <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <path d="${areaD}" fill="url(#areaGrad)"/>
            <path d="${pathD}" stroke="var(--accent)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            ${points
              .map(
                (p) => `
                <circle cx="${p.x}" cy="${
                  p.y
                }" r="5" fill="var(--accent)" stroke="var(--bg)" stroke-width="2">
                    <title>${p.date}: ${p.mood}</title>
                </circle>
                <text x="${
                  p.x
                }" y="${h}" text-anchor="middle" font-size="10" fill="var(--text-dim)">
                    ${p.date.slice(5).replace("-", "/")}
                </text>
                <text x="${p.x}" y="${
                  p.y - 10
                }" text-anchor="middle" font-size="10" fill="var(--text-muted)">
                    ${p.mood}
                </text>
            `
              )
              .join("")}
        </svg>
    `;
}

function renderDistribution(dist) {
  const container = document.getElementById("distributionChart");
  if (!dist.length) {
    container.innerHTML = `<div class="empty-sub text-center" style="padding:20px">No data yet</div>`;
    return;
  }
  const total = dist.reduce((s, d) => s + d.count, 0);
  container.innerHTML = dist
    .map((d) => {
      const pct = Math.round((d.count / total) * 100);
      const mood = ENTRY_TYPES; // not used here
      return `
            <div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <span style="font-size:13px">${d.mood_label}</span>
                    <span style="font-size:12px;color:var(--text-muted)">${d.count}x (${pct}%)</span>
                </div>
                <div style="height:6px;background:var(--surface3);border-radius:3px">
                    <div style="height:100%;width:${pct}%;background:var(--accent);border-radius:3px;transition:width 0.5s"></div>
                </div>
            </div>
        `;
    })
    .join("");
}

function renderMonthlyTrend(trend) {
  const container = document.getElementById("monthlyChart");
  if (!trend.length) {
    container.innerHTML = `<div class="empty-state" style="padding:30px"><div class="empty-sub">Log moods to see monthly trends</div></div>`;
    return;
  }

  const w = container.offsetWidth || 300;
  const h = 160;
  const pad = 30;
  const sw = w - pad * 2;
  const sh = h - pad;

  const points = trend.map((d, i) => ({
    x: pad + i * (trend.length > 1 ? sw / (trend.length - 1) : 0),
    y: h - pad - ((d.avg_mood - 1) / 9) * sh,
    mood: d.avg_mood,
    label: `${MONTH_NAMES[d.month - 1]}`,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");
  const areaD = `${pathD} L${points[points.length - 1].x},${h} L${
    points[0].x
  },${h} Z`;

  container.innerHTML = `
        <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;overflow:visible">
            <defs>
                <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--accent3)" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="var(--accent3)" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <path d="${areaD}" fill="url(#monthGrad)"/>
            <path d="${pathD}" stroke="var(--accent3)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            ${points
              .map(
                (p) => `
                <circle cx="${p.x}" cy="${
                  p.y
                }" r="5" fill="var(--accent3)" stroke="var(--bg)" stroke-width="2"/>
                <text x="${
                  p.x
                }" y="${h}" text-anchor="middle" font-size="10" fill="var(--text-dim)">${
                  p.label
                }</text>
                <text x="${p.x}" y="${
                  p.y - 10
                }" text-anchor="middle" font-size="10" fill="var(--text-muted)">${
                  p.mood
                }</text>
            `
              )
              .join("")}
        </svg>
    `;
}

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n;
}

function formatMinutes(seconds) {
  const mins = Math.floor(seconds / 60);
  if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  return `${mins}m`;
}

window.renderDashboardPage = renderDashboardPage;
window.changeCalMonth = changeCalMonth;
