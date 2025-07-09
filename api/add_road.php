<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $pdo->prepare("INSERT INTO roads (name, type, width, description, coordinates_json) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['name'],
        $data['type'],
        $data['width'],
        $data['description'],
        json_encode($data['coordinates'])
    ]);
    
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>