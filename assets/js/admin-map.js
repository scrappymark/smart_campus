document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    const map = L.map('map').setView([10.355, 124.965], 18);
    
    // Add tile layer
    L.tileLayer('https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=9VmFEZD7hpK4pJWwhECc', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>',
        maxZoom: 20
    }).addTo(map);

    // Load campus boundary
    let campusLayer;
    fetch(geoJsonUrl)
        .then(res => res.json())
        .then(data => {
            campusLayer = L.geoJSON(data, {
                style: {
                    color: '#0066ff',
                    fillOpacity: 0.1,
                    weight: 3
                }
            }).addTo(map);
            
            map.setMaxBounds(campusLayer.getBounds());
        });

    let currentMarker = null;

    // Add building handler
    map.on('click', e => {
        // Prevent adding markers outside campus
        if (campusLayer && !campusLayer.getBounds().contains(e.latlng)) {
            alert("Please place buildings inside the campus boundary");
            return;
        }
        
        if (currentMarker) map.removeLayer(currentMarker);
        
        currentMarker = L.marker(e.latlng, {
            draggable: true,
            icon: L.divIcon({
                className: 'new-marker', 
                html: '📍',
                iconSize: [32, 32]
            })
        }).addTo(map);
        
        // Show modal
        fetch('partials/building_form.html')
            .then(res => res.text())
            .then(html => {
                document.getElementById('buildingModal').innerHTML = `
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Add Building</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">${html}</div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" id="saveBuilding">Save</button>
                            </div>
                        </div>
                    </div>`;
                
                const modalElement = document.getElementById('buildingModal');
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                // Save building
                document.getElementById('saveBuilding').addEventListener('click', () => {
                    const name = document.getElementById('buildingName').value;
                    const category = document.getElementById('buildingCategory').value;
                    const icon = document.getElementById('buildingIcon').value;
                    
                    const data = {
                        name: name,
                        category: category,
                        icon: icon,
                        lat: currentMarker.getLatLng().lat,
                        lng: currentMarker.getLatLng().lng
                    };
                    
                    fetch('/api/add_building.php', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(data)
                    })
                    .then(res => res.json())
                    .then(result => {
                        if(result.success) {
                            loadBuildings();
                            modal.hide();
                            currentMarker = null;
                            
                            // Show success notification
                            const toast = new bootstrap.Toast(document.getElementById('successToast'));
                            toast.show();
                        }
                    });
                });
                
                // Handle modal close
                modalElement.addEventListener('hidden.bs.modal', function () {
                    if (currentMarker) {
                        map.removeLayer(currentMarker);
                        currentMarker = null;
                    }
                });
            });
    });

    // Load existing buildings
    function loadBuildings() {
        fetch('/api/get_buildings.php')
            .then(res => res.json())
            .then(geoJson => {
                // Clear existing building markers
                map.eachLayer(layer => {
                    if (layer instanceof L.Marker && layer !== currentMarker) {
                        map.removeLayer(layer);
                    }
                });
                
                // Add buildings to map
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
                                    <button class="btn btn-sm btn-danger delete-building" 
                                            data-id="${feature.properties.id}">
                                        Delete Building
                                    </button>
                                </div>
                            `)
                            .on('popupopen', function(e) {
                                // Add delete functionality
                                document.querySelector('.delete-building').addEventListener('click', function() {
                                    const id = this.getAttribute('data-id');
                                    fetch(`/api/delete_building.php?id=${id}`)
                                        .then(res => res.json())
                                        .then(result => {
                                            if(result.success) {
                                                map.removeLayer(e.target);
                                                loadBuildings();
                                            }
                                        });
                                });
                            });
                    }
                }).addTo(map);
            });
    }

    loadBuildings();
});