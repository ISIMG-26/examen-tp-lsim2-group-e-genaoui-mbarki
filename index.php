<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MindSpace — Your Mental Sanctuary</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --bg: #0a0a12;
            --surface: #12121e;
            --surface2: #1a1a2e;
            --border: rgba(255,255,255,0.07);
            --text: #e8e6f0;
            --text-muted: #8b8a9e;
            --accent: #7c6fff;
            --accent2: #ff6b9d;
            --accent3: #4ecdc4;
            --gold: #ffd700;
            --glow: rgba(124, 111, 255, 0.15);
        }

        body {
            font-family: 'DM Sans', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }

        /* Animated background */
        .bg-orbs {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
        }

        .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.25;
            animation: float 12s ease-in-out infinite;
        }

        .orb-1 { width: 500px; height: 500px; background: var(--accent); top: -100px; left: -100px; animation-delay: 0s; }
        .orb-2 { width: 400px; height: 400px; background: var(--accent2); bottom: -80px; right: -80px; animation-delay: -4s; }
        .orb-3 { width: 300px; height: 300px; background: var(--accent3); top: 40%; left: 40%; animation-delay: -8s; }

        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.05); }
            66% { transform: translate(-20px, 20px) scale(0.95); }
        }

        .stars {
            position: fixed;
            inset: 0;
            z-index: 0;
            background-image:
                radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 100%),
                radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.2) 0%, transparent 100%),
                radial-gradient(1px 1px at 50% 70%, rgba(255,255,255,0.25) 0%, transparent 100%),
                radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.15) 0%, transparent 100%),
                radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.2) 0%, transparent 100%),
                radial-gradient(1.5px 1.5px at 35% 45%, rgba(255,255,255,0.3) 0%, transparent 100%),
                radial-gradient(1px 1px at 65% 85%, rgba(255,255,255,0.2) 0%, transparent 100%);
        }

        /* Card */
        .card {
            position: relative;
            z-index: 10;
            width: 420px;
            max-width: 95vw;
            background: rgba(18, 18, 30, 0.85);
            backdrop-filter: blur(30px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 48px 40px;
            animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes cardIn {
            from { opacity: 0; transform: translateY(30px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .logo {
            text-align: center;
            margin-bottom: 36px;
        }

        .logo-icon {
            width: 56px;
            height: 56px;
            margin: 0 auto 12px;
            background: linear-gradient(135deg, var(--accent), var(--accent2));
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            box-shadow: 0 8px 32px rgba(124, 111, 255, 0.4);
        }

        .logo h1 {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #fff 0%, var(--accent) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .logo p {
            font-size: 13px;
            color: var(--text-muted);
            margin-top: 4px;
        }

        /* Tabs */
        .tabs {
            display: flex;
            background: var(--surface2);
            border-radius: 12px;
            padding: 4px;
            margin-bottom: 28px;
        }

        .tab-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 9px;
            background: transparent;
            color: var(--text-muted);
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.25s ease;
        }

        .tab-btn.active {
            background: var(--accent);
            color: white;
            box-shadow: 0 4px 16px rgba(124, 111, 255, 0.4);
        }

        /* Form */
        .form { display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }

        label {
            font-size: 12px;
            font-weight: 500;
            color: var(--text-muted);
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        input {
            background: var(--surface2);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 13px 16px;
            color: var(--text);
            font-family: 'DM Sans', sans-serif;
            font-size: 15px;
            transition: all 0.2s;
            outline: none;
        }

        input:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(124, 111, 255, 0.15);
        }

        input::placeholder { color: var(--text-muted); }

        .btn-primary {
            padding: 14px;
            background: linear-gradient(135deg, var(--accent), #9f8bff);
            border: none;
            border-radius: 12px;
            color: white;
            font-family: 'DM Sans', sans-serif;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.25s ease;
            margin-top: 4px;
            position: relative;
            overflow: hidden;
        }

        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(124, 111, 255, 0.45);
        }

        .btn-primary:active { transform: translateY(0); }

        .btn-primary.loading::after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(255,255,255,0.1);
        }

        .error-msg {
            background: rgba(255, 80, 80, 0.1);
            border: 1px solid rgba(255, 80, 80, 0.2);
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 13px;
            color: #ff6b6b;
            display: none;
        }

        .error-msg.show { display: block; }

        .success-msg {
            background: rgba(78, 205, 196, 0.1);
            border: 1px solid rgba(78, 205, 196, 0.2);
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 13px;
            color: var(--accent3);
            display: none;
        }

        .success-msg.show { display: block; }

        .form-panel { display: none; }
        .form-panel.active { display: block; }

        .divider {
            text-align: center;
            margin: 20px 0 4px;
            font-size: 12px;
            color: var(--text-muted);
        }

        .footer-text {
            text-align: center;
            margin-top: 24px;
            font-size: 12px;
            color: var(--text-muted);
        }
    </style>
</head>
<body>
    <div class="bg-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
    </div>
    <div class="stars"></div>

    <div class="card">
        <div class="logo">
            <div class="logo-icon">🧠</div>
            <h1>MindSpace</h1>
            <p>Your private mental sanctuary</p>
        </div>

        <div class="tabs">
            <button class="tab-btn active" onclick="switchTab('login')">Sign In</button>
            <button class="tab-btn" onclick="switchTab('signup')">Create Account</button>
        </div>

        <div id="errorMsg" class="error-msg"></div>
        <div id="successMsg" class="success-msg"></div>

        <!-- Login -->
        <div id="loginPanel" class="form-panel active">
            <div class="form">
                <div class="form-group">
                    <label>Username or Email</label>
                    <input type="text" id="loginIdentifier" placeholder="your@email.com" autocomplete="email">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="loginPassword" placeholder="••••••••" autocomplete="current-password">
                </div>
                <button class="btn-primary" onclick="handleLogin()">Enter MindSpace →</button>
            </div>
        </div>

        <!-- Signup -->
        <div id="signupPanel" class="form-panel">
            <div class="form">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="signupUsername" placeholder="choose a username" autocomplete="username">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="signupEmail" placeholder="your@email.com" autocomplete="email">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="signupPassword" placeholder="min 6 characters" autocomplete="new-password">
                </div>
                <button class="btn-primary" onclick="handleSignup()">Begin Your Journey →</button>
            </div>
        </div>

        <div class="footer-text">
            Your thoughts are yours alone. Encrypted & private.
        </div>
    </div>

    <script>
        function switchTab(tab) {
            const tabs = document.querySelectorAll('.tab-btn');
            const panels = document.querySelectorAll('.form-panel');
            tabs.forEach((t, i) => t.classList.toggle('active', (i === 0) === (tab === 'login')));
            document.getElementById('loginPanel').classList.toggle('active', tab === 'login');
            document.getElementById('signupPanel').classList.toggle('active', tab === 'signup');
            clearMessages();
        }

        function showError(msg) {
            const el = document.getElementById('errorMsg');
            el.textContent = msg;
            el.classList.add('show');
            document.getElementById('successMsg').classList.remove('show');
        }

        function showSuccess(msg) {
            const el = document.getElementById('successMsg');
            el.textContent = msg;
            el.classList.add('show');
            document.getElementById('errorMsg').classList.remove('show');
        }

        function clearMessages() {
            document.getElementById('errorMsg').classList.remove('show');
            document.getElementById('successMsg').classList.remove('show');
        }

        async function handleLogin() {
            const identifier = document.getElementById('loginIdentifier').value.trim();
            const password = document.getElementById('loginPassword').value;
            if (!identifier || !password) return showError('Please fill all fields');

            try {
                const res = await fetch('api/auth.php?action=login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identifier, password })
                });
                const data = await res.json();
                if (data.error) return showError(data.error);
                showSuccess('Welcome back! Loading your space...');
                setTimeout(() => window.location.href = data.redirect, 800);
            } catch (e) {
                showError('Connection error. Please try again.');
            }
        }

        async function handleSignup() {
            const username = document.getElementById('signupUsername').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            if (!username || !email || !password) return showError('Please fill all fields');

            try {
                const res = await fetch('api/auth.php?action=signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await res.json();
                if (data.error) return showError(data.error);
                showSuccess('Account created! Entering your space...');
                setTimeout(() => window.location.href = data.redirect, 800);
            } catch (e) {
                showError('Connection error. Please try again.');
            }
        }

        // Enter key support
        document.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const active = document.querySelector('.form-panel.active');
                active.id === 'loginPanel' ? handleLogin() : handleSignup();
            }
        });

        // Check if already logged in
        fetch('api/auth.php?action=check')
            .then(r => r.json())
            .then(d => { if (d.authenticated) window.location.href = 'app.php'; });
    </script>
</body>
</html>