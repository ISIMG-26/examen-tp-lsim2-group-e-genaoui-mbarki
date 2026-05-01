<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// api/auth.php
require_once __DIR__ . '/../config.php';

startSession();
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$db = Database::getInstance();

switch ($action) {
    case 'signup':
        handleSignup($db);
        break;
    case 'login':
        handleLogin($db);
        break;
    case 'logout':
        handleLogout();
        break;
    case 'check':
        jsonResponse(['authenticated' => !empty($_SESSION['user_id']), 'user' => $_SESSION['username'] ?? null]);
        break;
    default:
        jsonResponse(['error' => 'Invalid action'], 400);
}

function handleSignup(Database $db): void {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = sanitize($data['username'] ?? '');
    $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $password = $data['password'] ?? '';

    if (!$username || !$email || !$password) {
        jsonResponse(['error' => 'All fields are required'], 400);
    }
    if (strlen($username) < 3 || strlen($username) > 30) {
        jsonResponse(['error' => 'Username must be 3-30 characters'], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => 'Invalid email address'], 400);
    }
    if (strlen($password) < 6) {
        jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
    }

    $existing = $db->fetch('SELECT id FROM users WHERE username = ? OR email = ?', [$username, $email]);
    if ($existing) {
        jsonResponse(['error' => 'Username or email already taken'], 409);
    }

    $colors = ['#6C63FF', '#FF6B9D', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94'];
    $color = $colors[array_rand($colors)];
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);

    $userId = $db->insert(
        'INSERT INTO users (username, email, password_hash, avatar_color) VALUES (?, ?, ?, ?)',
        [$username, $email, $hash, $color]
    );

    $_SESSION['user_id'] = $userId;
    $_SESSION['username'] = $username;
    $_SESSION['avatar_color'] = $color;

    jsonResponse(['success' => true, 'username' => $username, 'redirect' => 'app.php']);
}

function handleLogin(Database $db): void {
    $data = json_decode(file_get_contents('php://input'), true);
    $identifier = sanitize($data['identifier'] ?? '');
    $password = $data['password'] ?? '';

    if (!$identifier || !$password) {
        jsonResponse(['error' => 'Email/username and password required'], 400);
    }

    $user = $db->fetch(
        'SELECT id, username, email, password_hash, avatar_color FROM users WHERE username = ? OR email = ?',
        [$identifier, $identifier]
    );

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['error' => 'Invalid credentials'], 401);
    }

    $db->query('UPDATE users SET last_login = NOW() WHERE id = ?', [$user['id']]);

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['avatar_color'] = $user['avatar_color'];

    jsonResponse(['success' => true, 'username' => $user['username'], 'redirect' => 'app.php']);
}

function handleLogout(): void {
    startSession();
    $_SESSION = [];
    session_destroy();
    jsonResponse(['success' => true, 'redirect' => 'index.php']);
}