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
