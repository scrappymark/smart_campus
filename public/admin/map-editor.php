<?php
require_once __DIR__ . '/../../config.php';

$title = 'Campus Map Editor';
$subTitle = 'Management';
?>
<?php include partial('layouts.top') ?>

<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Interactive Campus Map Editor</h5>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary" id="buildingMode">
                        <i class="ri-building-line"></i> Buildings
                    </button>
                    <button type="button" class="btn btn-outline-success" id="roadMode">
                        <i class="ri-road-map-line"></i> Roads
                    </button>
                    <button type="button" class="btn btn-outline-warning" id="zoneMode">
                        <i class="ri-map-pin-line"></i> Zones
                    </button>
                    <button type="button" class="btn btn-outline-info" id="viewMode">
                        <i class="ri-eye-line"></i> View
                    </button>
                </div>
            </div>
            <div class="card-body p-0">
                <div id="map" style="height: 600px; width: 100%;"></div>
            </div>
        </div>
    </div>
</div>

<!-- Building Modal -->
<div class="modal fade" id="buildingModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Building</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="buildingForm">
                    <div class="mb-3">
                        <label for="buildingName" class="form-label">Building Name</label>
                        <input type="text" class="form-control" id="buildingName" required>
                    </div>
                    <div class="mb-3">
                        <label for="buildingCode" class="form-label">Building Code</label>
                        <input type="text" class="form-control" id="buildingCode">
                    </div>
                    <div class="mb-3">
                        <label for="buildingDepartment" class="form-label">Department</label>
                        <input type="text" class="form-control" id="buildingDepartment">
                    </div>
                    <div class="mb-3">
                        <label for="buildingCategory" class="form-label">Category</label>
                        <select class="form-select" id="buildingCategory" required>
                            <option value="">Select Category</option>
                            <option value="library">Library</option>
                            <option value="admin">Administration</option>
                            <option value="classroom">Classroom</option>
                            <option value="lab">Laboratory</option>
                            <option value="cafe">Cafeteria</option>
                            <option value="gym">Gymnasium</option>
                            <option value="parking">Parking</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="buildingDescription" class="form-label">Description</label>
                        <textarea class="form-control" id="buildingDescription" rows="3"></textarea>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="buildingLat" class="form-label">Latitude</label>
                            <input type="number" class="form-control" id="buildingLat" step="any" readonly>
                        </div>
                        <div class="col-6">
                            <label for="buildingLng" class="form-label">Longitude</label>
                            <input type="number" class="form-control" id="buildingLng" step="any" readonly>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="saveBuilding">Save Building</button>
            </div>
        </div>
    </div>
</div>

<!-- Road Modal -->
<div class="modal fade" id="roadModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Road/Path</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="roadForm">
                    <div class="mb-3">
                        <label for="roadName" class="form-label">Road/Path Name</label>
                        <input type="text" class="form-control" id="roadName" required>
                    </div>
                    <div class="mb-3">
                        <label for="roadType" class="form-label">Type</label>
                        <select class="form-select" id="roadType" required>
                            <option value="">Select Type</option>
                            <option value="pedestrian">Pedestrian Path</option>
                            <option value="vehicle">Vehicle Road</option>
                            <option value="service">Service Access</option>
                            <option value="bike">Bike Path</option>
                            <option value="emergency">Emergency Access</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="roadWidth" class="form-label">Width (meters)</label>
                        <input type="number" class="form-control" id="roadWidth" min="1" max="20" value="3">
                    </div>
                    <div class="mb-3">
                        <label for="roadDescription" class="form-label">Description</label>
                        <textarea class="form-control" id="roadDescription" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="saveRoad">Save Road</button>
            </div>
        </div>
    </div>
</div>

<!-- Zone Modal -->
<div class="modal fade" id="zoneModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Zone</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="zoneForm">
                    <div class="mb-3">
                        <label for="zoneName" class="form-label">Zone Name</label>
                        <input type="text" class="form-control" id="zoneName" required>
                    </div>
                    <div class="mb-3">
                        <label for="zoneType" class="form-label">Zone Type</label>
                        <select class="form-select" id="zoneType" required>
                            <option value="">Select Type</option>
                            <option value="parking">Parking Area</option>
                            <option value="garden">Garden</option>
                            <option value="playground">Playground</option>
                            <option value="emergency">Emergency Point</option>
                            <option value="restricted">Restricted Area</option>
                            <option value="recreation">Recreation Area</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="zoneColor" class="form-label">Zone Color</label>
                        <input type="color" class="form-control form-control-color" id="zoneColor" value="#ff6b6b">
                    </div>
                    <div class="mb-3">
                        <label for="zoneDescription" class="form-label">Description</label>
                        <textarea class="form-control" id="zoneDescription" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="saveZone">Save Zone</button>
            </div>
        </div>
    </div>
</div>

<!-- Search Modal -->
<div class="modal fade" id="searchModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Search Features</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" id="searchInput" placeholder="Search buildings, roads, or zones...">
                    <button class="btn btn-outline-secondary" type="button" id="searchBtn">
                        <i class="ri-search-line"></i>
                    </button>
                </div>
                <div id="searchResults"></div>
            </div>
        </div>
    </div>
</div>

<!-- Success Toast -->
<div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="successToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <i class="ri-check-line text-success me-2"></i>
            <strong class="me-auto">Success</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body" id="toastMessage">
            Feature saved successfully!
        </div>
    </div>
</div>

<?php 
$style = '
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css" />
<link rel="stylesheet" href="' . asset('css/map-editor.css') . '" />
'; 
?>

<?php 
$script = '
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js"></script>
<script src="' . asset('js/map-editor.js') . '"></script>
'; 
?>

<?php include partial('layouts.bottom') ?>