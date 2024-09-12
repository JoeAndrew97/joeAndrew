// App.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import NavbarComponent from './components/Navbar';
import MapComponent from './components/Map';
import Preloader from './components/Preloader';
import axios from 'axios';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);

  // On mount: Fetch country name, lat/lng & ISO then sort alphabetically
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          'http://localhost/project1/backend/php/country-data.php'
        );

        let extractedCountries = response.data
          .map((country) => ({
            name: country.name.common,
            latitude: country.latlng[0],
            longitude: country.latlng[1],
            isoCode: country.cca3,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        // Set state of countries to be used in the dropdown menu
        setCountries(extractedCountries);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchCountries();
  }, []);

  // For loading spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Logic to handle map centering below:
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  const [mapCenter, setMapCenter] = useState(null);

  // Initially set map center to user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            error: error.message,
          });
          // setMapCenter([48.8566, 2.3522]); // Fallback to Paris
        }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by this browser.',
      });
      setMapCenter([48.8566, 2.3522]);
    }
  }, []);

  // Change map centure when a country is selected
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

      <NavbarComponent
        countries={countries}
        handleCountrySelect={handleCountrySelect}
      />

      <div className="App">
        {loading ? (
          <Preloader />
        ) : (
          <div className="content">
            {mapCenter && (
              <MapComponent mapCenter={mapCenter} location={location} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default App;
