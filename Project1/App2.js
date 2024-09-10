// App.js
// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet-easybutton';
// import $ from 'jquery';
// import 'bootstrap/dist/js/bootstrap.bundle.min';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('AF');

  // Fetch country data via AJAX
  useEffect(() => {
    // Simulate an AJAX call to fetch country data
    // Replace with actual AJAX call to fetch countries
    setCountries([{ code: 'AF', name: 'Afghanistan' }]); // example data
  }, []);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div>
      {/* Country Select Dropdown */}
      <div id="selectContainer">
        <select
          id="countrySelect"
          className="form-select shadow-sm"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Map */}
      <div id="map">
        <Map />
      </div>

      {/* Example Modal */}
      <Modal />
    </div>
  );
};

const Modal = () => {
  return (
    <div
      id="exampleModal"
      className="modal"
      data-bs-backdrop="false"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content shadow">
          <div className="modal-header bg-success bg-gradient text-white">
            <h5 className="modal-title">Overview</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <Table />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-success btn-sm"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Table = () => {
  const rows = [
    { icon: 'fa-street-view', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-heart', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-car', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-book', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-bath', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-bell', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-anchor', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-money-bill', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-wifi', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-globe', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-bicycle', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-landmark', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-tree', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-bookmark', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-bell', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-fire', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-key', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-newspaper', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-rocket', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-wheelchair', attribute: 'Attribute', value: 'value' },
    { icon: 'fa-monument', attribute: 'Attribute', value: 'value' },
  ];

  return (
    <table className="table table-striped">
      {rows.map((row, index) => (
        <tr key={index}>
          <td className="text-center">
            <i className={`fa-solid ${row.icon} fa-xl text-success`}></i>
          </td>
          <td>{row.attribute}</td>
          <td className="text-end">{row.value}</td>
        </tr>
      ))}
    </table>
  );
};

const Map = () => {
  useEffect(() => {
    const streets = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
      }
    );

    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      }
    );

    const basemaps = {
      Streets: streets,
      Satellite: satellite,
    };

    const map = L.map('map', {
      layers: [streets],
      center: [54.5, -4],
      zoom: 6,
    });

    L.control.layers(basemaps).addTo(map);

    L.easyButton('fa-info fa-xl', function () {
      $('#exampleModal').modal('show');
    }).addTo(map);
  }, []);

  return <div id="map" style={{ height: '500px' }}></div>;
};

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import L from 'leaflet';
import { Icon } from 'leaflet';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'leaflet/dist/leaflet.css';

const App = () => {
  // Simulated data from an API
  const markers = [
    {
      geocode: [48.86, 2.3522],
      popUp: 'Hello, I am pop up 1',
    },
    {
      geocode: [48.85, 2.3522],
      popUp: 'Hello, I am pop up 2',
    },
    {
      geocode: [48.855, 2.34],
      popUp: 'Hello, I am pop up 3',
    },
  ];

  const countries = [
    { code: 'AF', name: 'Afghanistan' },
    { code: 'GB', name: 'Great Britain' },
    { code: 'AT', name: 'Austria' },
  ];

  // Define a custom marker
  const customIcon = new Icon({
    iconUrl: require('./resources/location-pin.png'),
    iconSize: [38, 38],
  });

  // State to store the user's location
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            error: error.message,
          });
        }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by this browser.',
      });
    }
  }, []);

  // Fallback coordinates (Paris) in case geolocation isn't available yet
  const defaultPosition = [0, 20];

  // Use either the user's location or the default position
  const mapCenter =
    location.latitude && location.longitude
      ? [location.latitude, location.longitude]
      : defaultPosition;

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
                  <NavDropdown.Item key={country.code}>
                    {country.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        {/* Conditionally rendering the map only if the location is available */}
        <MapContainer
          className="map-container"
          center={mapCenter}
          zoom={location.latitude && location.longitude ? 13 : 6} // Adjust zoom based on location
        >
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            maxZoom={17}
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          />

          {/* Add a marker for the user's location if available */}
          {location.latitude && location.longitude && (
            <Marker
              position={[location.latitude, location.longitude]}
              icon={customIcon}
            >
              <Popup>Your current location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </>
  );
};

// Map container currently set to center on Paris, will need changing
// Current marker popups are placeholders
// Marker cluster can be used to join clusters together
// Icon needs updating
// Load icon needed

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

      <div>
        {/* Render the map only when mapCenter is available */}
        {mapCenter && (
          <MapContainer className="map-container" center={mapCenter} zoom={6}>
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
      <div className="App">
        {loading ? (
          <Preloader /> // Show preloader while loading is true
        ) : (
          <div className="content">
            <h1>App Content Loaded</h1>
            {/* Your application content goes here */}
          </div>
        )}
      </div>
    </>
  );
};
