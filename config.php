<?php
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_samesite', 'Strict');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32));
}

function base_url($path = '')
{
    $docRoot = str_replace('\\', '/', realpath($_SERVER['DOCUMENT_ROOT']));
    $baseDir = str_replace('\\', '/', realpath(__DIR__));
    $base = str_replace($docRoot, '', $baseDir);
    if ($base === '' || $base === false) $base = '/';
    if (substr($base, -1) !== '/') $base .= '/';
    return $base . ltrim($path, '/');
}

function special_chars($string)
{
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

function asset($path = '')
{
    return base_url('/assets/' . ltrim($path, '/'));
}

function view($path = '')
{
    return base_url('/public/' . str_replace('.', '/', $path) . '.php');
}

function partial($path = '')
{
    return __DIR__ . '/public/partials/' . ltrim(str_replace('.', '/', $path), '/') . '.php';
}

function layouts($path = '')
{
    return __DIR__ . '/public/partials/layouts/' . ltrim(str_replace('.', '/', $path), '/') . '.php';
}

function verify_token($token)
{
    return isset($_SESSION['token']) && hash_equals($_SESSION['token'], $token);
}

function is_logged_in()
{
    return isset($_SESSION['id'], $_SESSION['role'], $_SESSION['last_login']);
}

if (isset($_POST['logout'])) {
    if (!verify_token($_POST['token'])) {
        $_SESSION['error-page'] = true;
        header('Location: ' . view('auth.error.500'));
        exit;
    }

    session_unset();
    session_destroy();

    $_SESSION['logout'] = true;

    header('Location: ' . view('auth.logout'));
    exit;
}

function redirect_based_on_role($role)
{
    $map = [
        '1' => view('admin.index'),
        '2' => view('student.index'),
    ];

    $validRoles = ['1', '2'];

    if (in_array($role, $validRoles)) {
        header('Location: ' . $map[$role]);
    } else {
        $_SESSION['error-page'] = true;
        header('Location: ' . view('auth.error.403'));
    }
    exit;
}



function db_connect()
{
    static $pdo = null;

    if ($pdo === null) {
        $host = 'localhost';
        $dbname = 'campus_nav';
        $user = 'root';
        $pass = '';

        try {
            $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Database error: " . $e->getMessage());
        }
    }

    return $pdo;
}

$pdo = db_connect();

if (is_logged_in()) {
    function getData($id)
    {
        $stmt = db_connect()->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            return $result;
        }
        return null;
    }

    define('USER', getData($_SESSION['id']));

    if (USER === null) {
        session_unset();
        session_destroy();

        $_SESSION['error-page'] = true;
        header('Location: ' . view('auth.error.403'));
        exit;
    }
}