# Interactive Campus Map Editor

A comprehensive admin tool for managing campus layout with buildings, roads, and zones.

## 🎯 Features

### ✅ Core Features

#### **Buildings Management**
- **Add/Edit/Delete Buildings**: Use markers to define building locations
- **Rich Metadata**: Building name, code, department, category, description
- **Categories**: Library, Administration, Classroom, Laboratory, Cafeteria, Gymnasium, Parking, Other
- **Validation**: Ensures buildings are placed within campus boundary

#### **Roads and Paths Management**
- **Add/Edit/Delete Roads**: Use polylines to map roads and walkways
- **Road Classification**: Pedestrian, Vehicle, Service Access, Bike Path, Emergency Access
- **Width Control**: Configurable road width (1-20 meters)
- **Visual Styling**: Color-coded by road type

#### **Zones Management**
- **Add/Edit/Delete Zones**: Use polygons to define areas
- **Zone Types**: Parking Area, Garden, Playground, Emergency Point, Restricted Area, Recreation Area
- **Custom Colors**: Color picker for zone styling
- **Area Definition**: Support for polygons, circles, and rectangles

### 🗺️ Map Configuration

#### **Map Tiles**
- **Provider**: MapTiler Outdoor Style
- **URL**: `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png`
- **Attribution**: Proper copyright attribution included

#### **Campus Boundary**
- **Source**: `assets/data/campus-boundary.geojson`
- **Display**: Blue outline with light fill
- **Restriction**: Prevents panning/zooming outside campus area
- **Validation**: Ensures all features are placed within boundary

### ⚙️ Technical Stack

#### **Frontend**
- **Leaflet.js**: Map display and interaction
- **Leaflet.draw**: Shape editing (buildings, roads, zones)
- **Bootstrap 5**: Modern UI design and components
- **Remix Icons**: Beautiful icon set

#### **Backend**
- **PHP**: Server-side processing
- **MySQL**: Spatial data storage
- **GeoJSON**: Standard format for spatial data

### 📊 Advanced Features

#### **Interactive Modes**
- **Building Mode**: Add markers for buildings
- **Road Mode**: Draw polylines for roads/paths
- **Zone Mode**: Create polygons for areas
- **View Mode**: Browse and interact with features

#### **Layer Controls**
- **Toggle Visibility**: Show/hide buildings, roads, zones
- **Feature Statistics**: Real-time count of features
- **Campus Boundary**: Always visible reference

#### **Search Functionality**
- **Global Search**: Search across all feature types
- **Quick Navigation**: Click results to zoom to features
- **Visual Indicators**: Color-coded search results

#### **User Experience**
- **Toast Notifications**: Success, error, warning messages
- **Drawing Instructions**: Context-sensitive help
- **Responsive Design**: Works on desktop and mobile
- **Modal Forms**: Clean data entry interface

## 🚀 Installation & Setup

### 1. Database Setup
```sql
-- Run the migration.sql file to create required tables
mysql -u root -p < migration.sql
```

### 2. File Structure
```
├── public/admin/map-editor.php    # Main editor interface
├── assets/css/map-editor.css      # Custom styles
├── assets/js/map-editor.js        # Core functionality
├── assets/data/campus-boundary.geojson  # Campus boundary
├── api/
│   ├── add_building.php           # Building API
│   ├── get_buildings.php          # Building retrieval
│   ├── delete_building.php        # Building deletion
│   ├── add_road.php               # Road API
│   ├── get_roads.php              # Road retrieval
│   ├── delete_road.php            # Road deletion
│   ├── add_zone.php               # Zone API
│   ├── get_zones.php              # Zone retrieval
│   └── delete_zone.php            # Zone deletion
```

### 3. Configuration
- Update MapTiler API key in `map-editor.js`
- Ensure campus boundary GeoJSON is properly formatted
- Set up database connection in `config.php`

## 📖 Usage Guide

### Adding a Building
1. Click "Buildings" mode button
2. Click on map to place marker
3. Fill in building details in modal
4. Click "Save Building"

### Adding a Road
1. Click "Roads" mode button
2. Use drawing toolbar to create polyline
3. Fill in road details in modal
4. Click "Save Road"

### Adding a Zone
1. Click "Zones" mode button
2. Use drawing toolbar to create polygon
3. Fill in zone details in modal
4. Click "Save Zone"

### Searching Features
1. Click search icon or press Ctrl+F
2. Type feature name
3. Click result to navigate to feature

## 🔧 API Endpoints

### Buildings
- `POST /api/add_building.php` - Add new building
- `GET /api/get_buildings.php` - Get all buildings (GeoJSON)
- `DELETE /api/delete_building.php?id=X` - Delete building

### Roads
- `POST /api/add_road.php` - Add new road
- `GET /api/get_roads.php` - Get all roads (GeoJSON)
- `DELETE /api/delete_road.php?id=X` - Delete road

### Zones
- `POST /api/add_zone.php` - Add new zone
- `GET /api/get_zones.php` - Get all zones (GeoJSON)
- `DELETE /api/delete_zone.php?id=X` - Delete zone

## 🎨 Customization

### Styling
- Modify `assets/css/map-editor.css` for custom styles
- Update color schemes in JavaScript
- Customize modal layouts

### Icons
- Add building icons to `assets/icons/buildings/`
- Update icon mapping in JavaScript
- Support for custom marker icons

### Categories
- Extend building categories in modal
- Add road types in JavaScript
- Create new zone types

## 🔒 Security Considerations

- Input validation on all forms
- SQL injection prevention with prepared statements
- XSS protection with proper escaping
- CSRF token validation
- Role-based access control

## 📱 Mobile Support

- Responsive design for mobile devices
- Touch-friendly interface
- Optimized for tablet use
- Mobile-specific drawing controls

## 🚀 Future Enhancements

### Planned Features
- **Import/Export**: GeoJSON import/export functionality
- **User Roles**: Viewer, Editor, Admin permissions
- **ApexCharts Integration**: Feature statistics visualization
- **Advanced Search**: Filter by type, date, location
- **Bulk Operations**: Multi-select and batch operations
- **Version History**: Track changes over time
- **Collaboration**: Real-time editing with multiple users

### Technical Improvements
- **Performance**: Optimize for large datasets
- **Caching**: Implement Redis caching
- **API Rate Limiting**: Prevent abuse
- **WebSocket**: Real-time updates
- **Offline Support**: PWA capabilities

## 🐛 Troubleshooting

### Common Issues
1. **Map not loading**: Check MapTiler API key
2. **Features not saving**: Verify database connection
3. **Drawing not working**: Ensure Leaflet.draw is loaded
4. **Boundary issues**: Validate GeoJSON format

### Debug Mode
Enable browser console for detailed error messages and debugging information.

## 📄 License

This project is part of the Campus Navigation System and follows the same licensing terms.

---

**Built with ❤️ for better campus management**