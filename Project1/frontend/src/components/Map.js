// Map.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom component to update the map's center
const ChangeMapView = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom()); // Dynamically update the map view when center changes
  return null;
};

const MapComponent = ({ mapCenter, location }) => {
  // Define custom marker icons
  const customIcon = new Icon({
    iconUrl: require('../resources/location-pin.png'),
    iconSize: [38, 38],
  });

  const userIcon = new Icon({
    iconUrl: require('../resources/location.png'),
    iconSize: [30, 30],
  });

  return (
    <MapContainer className="map-container" center={mapCenter} zoom={6}>
      {/* Add ChangeMapView component to listen to mapCenter changes */}
      <ChangeMapView center={mapCenter} />

      <TileLayer
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        maxZoom={17}
        attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      />

      {/* Add a marker for the selected country's location */}
      <Marker position={mapCenter} icon={customIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Add a marker for the user's location if available */}
      {location.latitude && location.longitude && (
        <Marker
          position={[location.latitude, location.longitude]}
          icon={userIcon}
        >
          <Popup>Your current location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
