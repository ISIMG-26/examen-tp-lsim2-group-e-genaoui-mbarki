<?php
// api/sessions.php
require_once __DIR__ . '/../config.php';

$user = requireAuth();
$db = Database::getInstance();
$action = $_GET['action'] ?? '';

header('Content-Type: application/json');

switch ($action) {
    case 'log_breathing':
        logBreathing($db, $user['id']);
        break;
    case 'log_sanctuary':
        logSanctuary($db, $user['id']);
        break;
    case 'user_stats':
        getUserStats($db, $user['id']);
        break;
    default:
        jsonResponse(['error' => 'Invalid action'], 400);
}

function logBreathing(Database $db, int $userId): void {
    $data = json_decode(file_get_contents('php://input'), true);
    $pattern = sanitize($data['pattern'] ?? 'box');
    $duration = (int)($data['duration'] ?? 0);
    $completed = (int)($data['completed'] ?? 1);

    $db->insert(
        'INSERT INTO breathing_sessions (user_id, pattern_name, duration_seconds, completed) VALUES (?, ?, ?, ?)',
        [$userId, $pattern, $duration, $completed]
    );

    jsonResponse(['success' => true]);
}

function logSanctuary(Database $db, int $userId): void {
    $data = json_decode(file_get_contents('php://input'), true);
    $sound = sanitize($data['sound'] ?? '');
    $duration = (int)($data['duration'] ?? 0);
    $completed = (int)($data['completed'] ?? 0);

    $db->insert(
        'INSERT INTO sanctuary_sessions (user_id, sound_type, focus_duration, completed) VALUES (?, ?, ?, ?)',
        [$userId, $sound, $duration, $completed]
    );

    jsonResponse(['success' => true]);
}

function getUserStats(Database $db, int $userId): void {
    $user = $db->fetch(
        'SELECT username, avatar_color, streak_count, total_entries, created_at FROM users WHERE id = ?',
        [$userId]
    );

    $journalCount = $db->fetch(
        'SELECT COUNT(*) as count, SUM(word_count) as total_words FROM journal_entries WHERE user_id = ?',
        [$userId]
    );

    $breathingCount = $db->fetch(
        'SELECT COUNT(*) as count, SUM(duration_seconds) as total_seconds
         FROM breathing_sessions WHERE user_id = ? AND completed = 1',
        [$userId]
    );

    $sanctuaryCount = $db->fetch(
        'SELECT COUNT(*) as count FROM sanctuary_sessions WHERE user_id = ? AND completed = 1',
        [$userId]
    );

    $moodCount = $db->fetch(
        'SELECT COUNT(*) as count, ROUND(AVG(mood_score), 1) as avg_mood
         FROM mood_logs WHERE user_id = ?',
        [$userId]
    );

    jsonResponse([
        'user' => $user,
        'journal' => $journalCount,
        'breathing' => $breathingCount,
        'sanctuary' => $sanctuaryCount,
        'mood' => $moodCount,
    ]);
}