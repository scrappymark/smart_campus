<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'error' => 'Zone ID is required']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM zones WHERE id = ?");
    $result = $stmt->execute([$id]);
    
    if ($result && $stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Zone not found']);
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>