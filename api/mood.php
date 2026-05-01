<?php
// api/mood.php
require_once __DIR__ . '/../config.php';

$user = requireAuth();
$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

header('Content-Type: application/json');

switch ($action) {
    case 'log':
        if ($method !== 'POST') jsonResponse(['error' => 'POST required'], 405);
        logMood($db, $user['id']);
        break;
    case 'today':
        getTodayMood($db, $user['id']);
        break;
    case 'history':
        getMoodHistory($db, $user['id']);
        break;
    case 'calendar':
        getMoodCalendar($db, $user['id']);
        break;
    case 'stats':
        getMoodStats($db, $user['id']);
        break;
    default:
        jsonResponse(['error' => 'Invalid action'], 400);
}

function logMood(Database $db, int $userId): void {
    $data = json_decode(file_get_contents('php://input'), true);
    $moodScore = (int)($data['mood_score'] ?? 5);
    $moodLabel = sanitize($data['mood_label'] ?? 'Neutral');
    $moodEmoji = sanitize($data['mood_emoji'] ?? '😐');
    $energyLevel = (int)($data['energy_level'] ?? 5);
    $anxietyLevel = (int)($data['anxiety_level'] ?? 5);
    $note = sanitize($data['note'] ?? '');
    $tags = json_encode($data['tags'] ?? []);

    if ($moodScore < 1 || $moodScore > 10) jsonResponse(['error' => 'Invalid mood score'], 400);

    $id = $db->insert(
        'INSERT INTO mood_logs (user_id, mood_score, mood_label, mood_emoji, energy_level, anxiety_level, note, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [$userId, $moodScore, $moodLabel, $moodEmoji, $energyLevel, $anxietyLevel, $note, $tags]
    );

    updateStreak($db, $userId);
    jsonResponse(['success' => true, 'id' => $id]);
}

function getTodayMood(Database $db, int $userId): void {
    $mood = $db->fetch(
        'SELECT * FROM mood_logs WHERE user_id = ? AND DATE(logged_at) = CURDATE() ORDER BY logged_at DESC LIMIT 1',
        [$userId]
    );
    jsonResponse(['mood' => $mood]);
}

function getMoodHistory(Database $db, int $userId): void {
    $limit = min((int)($_GET['limit'] ?? 30), 90);
    $moods = $db->fetchAll(
        'SELECT mood_score, mood_label, mood_emoji, energy_level, anxiety_level, logged_at
         FROM mood_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT ?',
        [$userId, $limit]
    );
    jsonResponse(['moods' => $moods]);
}

function getMoodCalendar(Database $db, int $userId): void {
    $year = (int)($_GET['year'] ?? date('Y'));
    $month = (int)($_GET['month'] ?? date('n'));

    $data = $db->fetchAll(
        'SELECT DATE(logged_at) as date, ROUND(AVG(mood_score), 1) as avg_mood,
                mood_label, mood_emoji
         FROM mood_logs
         WHERE user_id = ? AND YEAR(logged_at) = ? AND MONTH(logged_at) = ?
         GROUP BY DATE(logged_at)
         ORDER BY date',
        [$userId, $year, $month]
    );

    $calendar = [];
    foreach ($data as $row) {
        $calendar[$row['date']] = [
            'avg_mood' => (float)$row['avg_mood'],
            'label' => $row['mood_label'],
            'emoji' => $row['mood_emoji'],
        ];
    }
    jsonResponse(['calendar' => $calendar]);
}

function getMoodStats(Database $db, int $userId): void {
    $stats = $db->fetch(
        'SELECT 
            COUNT(*) as total_logs,
            ROUND(AVG(mood_score), 2) as avg_mood,
            MAX(mood_score) as best_mood,
            MIN(mood_score) as worst_mood,
            ROUND(AVG(energy_level), 2) as avg_energy,
            ROUND(AVG(anxiety_level), 2) as avg_anxiety
         FROM mood_logs WHERE user_id = ?',
        [$userId]
    );

    $weeklyTrend = $db->fetchAll(
        'SELECT DATE(logged_at) as date, ROUND(AVG(mood_score), 1) as avg_mood
         FROM mood_logs
         WHERE user_id = ? AND logged_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         GROUP BY DATE(logged_at)
         ORDER BY date',
        [$userId]
    );

    $monthlyTrend = $db->fetchAll(
        'SELECT MONTH(logged_at) as month, YEAR(logged_at) as year,
                ROUND(AVG(mood_score), 1) as avg_mood
         FROM mood_logs
         WHERE user_id = ? AND logged_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
         GROUP BY YEAR(logged_at), MONTH(logged_at)
         ORDER BY year, month',
        [$userId]
    );

    $moodDistribution = $db->fetchAll(
        'SELECT mood_label, COUNT(*) as count
         FROM mood_logs WHERE user_id = ?
         GROUP BY mood_label ORDER BY count DESC',
        [$userId]
    );

    $user = $db->fetch('SELECT streak_count, total_entries FROM users WHERE id = ?', [$userId]);

    jsonResponse([
        'stats' => $stats,
        'weekly_trend' => $weeklyTrend,
        'monthly_trend' => $monthlyTrend,
        'distribution' => $moodDistribution,
        'streak' => $user['streak_count'] ?? 0,
        'total_entries' => $user['total_entries'] ?? 0,
    ]);
}

function updateStreak(Database $db, int $userId): void {
    $yesterday = $db->fetch(
        'SELECT id FROM mood_logs WHERE user_id = ? AND DATE(logged_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)',
        [$userId]
    );

    if ($yesterday) {
        $db->query('UPDATE users SET streak_count = streak_count + 1 WHERE id = ?', [$userId]);
    } else {
        $existing = $db->fetch(
            'SELECT id FROM mood_logs WHERE user_id = ? AND DATE(logged_at) = CURDATE() AND id != LAST_INSERT_ID()',
            [$userId]
        );
        if (!$existing) {
            $db->query('UPDATE users SET streak_count = 1 WHERE id = ?', [$userId]);
        }
    }
    $db->query('UPDATE users SET total_entries = total_entries + 1 WHERE id = ?', [$userId]);
}