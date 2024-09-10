import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import L from 'leaflet';
import { Icon } from 'leaflet';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'leaflet/dist/leaflet.css';
import Preloader from './components/Preloader';

// Custom component to update the map's center

const ChangeMapView = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom()); // Update the map view with the new center
  return null;
};

const App = () => {
  // Preloader logic
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after content is ready
    }, 2000); // You can replace this with actual API call or HTML content loading logic

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);
  // placeholders for API responses
  const countries = [
    { code: 'AF', name: 'Afghanistan', lat: 33.93911, lon: 67.709953 },
    { code: 'GB', name: 'Great Britain', lat: 51.5074, lon: -0.1278 },
    { code: 'AT', name: 'Austria', lat: 47.5162, lon: 14.5501 },
  ];

  // Define custom marker icons
  const customIcon = new Icon({
    iconUrl: require('./resources/location-pin.png'),
    iconSize: [38, 38],
  });

  const userIcon = new Icon({
    iconUrl: require('./resources/location.png'),
    iconSize: [30, 30],
  });

  // State to store the user's location
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  // State to store the map center (default to null initially)
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    // Get the user's current location asynchronously
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
          setMapCenter([position.coords.latitude, position.coords.longitude]); // Set the map center to the user's location
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            error: error.message,
          });
          setMapCenter([48.8566, 2.3522]); // Fallback to Paris if geolocation fails
        }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by this browser.',
      });
      setMapCenter([48.8566, 2.3522]); // Fallback to Paris if geolocation is not supported
    }
  }, []);

  // Function to update map center when a country is clicked
  const handleCountrySelect = (lat, lon) => {
    setMapCenter([lat, lon]);
  };

  return (
    <>
      <Helmet>
        <title>Geo Factfile</title>
        <link
          rel="icon"
          href={require('./resources/globe.png')}
          type="image/png"
        />
      </Helmet>

      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Geo Factfile</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Select Country" id="basic-nav-dropdown">
                {countries.map((country) => (
                  <NavDropdown.Item
                    key={country.code}
                    onClick={() =>
                      handleCountrySelect(country.lat, country.lon)
                    } // Set the map center when clicked
                  >
                    {country.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="App">
        {loading ? (
          <Preloader /> // Show preloader while loading is true
        ) : (
          <div className="content">
            <div>
              {/* Render the map only when mapCenter is available */}
              {mapCenter && (
                <MapContainer
                  className="map-container"
                  center={mapCenter}
                  zoom={6}
                >
                  {/* Dynamically update the map view when the mapCenter changes */}
                  <ChangeMapView center={mapCenter} />

                  <TileLayer
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                    maxZoom={17}
                    attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>) | <a href="https://www.flaticon.com/free-icons/my-location" title="my location icons">My location icons created by Creative Stall Premium - Flaticon</a>'
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
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;

// Current marker popups are placeholders
// Marker cluster can be used to join clusters together
// Navbar and map logic separated into their own components?

// Map container currently set to center on Paris on deault, will need changing
// Current marker popups are placeholders
// Marker cluster can be used to join clusters together
// Icon needs updating
// Load icon needed
// Seems to be possible to exceed max zoom of 17

// Next steps:
// Version control
// Configure event handlers so a country object is populated with data when a country is selected
// Begin inital API calls and box to be rendered
