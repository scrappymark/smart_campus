// Campus Map Editor - Interactive Admin Tool
class CampusMapEditor {
    constructor() {
        this.map = null;
        this.campusBoundary = null;
        this.currentMode = 'view';
        this.drawnItems = new L.FeatureGroup();
        this.buildingLayer = new L.FeatureGroup();
        this.roadLayer = new L.FeatureGroup();
        this.zoneLayer = new L.FeatureGroup();
        this.currentFeature = null;
        this.drawControl = null;
        this.searchResults = [];
        
        this.init();
    }

    init() {
        this.initializeMap();
        this.loadCampusBoundary();
        this.setupEventListeners();
        this.loadExistingFeatures();
        this.setupLayerControls();
        this.setupFeatureStats();
    }

    initializeMap() {
        // Initialize map with MapTiler outdoor style
        this.map = L.map('map').setView([10.355, 124.965], 18);

        // Add MapTiler outdoor tile layer
        L.tileLayer('https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=9VmFEZD7hpK4pJWwhECc', {
            attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
            maxZoom: 20
        }).addTo(this.map);

        // Add feature groups to map
        this.map.addLayer(this.buildingLayer);
        this.map.addLayer(this.roadLayer);
        this.map.addLayer(this.zoneLayer);
        this.map.addLayer(this.drawnItems);
    }

    loadCampusBoundary() {
        fetch('assets/data/campus-boundary.geojson')
            .then(res => res.json())
            .then(data => {
                this.campusBoundary = L.geoJSON(data, {
                    style: {
                        color: '#0066ff',
                        fillOpacity: 0.1,
                        weight: 3,
                        className: 'campus-boundary'
                    }
                }).addTo(this.map);
                
                // Restrict view to campus area and prevent panning outside
                const bounds = this.campusBoundary.getBounds();
                this.map.setMaxBounds(bounds.pad(0.1));
                this.map.fitBounds(bounds);
                
                // Add campus boundary to layer controls
                this.addLayerControl('Campus Boundary', this.campusBoundary, true);
            })
            .catch(error => {
                console.error('Error loading campus boundary:', error);
                this.showToast('Error loading campus boundary', 'error');
            });
    }

    setupEventListeners() {
        // Mode switching
        document.getElementById('buildingMode').addEventListener('click', () => this.switchMode('building'));
        document.getElementById('roadMode').addEventListener('click', () => this.switchMode('road'));
        document.getElementById('zoneMode').addEventListener('click', () => this.switchMode('zone'));
        document.getElementById('viewMode').addEventListener('click', () => this.switchMode('view'));

        // Map click events
        this.map.on('click', (e) => this.handleMapClick(e));

        // Drawing events
        this.map.on('draw:created', (e) => this.handleDrawCreated(e));
        this.map.on('draw:edited', (e) => this.handleDrawEdited(e));
        this.map.on('draw:deleted', (e) => this.handleDrawDeleted(e));

        // Modal events
        document.getElementById('saveBuilding').addEventListener('click', () => this.saveBuilding());
        document.getElementById('saveRoad').addEventListener('click', () => this.saveRoad());
        document.getElementById('saveZone').addEventListener('click', () => this.saveZone());

        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.performSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(mode + 'Mode').classList.add('active');

        // Remove existing draw controls
        if (this.drawControl) {
            this.map.removeControl(this.drawControl);
        }

        // Clear current feature
        this.currentFeature = null;

        // Setup mode-specific functionality
        switch (mode) {
            case 'building':
                this.setupBuildingMode();
                break;
            case 'road':
                this.setupRoadMode();
                break;
            case 'zone':
                this.setupZoneMode();
                break;
            case 'view':
                this.setupViewMode();
                break;
        }

        this.showToast(`Switched to ${mode} mode`, 'info');
    }

    setupBuildingMode() {
        // Add drawing controls for markers
        this.drawControl = new L.Control.Draw({
            draw: {
                marker: {
                    icon: L.divIcon({
                        className: 'new-marker',
                        html: '📍',
                        iconSize: [32, 32]
                    })
                },
                polyline: false,
                polygon: false,
                circle: false,
                rectangle: false,
                circlemarker: false
            },
            edit: {
                featureGroup: this.buildingLayer
            }
        });
        this.map.addControl(this.drawControl);

        // Show instructions
        this.showDrawingInstructions('Click on the map to add buildings, or use the drawing toolbar');
    }

