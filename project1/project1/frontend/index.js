var map;
var countriesData; // Will be assigned the full return value of RESTcountries API call
var currentMarker; // Stores map marker location for selected country
var selectedCountry; // Variable to store the RESTcountries data for the selected country
var countryNameIso;

// tile layers
var streets = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  {
    attribution:
      'Tiles &copy; Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
  }
);
var satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution:
      'Tiles &copy; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  }
);
var basemaps = {
  Streets: streets,
  Satellite: satellite,
};

$(document).ready(function () {
  // ---- BUTTONS ----

  // Infobutton populates modal box with RESTcountries data
  var infoBtn = L.easyButton('fa-info fa-xl', function (btn, map) {
    if (selectedCountry) {
      populateInfoModal(selectedCountry);
      $('#exampleModal').modal('show');
    } else {
      alert('Please select a country first.');
    }
  });

  // ---- MAP ----

  // Initialise map with default settings
  map = L.map('map', {
    layers: [streets],
  }).setView([54.5, -4], 6);

  // Add layer control to switch between Streets and Satellite views
  L.control.layers(basemaps).addTo(map);
  infoBtn.addTo(map);

  // ---- LOCATE USER ----

  // Custom icon for the user's marker
  var userIcon = L.icon({
    iconUrl: './resources/location.png', // Replace with the path to your custom icon image
    iconSize: [38, 38], // Size of the icon [width, height]
    iconAnchor: [19, 38], // Anchor point of the icon, [center x, bottom y]
    popupAnchor: [0, -38], // Point from which the popup should open relative to the iconAnchor
  });
  // Handle User Location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var userLat = position.coords.latitude;
        var userLng = position.coords.longitude;
        // Recenter the map on the user's location
        map.setView([userLat, userLng], 13);

        // Place a marker at the user's location with the custom icon
        L.marker([userLat, userLng], { icon: userIcon })
          .addTo(map)
          .bindPopup('You are here!')
          .openPopup();

        // Hide the spinner after the location has been found
        $('#loadingSpinner').fadeOut('slow');
      },
      function (error) {
        console.error('Geolocation error: ' + error.message);
        $('#loadingSpinner').fadeOut('slow');
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
    $('#loadingSpinner').fadeOut('slow');
  }

  // ---- FETCH DATA ----

  // Populate dropdown menu from countryBorders.geo.json, returns name and ISO code
  $.getJSON('../backend/php/name-iso.php', function (data) {
    countryNameIso = data;
    countryNameIso.sort((a, b) => a.name.localeCompare(b.name));

    const $select = $('#countrySelect');

    // Remove the 'Loading Countries...' option from dropdown
    $('#countryList').remove();

    $.each(countryNameIso, function (index, country) {
      const countryName = country.name;
      const countryCode = country.iso_a3;

      const $option = $('<option></option>').val(countryCode).text(countryName);
      $select.append($option);
    });
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.error('Error fetching country data: ', textStatus, errorThrown);
  });

  // Call RESTcountries API, assign full return value to countriesData
  $.getJSON('../backend/php/country-data.php', function (countries) {
    countriesData = countries;
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.error('Error fetching countries:', errorThrown);
  });

  // ---- EVENT LISTENERS ----

  // When a country is selected from the dropdown menu, update selectedCountry then adjust map & markers :
  $('#countrySelect').on('change', function () {
    const selectedCode = $(this).val();
    // Find the country in the countriesData array where the ISO code matches the selected value
    selectedCountry = countriesData.find(function (country) {
      return country.cca3 === selectedCode; // Match the country by ISO code  -- CHANGED
    });

    // Center the map on the selected country's coordinates
    if (selectedCountry) {
      const latlng = selectedCountry.latlng;
      map.setView(latlng, 6);
      if (currentMarker) {
        map.removeLayer(currentMarker);
      }

      // Add a marker at the selected country's position
      currentMarker = L.marker(latlng).addTo(map);
    }
  });

  // ---- HELPER FUNCTIONS ----

  // Populate table with data from selectedCountry when info box is clicked:
  function populateInfoModal(country) {
    // Select element and clear previous data
    const $tableBody = $('#exampleModal .table tbody');
    $tableBody.empty();

    // Add rows to the table with the selected country's information
    const rows = `
      <tr>
        <td>Country Name</td>
        <td>${country.name.common}</td>
      </tr>
      <tr>
        <td>Capital</td>
        <td>${country.capital ? country.capital.join(', ') : 'N/A'}</td>
      </tr>
      <tr>
        <td>Region</td>
        <td>${country.region}</td>
      </tr>
      <tr>
        <td>Population</td>
        <td>${country.population.toLocaleString()}</td>
      </tr>
      <tr>
        <td>Area</td>
        <td>${country.area.toLocaleString()} km²</td>
      </tr>
    `;

    $tableBody.append(rows); // Append the rows to the table body
  }
});
