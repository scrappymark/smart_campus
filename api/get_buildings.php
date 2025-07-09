<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

try {
    // Fetch all buildings from database
    $stmt = $pdo->query("SELECT id, name, lat, lng, category, icon FROM buildings");
    $buildings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert to GeoJSON format
    $features = [];
    foreach ($buildings as $building) {
        $features[] = [
            'type' => 'Feature',
            'properties' => [
                'id' => $building['id'],
                'name' => $building['name'],
                'category' => $building['category'],
                'icon' => $building['icon'],
                'popupContent' => "<b>{$building['name']}</b><br>{$building['category']}"
            ],
            'geometry' => [
                'type' => 'Point',
                'coordinates' => [
                    (float) $building['lng'],
                    (float) $building['lat']
                ]
            ]
        ];
    }

    $geoJson = [
        'type' => 'FeatureCollection',
        'features' => $features
    ];

    echo json_encode($geoJson);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error: ' . $e->getMessage(),
        'success' => false
    ]);
}
?>