    setupRoadMode() {
        // Add drawing controls for polylines
        this.drawControl = new L.Control.Draw({
            draw: {
                marker: false,
                polyline: {
                    shapeOptions: {
                        color: '#198754',
                        weight: 4
                    }
                },
                polygon: false,
                circle: false,
                rectangle: false,
                circlemarker: false
            },
            edit: {
                featureGroup: this.roadLayer
            }
        });
        this.map.addControl(this.drawControl);

        this.showDrawingInstructions('Draw roads and paths by clicking points. Double-click to finish.');
    }

    setupZoneMode() {
        // Add drawing controls for polygons
        this.drawControl = new L.Control.Draw({
            draw: {
                marker: false,
                polyline: false,
                polygon: {
                    shapeOptions: {
                        color: '#fd7e14',
                        fillOpacity: 0.3
                    }
                },
                circle: {
                    shapeOptions: {
                        color: '#fd7e14',
                        fillOpacity: 0.3
                    }
                },
                rectangle: {
                    shapeOptions: {
                        color: '#fd7e14',
                        fillOpacity: 0.3
                    }
                },
                circlemarker: false
            },
            edit: {
                featureGroup: this.zoneLayer
            }
        });
        this.map.addControl(this.drawControl);

        this.showDrawingInstructions('Draw zones by creating polygons or rectangles');
    }

    setupViewMode() {
        // Remove drawing controls
        if (this.drawControl) {
            this.map.removeControl(this.drawControl);
        }
        
        this.hideDrawingInstructions();
        
        // Enable popup interactions
        this.enableFeatureInteractions();
    }

    handleMapClick(e) {
        if (this.currentMode === 'building') {
            this.addBuildingMarker(e.latlng);
        }
    }

    handleDrawCreated(e) {
        const layer = e.layer;
        
        switch (this.currentMode) {
            case 'building':
                this.addBuildingMarker(layer.getLatLng());
                break;
            case 'road':
                this.addRoadPath(layer);
                break;
            case 'zone':
                this.addZoneArea(layer);
                break;
        }
    }

    handleDrawEdited(e) {
        const layers = e.layers;
        layers.eachLayer((layer) => {
            this.updateFeature(layer);
        });
    }

    handleDrawDeleted(e) {
        const layers = e.layers;
        layers.eachLayer((layer) => {
            this.deleteFeature(layer);
        });
    }

    addBuildingMarker(latlng) {
        // Check if point is within campus boundary
        if (this.campusBoundary && !this.isPointInCampus(latlng)) {
            this.showToast('Please place buildings inside the campus boundary', 'warning');
            return;
        }

        this.currentFeature = {
            type: 'building',
            latlng: latlng,
            layer: L.marker(latlng, {
                draggable: true,
                icon: L.divIcon({
                    className: 'new-marker',
                    html: '📍',
                    iconSize: [32, 32]
                })
            })
        };

        this.map.addLayer(this.currentFeature.layer);
        this.showBuildingModal();
    }

    addRoadPath(layer) {
        this.currentFeature = {
            type: 'road',
            layer: layer
        };

        this.map.addLayer(layer);
        this.showRoadModal();
    }

    addZoneArea(layer) {
        this.currentFeature = {
            type: 'zone',
            layer: layer
        };

        this.map.addLayer(layer);
        this.showZoneModal();
    }

    showBuildingModal() {
        const modal = new bootstrap.Modal(document.getElementById('buildingModal'));
        
        // Set coordinates
        document.getElementById('buildingLat').value = this.currentFeature.latlng.lat;
        document.getElementById('buildingLng').value = this.currentFeature.latlng.lng;
        
        // Clear form
        document.getElementById('buildingForm').reset();
        
        modal.show();
    }

    showRoadModal() {
        const modal = new bootstrap.Modal(document.getElementById('roadModal'));
        document.getElementById('roadForm').reset();
        modal.show();
    }

    showZoneModal() {
        const modal = new bootstrap.Modal(document.getElementById('zoneModal'));
        document.getElementById('zoneForm').reset();
        modal.show();
    }

