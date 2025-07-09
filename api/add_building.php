<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $pdo->prepare("INSERT INTO buildings (name, lat, lng, category, icon) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['name'],
        $data['lat'],
        $data['lng'],
        $data['category'],
        $data['icon']
    ]);
    
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>