// Initialize map with MapTiler outdoor style
const map = L.map('map').setView([10.355, 124.965], 18);

// Use MapTiler outdoor style with your API key
L.tileLayer('https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=9VmFEZD7hpK4pJWwhECc', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    maxZoom: 20
}).addTo(map);

// Load campus boundary
fetch('data/campus-boundary.geojson')
    .then(res => res.json())
    .then(data => {
        const campusLayer = L.geoJSON(data, {
            style: {color: '#0066ff', fillOpacity: 0.1, weight: 3}
        }).addTo(map);
        
        // Restrict view to campus area
        map.fitBounds(campusLayer.getBounds());
    });

// Custom building icons
const buildingIcons = {
    library: L.icon({iconUrl: 'assets/icons/library.png', iconSize: [32, 32]}),
    admin: L.icon({iconUrl: 'assets/icons/admin.png', iconSize: [32, 32]}),
    classroom: L.icon({iconUrl: 'assets/icons/classroom.png', iconSize: [32, 32]}),
    lab: L.icon({iconUrl: 'assets/icons/lab.png', iconSize: [32, 32]}),
    cafe: L.icon({iconUrl: 'assets/icons/cafe.png', iconSize: [32, 32]}),
    default: L.icon({iconUrl: 'assets/icons/default.png', iconSize: [32, 32]})
};

// Load and display buildings
function loadBuildings() {
    fetch('/api/get_buildings.php')
        .then(res => res.json())
        .then(geoJson => {
            L.geoJSON(geoJson, {
                pointToLayer: (feature, latlng) => {
                    const icon = buildingIcons[feature.properties.category] || buildingIcons.default;
                    
                    return L.marker(latlng, {icon: icon})
                        .bindPopup(`
                            <div class="building-popup">
                                <h5>${feature.properties.name}</h5>
                                <p><strong>Type:</strong> ${feature.properties.category}</p>
                                <p><strong>Coordinates:</strong><br>
                                ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}</p>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-sm btn-primary start-route" 
                                            data-id="${feature.properties.id}">
                                        Start Route Here
                                    </button>
                                </div>
                            </div>
                        `);
                }
            }).addTo(map);
        });
}

loadBuildings();

// Add search functionality
const searchControl = new L.Control.Search({
    position: 'topright',
    layer: L.layerGroup(),
    initial: false,
    zoom: 18,
    marker: false,
    textPlaceholder: 'Search buildings...',
    propertyName: 'name',
    buildTip: (text, val) => {
        return `<a href="#" class="search-result">${val.layer.feature.properties.name}</a>`;
    }
});
searchControl.addTo(map);