    saveBuilding() {
        const formData = {
            name: document.getElementById('buildingName').value,
            code: document.getElementById('buildingCode').value,
            department: document.getElementById('buildingDepartment').value,
            category: document.getElementById('buildingCategory').value,
            description: document.getElementById('buildingDescription').value,
            lat: this.currentFeature.latlng.lat,
            lng: this.currentFeature.latlng.lng
        };

        if (!formData.name || !formData.category) {
            this.showToast('Please fill in all required fields', 'warning');
            return;
        }

        this.saveFeature('building', formData);
    }

    saveRoad() {
        const formData = {
            name: document.getElementById('roadName').value,
            type: document.getElementById('roadType').value,
            width: document.getElementById('roadWidth').value,
            description: document.getElementById('roadDescription').value,
            coordinates: this.currentFeature.layer.getLatLngs()
        };

        if (!formData.name || !formData.type) {
            this.showToast('Please fill in all required fields', 'warning');
            return;
        }

        this.saveFeature('road', formData);
    }

    saveZone() {
        const formData = {
            name: document.getElementById('zoneName').value,
            type: document.getElementById('zoneType').value,
            color: document.getElementById('zoneColor').value,
            description: document.getElementById('zoneDescription').value,
            coordinates: this.currentFeature.layer.getLatLngs()
        };

        if (!formData.name || !formData.type) {
            this.showToast('Please fill in all required fields', 'warning');
            return;
        }

        this.saveFeature('zone', formData);
    }

