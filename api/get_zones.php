<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

try {
    // Fetch all zones from database
    $stmt = $pdo->query("SELECT id, name, type, color, description, coordinates_json FROM zones");
    $zones = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert to GeoJSON format
    $features = [];
    foreach ($zones as $zone) {
        $coordinates = json_decode($zone['coordinates_json'], true);
        
        // Convert coordinates to GeoJSON format (swap lat/lng to lng/lat)
        $geoJsonCoordinates = [];
        foreach ($coordinates as $coord) {
            $geoJsonCoordinates[] = [(float) $coord['lng'], (float) $coord['lat']];
        }
        
        $features[] = [
            'type' => 'Feature',
            'properties' => [
                'id' => $zone['id'],
                'name' => $zone['name'],
                'type' => $zone['type'],
                'color' => $zone['color'],
                'description' => $zone['description']
            ],
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => [$geoJsonCoordinates]
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