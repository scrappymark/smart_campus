<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

$conn = db_connect();

try {
    $stmt = $pdo->query("SELECT * FROM buildings");
    $buildings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $buildings]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}