    saveFeature(type, data) {
        fetch(`/api/add_${type}.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Remove temporary layer
                if (this.currentFeature && this.currentFeature.layer) {
                    this.map.removeLayer(this.currentFeature.layer);
                }

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById(type + 'Modal'));
                modal.hide();

                // Reload features
                this.loadExistingFeatures();

                this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully!`, 'success');
            } else {
                this.showToast(result.message || 'Error saving feature', 'error');
            }
        })
        .catch(error => {
            console.error('Error saving feature:', error);
            this.showToast('Error saving feature', 'error');
        });
    }

    loadExistingFeatures() {
        // Load buildings
        fetch('/api/get_buildings.php')
            .then(res => res.json())
            .then(data => this.displayBuildings(data))
            .catch(error => console.error('Error loading buildings:', error));

        // Load roads
        fetch('/api/get_roads.php')
            .then(res => res.json())
            .then(data => this.displayRoads(data))
            .catch(error => console.error('Error loading roads:', error));

        // Load zones
        fetch('/api/get_zones.php')
            .then(res => res.json())
            .then(data => this.displayZones(data))
            .catch(error => console.error('Error loading zones:', error));
    }

    displayBuildings(geoJson) {
        // Clear existing building markers
        this.buildingLayer.clearLayers();

        L.geoJSON(geoJson, {
            pointToLayer: (feature, latlng) => {
                const icon = this.getBuildingIcon(feature.properties.category);
                
                return L.marker(latlng, {icon: icon})
                    .bindPopup(this.createBuildingPopup(feature))
                    .on('click', () => this.handleBuildingClick(feature));
            }
        }).addTo(this.buildingLayer);
    }

    displayRoads(geoJson) {
        // Clear existing road layers
        this.roadLayer.clearLayers();

        L.geoJSON(geoJson, {
            style: (feature) => ({
                color: this.getRoadColor(feature.properties.type),
                weight: feature.properties.width || 3
            })
        }).addTo(this.roadLayer);
    }

    displayZones(geoJson) {
        // Clear existing zone layers
        this.zoneLayer.clearLayers();

        L.geoJSON(geoJson, {
            style: (feature) => ({
                color: feature.properties.color || '#fd7e14',
                fillColor: feature.properties.color || '#fd7e14',
                fillOpacity: 0.3,
                weight: 2
            })
        }).addTo(this.zoneLayer);
    }

    getBuildingIcon(category) {
        const icons = {
            library: L.icon({iconUrl: 'assets/icons/library.png', iconSize: [32, 32]}),
            admin: L.icon({iconUrl: 'assets/icons/admin.png', iconSize: [32, 32]}),
            classroom: L.icon({iconUrl: 'assets/icons/classroom.png', iconSize: [32, 32]}),
            lab: L.icon({iconUrl: 'assets/icons/lab.png', iconSize: [32, 32]}),
            cafe: L.icon({iconUrl: 'assets/icons/cafe.png', iconSize: [32, 32]}),
            default: L.icon({iconUrl: 'assets/icons/default.png', iconSize: [32, 32]})
        };
        
        return icons[category] || icons.default;
    }

    getRoadColor(type) {
        const colors = {
            pedestrian: '#198754',
            vehicle: '#dc3545',
            service: '#6c757d',
            bike: '#fd7e14',
            emergency: '#dc3545'
        };
        
        return colors[type] || '#198754';
    }

    createBuildingPopup(feature) {
        return `
            <div class="building-popup">
                <h5>${feature.properties.name}</h5>
                <p><strong>Code:</strong> ${feature.properties.code || 'N/A'}</p>
                <p><strong>Department:</strong> ${feature.properties.department || 'N/A'}</p>
                <p><strong>Category:</strong> ${feature.properties.category}</p>
                <p><strong>Description:</strong> ${feature.properties.description || 'N/A'}</p>
                <div class="d-grid gap-2">
                    <button class="btn btn-sm btn-primary edit-building" data-id="${feature.properties.id}">
                        <i class="ri-edit-line"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger delete-building" data-id="${feature.properties.id}">
                        <i class="ri-delete-bin-line"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    handleBuildingClick(feature) {
        // Handle building click events
        console.log('Building clicked:', feature);
    }

    setupLayerControls() {
        const layerControl = document.createElement('div');
        layerControl.className = 'layer-control';
        layerControl.innerHTML = `
            <h6>Layer Controls</h6>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="showBuildings" checked>
                <label class="form-check-label" for="showBuildings">Buildings</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="showRoads" checked>
                <label class="form-check-label" for="showRoads">Roads</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="showZones" checked>
                <label class="form-check-label" for="showZones">Zones</label>
            </div>
        `;
        
        document.getElementById('map').appendChild(layerControl);

        // Add event listeners
        document.getElementById('showBuildings').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.map.addLayer(this.buildingLayer);
            } else {
                this.map.removeLayer(this.buildingLayer);
            }
        });

        document.getElementById('showRoads').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.map.addLayer(this.roadLayer);
            } else {
                this.map.removeLayer(this.roadLayer);
            }
        });

        document.getElementById('showZones').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.map.addLayer(this.zoneLayer);
            } else {
                this.map.removeLayer(this.zoneLayer);
            }
        });
    }

    setupFeatureStats() {
        const statsDiv = document.createElement('div');
        statsDiv.className = 'feature-stats';
        statsDiv.innerHTML = `
            <h6>Feature Statistics</h6>
            <div class="stat-item">
                <span>Buildings:</span>
                <span class="stat-value" id="buildingCount">0</span>
            </div>
            <div class="stat-item">
                <span>Roads:</span>
                <span class="stat-value" id="roadCount">0</span>
            </div>
            <div class="stat-item">
                <span>Zones:</span>
                <span class="stat-value" id="zoneCount">0</span>
            </div>
        `;
        
        document.getElementById('map').appendChild(statsDiv);
        this.updateFeatureStats();
    }

    updateFeatureStats() {
        document.getElementById('buildingCount').textContent = this.buildingLayer.getLayers().length;
        document.getElementById('roadCount').textContent = this.roadLayer.getLayers().length;
        document.getElementById('zoneCount').textContent = this.zoneLayer.getLayers().length;
    }

    performSearch() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) return;

        const results = [];
        
        // Search in buildings
        this.buildingLayer.eachLayer(layer => {
            if (layer.feature && layer.feature.properties) {
                const props = layer.feature.properties;
                if (props.name && props.name.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        type: 'building',
                        name: props.name,
                        layer: layer
                    });
                }
            }
        });

        // Search in roads
        this.roadLayer.eachLayer(layer => {
            if (layer.feature && layer.feature.properties) {
                const props = layer.feature.properties;
                if (props.name && props.name.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        type: 'road',
                        name: props.name,
                        layer: layer
                    });
                }
            }
        });

        // Search in zones
        this.zoneLayer.eachLayer(layer => {
            if (layer.feature && layer.feature.properties) {
                const props = layer.feature.properties;
                if (props.name && props.name.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        type: 'zone',
                        name: props.name,
                        layer: layer
                    });
                }
            }
        });

        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const resultsDiv = document.getElementById('searchResults');
        
        if (results.length === 0) {
            resultsDiv.innerHTML = '<p class="text-muted">No results found</p>';
            return;
        }

        let html = '';
        results.forEach(result => {
            html += `
                <a href="#" class="search-result" data-type="${result.type}" data-name="${result.name}">
                    <i class="ri-${this.getFeatureIcon(result.type)}-line"></i>
                    <span class="feature-type-badge ${result.type}">${result.type}</span>
                    ${result.name}
                </a>
            `;
        });

        resultsDiv.innerHTML = html;

        // Add click handlers
        resultsDiv.querySelectorAll('.search-result').forEach(result => {
            result.addEventListener('click', (e) => {
                e.preventDefault();
                this.zoomToFeature(result.dataset.name, result.dataset.type);
            });
        });
    }

    getFeatureIcon(type) {
        const icons = {
            building: 'building',
            road: 'road-map',
            zone: 'map-pin'
        };
        return icons[type] || 'map-pin';
    }

    zoomToFeature(name, type) {
        let targetLayer = null;
        
        // Find the layer
        switch (type) {
            case 'building':
                this.buildingLayer.eachLayer(layer => {
                    if (layer.feature && layer.feature.properties.name === name) {
                        targetLayer = layer;
                    }
                });
                break;
            case 'road':
                this.roadLayer.eachLayer(layer => {
                    if (layer.feature && layer.feature.properties.name === name) {
                        targetLayer = layer;
                    }
                });
                break;
            case 'zone':
                this.zoneLayer.eachLayer(layer => {
                    if (layer.feature && layer.feature.properties.name === name) {
                        targetLayer = layer;
                    }
                });
                break;
        }

        if (targetLayer) {
            this.map.fitBounds(targetLayer.getBounds());
            targetLayer.openPopup();
        }
    }

    isPointInCampus(latlng) {
        if (!this.campusBoundary) return true;
        
        // Simple point-in-polygon check
        const point = [latlng.lng, latlng.lat];
        const polygon = this.campusBoundary.getLayers()[0].toGeoJSON().geometry.coordinates[0];
        
        return this.pointInPolygon(point, polygon);
    }

    pointInPolygon(point, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            if (((polygon[i][1] > point[1]) !== (polygon[j][1] > point[1])) &&
                (point[0] < (polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0])) {
                inside = !inside;
            }
        }
        return inside;
    }

    showDrawingInstructions(message) {
        let instructions = document.querySelector('.drawing-instructions');
        if (!instructions) {
            instructions = document.createElement('div');
            instructions.className = 'drawing-instructions';
            document.getElementById('map').appendChild(instructions);
        }
        
        instructions.textContent = message;
        instructions.classList.remove('hidden');
    }

    hideDrawingInstructions() {
        const instructions = document.querySelector('.drawing-instructions');
        if (instructions) {
            instructions.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('successToast');
        const toastBody = document.getElementById('toastMessage');
        
        // Update toast content
        toastBody.textContent = message;
        
        // Update toast styling based on type
        const toastHeader = toast.querySelector('.toast-header');
        const icon = toastHeader.querySelector('i');
        
        switch (type) {
            case 'success':
                icon.className = 'ri-check-line text-success me-2';
                break;
            case 'error':
                icon.className = 'ri-error-warning-line text-danger me-2';
                break;
            case 'warning':
                icon.className = 'ri-alert-line text-warning me-2';
                break;
            default:
                icon.className = 'ri-information-line text-info me-2';
        }
        
        // Show toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    enableFeatureInteractions() {
        // Enable popup interactions for all features
        this.buildingLayer.eachLayer(layer => {
            layer.on('click', () => layer.openPopup());
        });
        
        this.roadLayer.eachLayer(layer => {
            layer.on('click', () => layer.openPopup());
        });
        
        this.zoneLayer.eachLayer(layer => {
            layer.on('click', () => layer.openPopup());
        });
    }

    addLayerControl(name, layer, checked = false) {
        // This method can be used to add custom layer controls
        console.log(`Added layer control for: ${name}`);
    }
}

// Initialize the map editor when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.campusMapEditor = new CampusMapEditor();
});