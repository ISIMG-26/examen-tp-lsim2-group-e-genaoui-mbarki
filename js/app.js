// app.js — Core application logic

// ── Auth ─────────────────────────────────────────────────────────────────
async function checkAuth() {
  const res = await fetch("api/auth.php?action=check");
  const data = await res.json();
  if (!data.authenticated) {
    window.location.href = "index.php";
    return;
  }
  window.AppState = { username: data.user };
  const greetings = ["Good morning", "Good afternoon", "Good evening"];
  const hr = new Date().getHours();
  const greeting =
    hr < 12 ? greetings[0] : hr < 18 ? greetings[1] : greetings[2];
  document.getElementById(
    "userGreeting"
  ).textContent = `${greeting}, ${data.user}`;
}

async function handleLogout() {
  await fetch("api/auth.php?action=logout");
  window.location.href = "index.php";
}

async function loadUserStats() {
  try {
    const res = await fetch("api/sessions.php?action=user_stats");
    const data = await res.json();
    document.getElementById("streakCount").textContent =
      data.user?.streak_count || 0;

    // Show mood badge if not logged today
    const moodRes = await fetch("api/mood.php?action=today");
    const moodData = await moodRes.json();
    if (!moodData.mood) {
      document.getElementById("moodBadge").textContent = "!";
      document.getElementById("moodBadge").classList.add("show");
    }
  } catch (e) {
    console.warn("Stats load failed", e);
  }
}

// ── Page Router ───────────────────────────────────────────────────────────
const PAGE_RENDERERS = {
  mood: renderMoodPage,
  breathe: renderBreathePage,
  mindmap: renderMindMapPage,
  dashboard: renderDashboardPage,
  sanctuary: renderSanctuaryPage,
};

function switchPage(page, navEl) {
  // Update active nav
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  const target = navEl || document.querySelector(`[data-page="${page}"]`);
  if (target) target.classList.add("active");

  // Close mobile sidebar
  document.getElementById("sidebar").classList.remove("open");

  // Render page
  const main = document.getElementById("mainContent");
  main.innerHTML = "";
  const renderer = PAGE_RENDERERS[page];
  if (renderer) renderer(main);
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

// ── Toast ─────────────────────────────────────────────────────────────────
function toast(message, type = "success", duration = 3500) {
  const container = document.getElementById("toastContainer");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.animation = "toastOut 0.3s ease forwards";
    setTimeout(() => el.remove(), 300);
  }, duration);
}

// ── Helpers ───────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function moodColor(score) {
  const colors = [
    "",
    "#9b7eb8",
    "#9b7eb8",
    "#74a0d4",
    "#74a0d4",
    "#7c6fff",
    "#4ecdc4",
    "#6bcb77",
    "#6bcb77",
    "#ffd166",
    "#ffd166",
  ];
  return colors[Math.max(1, Math.min(10, Math.round(score)))] || "#7c6fff";
}

function moodEmoji(score) {
  const emojis = [
    "",
    "💀",
    "😔",
    "😢",
    "😕",
    "😐",
    "🙂",
    "😊",
    "😄",
    "🌟",
    "🔥",
  ];
  return emojis[Math.max(1, Math.min(10, Math.round(score)))] || "😐";
}

function moodLabel(score) {
  const labels = [
    "",
    "Numb",
    "Depressed",
    "Very Sad",
    "Sad",
    "Neutral",
    "Okay",
    "Good",
    "Happy",
    "Great",
    "Ecstatic",
  ];
  return labels[Math.max(1, Math.min(10, Math.round(score)))] || "Neutral";
}

async function api(endpoint, options = {}) {
  const res = await fetch(endpoint, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return res.json();
}

// Expose globally
window.switchPage = switchPage;
window.toggleSidebar = toggleSidebar;
window.handleLogout = handleLogout;
window.toast = toast;
window.api = api;
window.formatDate = formatDate;
window.timeAgo = timeAgo;
window.wordCount = wordCount;
window.moodColor = moodColor;
window.moodEmoji = moodEmoji;
window.moodLabel = moodLabel;
