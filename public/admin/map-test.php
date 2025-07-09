<?php
require_once __DIR__ . '/../../config.php';

$title = 'Map Editor Test';
$subTitle = 'Testing';
?>
<?php include partial('layouts.top') ?>

<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Map Editor Test Page</h5>
            </div>
            <div class="card-body">
                <p>This page tests the basic map functionality without the full editor interface.</p>
                <div id="testMap" style="height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px;"></div>
            </div>
        </div>
    </div>
</div>

<?php 
$style = '
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<link rel="stylesheet" href="' . asset('css/map-editor.css') . '" />
'; 
?>

<?php 
$script = '
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    // Initialize test map
    const map = L.map("testMap").setView([10.355, 124.965], 18);
    
    // Add MapTiler outdoor tile layer
    L.tileLayer("https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=9VmFEZD7hpK4pJWwhECc", {
        attribution: \'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>\',
        maxZoom: 20
    }).addTo(map);

    // Load campus boundary
    fetch("assets/data/campus-boundary.geojson")
        .then(res => res.json())
        .then(data => {
            const campusLayer = L.geoJSON(data, {
                style: {
                    color: "#0066ff",
                    fillOpacity: 0.1,
                    weight: 3
                }
            }).addTo(map);
            
            map.fitBounds(campusLayer.getBounds());
        })
        .catch(error => {
            console.error("Error loading campus boundary:", error);
        });

    // Test API endpoints
    console.log("Testing API endpoints...");
    
    // Test buildings API
    fetch("/api/get_buildings.php")
        .then(res => res.json())
        .then(data => {
            console.log("Buildings loaded:", data.features.length);
        })
        .catch(error => {
            console.error("Error loading buildings:", error);
        });

    // Test roads API
    fetch("/api/get_roads.php")
        .then(res => res.json())
        .then(data => {
            console.log("Roads loaded:", data.features.length);
        })
        .catch(error => {
            console.error("Error loading roads:", error);
        });

    // Test zones API
    fetch("/api/get_zones.php")
        .then(res => res.json())
        .then(data => {
            console.log("Zones loaded:", data.features.length);
        })
        .catch(error => {
            console.error("Error loading zones:", error);
        });
});
</script>
'; 
?>

<?php include partial('layouts.bottom') ?>