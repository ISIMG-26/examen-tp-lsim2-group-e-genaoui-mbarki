<?php
// api/journal.php
require_once __DIR__ . '/../config.php';

$user = requireAuth();
$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

header('Content-Type: application/json');

switch ($action) {
    case 'create':
        if ($method !== 'POST') jsonResponse(['error' => 'POST required'], 405);
        createEntry($db, $user['id']);
        break;
    case 'list':
        listEntries($db, $user['id']);
        break;
    case 'get':
        getEntry($db, $user['id']);
        break;
    case 'update':
        if ($method !== 'PUT' && $method !== 'POST') jsonResponse(['error' => 'POST/PUT required'], 405);
        updateEntry($db, $user['id']);
        break;
    case 'delete':
        if ($method !== 'DELETE' && $method !== 'POST') jsonResponse(['error' => 'Method required'], 405);
        deleteEntry($db, $user['id']);
        break;
    case 'pin':
        pinEntry($db, $user['id']);
        break;
    case 'prompt':
        getDailyPrompt($db);
        break;
    case 'search':
        searchEntries($db, $user['id']);
        break;
    default:
        jsonResponse(['error' => 'Invalid action'], 400);
}

function createEntry(Database $db, int $userId): void {
    $data = json_decode(file_get_contents('php://input'), true);
    $title = sanitize($data['title'] ?? '');
    $content = sanitize($data['content'] ?? '');
    $type = in_array($data['type'] ?? '', ['reflection', 'thought', 'gratitude', 'dream', 'goal'])
        ? $data['type'] : 'thought';
    $moodId = !empty($data['mood_id']) ? (int)$data['mood_id'] : null;
    $tags = json_encode($data['tags'] ?? []);
    $prompt = sanitize($data['prompt'] ?? '');
    $wordCount = str_word_count(strip_tags($content));

    if (!$content) jsonResponse(['error' => 'Content is required'], 400);

    $id = $db->insert(
        'INSERT INTO journal_entries (user_id, title, content, entry_type, mood_id, tags, prompt_used, word_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [$userId, $title, $content, $type, $moodId, $tags, $prompt, $wordCount]
    );

    jsonResponse(['success' => true, 'id' => $id, 'word_count' => $wordCount]);
}

function listEntries(Database $db, int $userId): void {
    $type = $_GET['type'] ?? '';
    $limit = min((int)($_GET['limit'] ?? 20), 50);
    $offset = (int)($_GET['offset'] ?? 0);

    $typeFilter = $type ? ' AND entry_type = ?' : '';
    $params = $type ? [$userId, $type, $limit, $offset] : [$userId, $limit, $offset];

    $entries = $db->fetchAll(
        "SELECT id, title, LEFT(content, 200) as preview, entry_type, tags, word_count,
                is_pinned, created_at, updated_at
         FROM journal_entries
         WHERE user_id = ?{$typeFilter}
         ORDER BY is_pinned DESC, created_at DESC
         LIMIT ? OFFSET ?",
        $params
    );

    $total = $db->fetch(
        "SELECT COUNT(*) as count FROM journal_entries WHERE user_id = ?{$typeFilter}",
        $type ? [$userId, $type] : [$userId]
    );

    jsonResponse(['entries' => $entries, 'total' => (int)$total['count']]);
}

function getEntry(Database $db, int $userId): void {
    $id = (int)($_GET['id'] ?? 0);
    $entry = $db->fetch(
        'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
        [$id, $userId]
    );
    if (!$entry) jsonResponse(['error' => 'Not found'], 404);
    jsonResponse(['entry' => $entry]);
}

function updateEntry(Database $db, int $userId): void {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = (int)($data['id'] ?? 0);
    $title = sanitize($data['title'] ?? '');
    $content = sanitize($data['content'] ?? '');
    $tags = json_encode($data['tags'] ?? []);
    $wordCount = str_word_count(strip_tags($content));

    if (!$id || !$content) jsonResponse(['error' => 'ID and content required'], 400);

    $db->query(
        'UPDATE journal_entries SET title = ?, content = ?, tags = ?, word_count = ?, updated_at = NOW()
         WHERE id = ? AND user_id = ?',
        [$title, $content, $tags, $wordCount, $id, $userId]
    );

    jsonResponse(['success' => true, 'word_count' => $wordCount]);
}

function deleteEntry(Database $db, int $userId): void {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = (int)($data['id'] ?? $_GET['id'] ?? 0);
    $db->query('DELETE FROM journal_entries WHERE id = ? AND user_id = ?', [$id, $userId]);
    jsonResponse(['success' => true]);
}

function pinEntry(Database $db, int $userId): void {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = (int)($data['id'] ?? 0);
    $db->query(
        'UPDATE journal_entries SET is_pinned = NOT is_pinned WHERE id = ? AND user_id = ?',
        [$id, $userId]
    );
    jsonResponse(['success' => true]);
}

function getDailyPrompt(Database $db): void {
    $dayOfYear = (int)date('z');
    $prompts = $db->fetchAll('SELECT id, prompt_text, category FROM daily_prompts WHERE is_active = 1');
    if (!$prompts) jsonResponse(['prompt' => null]);
    $prompt = $prompts[$dayOfYear % count($prompts)];
    jsonResponse(['prompt' => $prompt]);
}

function searchEntries(Database $db, int $userId): void {
    $q = sanitize($_GET['q'] ?? '');
    if (strlen($q) < 2) jsonResponse(['entries' => []]);

    $entries = $db->fetchAll(
        'SELECT id, title, LEFT(content, 150) as preview, entry_type, created_at
         FROM journal_entries
         WHERE user_id = ? AND (title LIKE ? OR content LIKE ?)
         ORDER BY created_at DESC LIMIT 10',
        [$userId, "%$q%", "%$q%"]
    );

    jsonResponse(['entries' => $entries]);
}