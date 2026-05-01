<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MindSpace</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/app.css">
</head>
<body>
    <!-- Ambient background -->
    <div class="ambient-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
    </div>

    <!-- Sidebar Navigation -->
    <nav class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="logo-mark">🧠</div>
            <div>
                <div class="brand-name">MindSpace</div>
                <div class="user-greeting" id="userGreeting">Loading...</div>
            </div>
        </div>

        <div class="nav-links">
            <a href="#" class="nav-item active" data-page="mood" onclick="switchPage('mood', this)">
                <span class="nav-icon">◉</span>
                <span class="nav-label">Mood Oracle</span>
                <span class="nav-badge" id="moodBadge"></span>
            </a>
            <a href="#" class="nav-item" data-page="breathe" onclick="switchPage('breathe', this)">
                <span class="nav-icon">◎</span>
                <span class="nav-label">Breathe</span>
            </a>
            <a href="#" class="nav-item" data-page="mindmap" onclick="switchPage('mindmap', this)">
                <span class="nav-icon">◈</span>
                <span class="nav-label">Mind Map</span>
            </a>
            <a href="#" class="nav-item" data-page="dashboard" onclick="switchPage('dashboard', this)">
                <span class="nav-icon">◇</span>
                <span class="nav-label">Insights</span>
            </a>
            <a href="#" class="nav-item" data-page="sanctuary" onclick="switchPage('sanctuary', this)">
                <span class="nav-icon">✦</span>
                <span class="nav-label">Sanctuary</span>
            </a>
        </div>

        <div class="sidebar-footer">
            <div class="streak-display">
                <span class="streak-fire">🔥</span>
                <span id="streakCount">0</span> day streak
            </div>
            <button class="logout-btn" onclick="handleLogout()">
                <span>↩</span> Sign out
            </button>
        </div>
    </nav>

    <!-- Mobile nav toggle -->
    <button class="mobile-nav-toggle" onclick="toggleSidebar()" id="mobileNavBtn">☰</button>

    <!-- Main content area -->
    <main class="main-content" id="mainContent">
        <!-- Pages loaded here -->
    </main>

    <!-- Toast notifications -->
    <div class="toast-container" id="toastContainer"></div>


    <script src="js/mood.js"></script>
    <script src="js/breathe.js"></script>
    <script src="js/mindmap.js"></script>
    <script src="js/dashboard.js"></script>
    <script src="js/sanctuary.js"></script>
    <script src="js/app.js"></script>
    <script>
        // Boot sequence
        document.addEventListener('DOMContentLoaded', () => {
            checkAuth().then(() => {
                loadUserStats();
                switchPage('mood');
            });
        });
    </script>
</body>
</html>