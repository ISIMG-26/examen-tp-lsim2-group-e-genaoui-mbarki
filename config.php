<?php
// config.php - Database configuration
// Place this file OUTSIDE your web root if possible, or protect with .htaccess
error_reporting(E_ALL);
ini_set('display_errors', 1);
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // Change to your MySQL username
define('DB_PASS', '');            // Change to your MySQL password
define('DB_NAME', 'mindspace');
define('DB_CHARSET', 'utf8mb4');

define('SESSION_NAME', 'mindspace_session');
define('SESSION_LIFETIME', 86400 * 7); // 7 days

// Security
define('BCRYPT_COST', 12);

class Database {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed']));
        }
    }

    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection(): PDO {
        return $this->pdo;
    }

    public function query(string $sql, array $params = []): PDOStatement {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public function fetch(string $sql, array $params = []): ?array {
        return $this->query($sql, $params)->fetch() ?: null;
    }

    public function fetchAll(string $sql, array $params = []): array {
        return $this->query($sql, $params)->fetchAll();
    }

    public function insert(string $sql, array $params = []): int {
        $this->query($sql, $params);
        return (int)$this->pdo->lastInsertId();
    }
}

// Session setup
function startSession(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_name(SESSION_NAME);
        session_set_cookie_params([
            'lifetime' => SESSION_LIFETIME,
            'path'     => '/',
            'secure'   => false, // Set true if using HTTPS
            'httponly' => true,
            'samesite' => 'Strict',
        ]);
        session_start();
    }
}

function requireAuth(): array {
    startSession();
    if (empty($_SESSION['user_id'])) {
        if (isApiRequest()) {
            http_response_code(401);
            die(json_encode(['error' => 'Unauthorized']));
        }
        header('Location: /mindspace/index.php');
        exit;
    }
    return ['id' => $_SESSION['user_id'], 'username' => $_SESSION['username']];
}

function isApiRequest(): bool {
    return str_contains($_SERVER['REQUEST_URI'] ?? '', '/api/');
}

function jsonResponse(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function sanitize(string $input): string {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}