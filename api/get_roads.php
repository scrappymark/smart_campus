<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

try {
    // Fetch all roads from database
    $stmt = $pdo->query("SELECT id, name, type, width, description, coordinates_json FROM roads");
    $roads = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert to GeoJSON format
    $features = [];
    foreach ($roads as $road) {
        $coordinates = json_decode($road['coordinates_json'], true);
        
        // Convert coordinates to GeoJSON format (swap lat/lng to lng/lat)
        $geoJsonCoordinates = [];
        foreach ($coordinates as $coord) {
            $geoJsonCoordinates[] = [(float) $coord['lng'], (float) $coord['lat']];
        }
        
        $features[] = [
            'type' => 'Feature',
            'properties' => [
                'id' => $road['id'],
                'name' => $road['name'],
                'type' => $road['type'],
                'width' => (int) $road['width'],
                'description' => $road['description']
            ],
            'geometry' => [
                'type' => 'LineString',
                'coordinates' => $geoJsonCoordinates
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