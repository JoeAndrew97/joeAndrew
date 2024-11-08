// ----------------- GLOBAL VARIABLES ---------------------

var map;
var countriesData;
var currentMarker;
var selectedCountry;
var countryNameIso;
let countryBordersLayer = null;
var latN, latS, lngE, lngW;
var selectedCurrency = 'USD';
var localCurrency, currencyQuantity, localCurrencyName, currencySymbol;
let earthquakeMarkers = [];
var instructionsDisplayed = false;
var capitalLat, capitalLng;

// ----------------- MAP, LAYERS AND ICONS ---------------------

// City Icon
var cityIcon = L.divIcon({
  className: 'custom-city-icon',
  html: '<div class="city-marker"><i class="fa-solid fa-city"></i></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -10],
});

// Capital City Icon
var capitalIcon = L.divIcon({
  className: 'custom-capital-icon',
  html: '<div class="capital-marker"><i class="fa-solid fa-landmark"></i></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -10],
});

// National Park Icon
var nationalParkIcon = L.divIcon({
  className: 'custom-park-icon',
  html: '<div class="park-marker"><i class="fa-solid fa-tree"></i></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -10],
});

// Earthquake Icon
const earthquakeIcon = L.divIcon({
  className: 'custom-earthquake-icon',
  html: '<div class="earthquake-icon"><i class="fa-solid fa-house-crack"></i></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -10],
});

// Base Maps
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
var streetsEnhanced = L.tileLayer(
  'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  {
    attribution: '&copy; OpenStreetMap contributors, HOT',
    zoom: 5,
    maxZoom: 10,
  }
);

// Marker Cluster Groups
var citiesClusterGroup = L.markerClusterGroup();
var nationalParksClusterGroup = L.markerClusterGroup();

// Overlay Maps
var citiesLayer = L.layerGroup();
var nationalParksLayer = L.layerGroup();

// Initialize map and layer control
var overlaymaps = {
  'Major Cities': citiesClusterGroup,
  'National Parks': nationalParksClusterGroup,
};

var basemaps = {
  Streets: streets,
  Satellite: satellite,
  'Streets Enhanced': streetsEnhanced,
};

map = L.map('map', {
  layers: [streets],
}).setView([54.5, -4], 6);

var layerControl = L.control.layers(basemaps, overlaymaps).addTo(map);

// -------------------- Helper Functions -------------------

// Handles user messages
function showMessageModal(message) {
  $('#messageModalText').text(message);
  $('#messageModal').modal('show');
}

// Remove earthquake map markers, called when new country is selected or when quakeButton is pressed twice
function clearEarthquakeMarkers() {
  earthquakeMarkers.forEach((marker) => map.removeLayer(marker));
  earthquakeMarkers = [];
}

// For weather formatting
function getDayOfWeek(dateString) {
  const date = new Date(dateString);
  const options = { weekday: 'short' }; // Use 'short' to get abbreviated weekday names
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

// --------------------- DEFINE BUTTONS ---------------------

var attributionButton = L.control({ position: 'bottomright' });

attributionButton.onAdd = function (map) {
  var div = L.DomUtil.create(
    'div',
    'leaflet-bar leaflet-control leaflet-control-custom'
  );
  div.innerHTML =
    '<i class="fas fa-user-edit" style="font-size:18px; cursor: pointer;"></i>';
  div.style.backgroundColor = 'white';
  div.style.width = '34px';
  div.style.height = '34px';
  div.style.lineHeight = '34px';
  div.style.textAlign = 'center';

  $(div).on('click', function () {
    $('#attributionModal').modal('show');
  });

  return div;
};

// Info button, calls populateInfoButton() using data from selectedCountry
var infoBtn = L.easyButton('fa-circle-info fa-xl', function (btn, map) {
  if (selectedCountry) {
    populateInfoModal(selectedCountry);
    $('#infoModal').modal('show');
  } else {
    showMessageModal('Please select a country first.');
  }
});

// Wikipedia button, calls fetchWikipediaData()
var wikiBtn = L.easyButton('fa-book fa-lg', function (btn, map) {
  if (selectedCountry) {
    fetchWikipediaData(selectedCountry.name.common);
  } else {
    showMessageModal('Please select a country first.');
  }
});

// Flag button, calls fetchCountryFlag()
var flagBtn = L.easyButton('fa-flag fa-lg', function (btn, map) {
  if (selectedCountry) {
    fetchCountryFlag(selectedCountry.cca2);
  } else {
    showMessageModal('Please select a country first.');
  }
});

// Earthquake Button, calls fetchEarthquakeData()
var quakeBtn = L.easyButton('fa-house-crack fa-lg', function (btn, map) {
  if (instructionsDisplayed === false) {
    $('#earthquakeInstructionsModal').modal('show');
    instructionsDisplayed = true;
  }
  if (earthquakeMarkers.length > 0) {
    clearEarthquakeMarkers();
  } else if (selectedCountry) {
    fetchEarthquakeData();
  } else {
    showMessageModal('Please select a country first.');
  }
});

// Exchange Rate Button, opens currency modal and sends AJAX request to exchange-rates.php
var exchangeBtn = L.easyButton('fa-money-bill fa-lg', function (btn, map) {
  try {
    localCurrency = Object.keys(selectedCountry.currencies)[0];
    localCurrencyName = selectedCountry.currencies[localCurrency].name;
    currencySymbol = selectedCountry.currencies[localCurrency].symbol;

    function capitaliseWords(str) {
      return str
        .split(' ')
        .map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    }

    localCurrencyName = capitaliseWords(localCurrencyName);
    $('#currencyModalLabel').html(`${localCurrencyName} (${currencySymbol})`);

    // Fetch the exchange rate when the modal opens
    $.ajax({
      url: 'libs/php/routines/exchange-rates.php',
      method: 'POST',
      dataType: 'json',
      data: {
        localCurrency: localCurrency,
      },
      success: function (response) {
        if (response.status === 'success') {
          const conversionRate = response.rate;
          $('#currencyModal').modal('show');
          // Event listener to update conversion result automatically
          $('#usdAmount').on('input', function () {
            const usdAmount = parseFloat($(this).val());
            if (!isNaN(usdAmount)) {
              const convertedAmount = usdAmount * conversionRate;
              $('#conversionResult').html(`
                                ${usdAmount} USD 
                                <i class="fa-solid fa-arrow-right"></i> 
                                ${convertedAmount.toFixed(2)} ${localCurrency}
                            `);
            } else {
              $('#conversionResult').text('Enter a valid amount in USD');
            }
          });
        } else {
          showMessageModal('An error has occurred');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        //   console.log('AJAX Request Error: ' + textStatus + ', ' + errorThrown);
        showMessageModal('An error has occurred');
      },
    });
  } catch (error) {
    // console.error('Error fetching data:', error);
    showMessageModal('Please select a country first.');
  }
});

//  Weather Button, calls fetch weather data
var weatherBtn = L.easyButton('fa-cloud fa-lg', function (btn, map) {
  if (typeof selectedCountry === 'undefined' || !selectedCountry.latlng) {
    showMessageModal('Please select a country first.');
    return;
  }

  try {
    fetchWeatherData(capitalLat, capitalLng);
  } catch (error) {
    // console.error(error);
    showMessageModal('An unexpected error occurred');
  }
});

// --------------------- ADD BUTTONS TO MAP ---------------------

// Add buttons
infoBtn.addTo(map);
wikiBtn.addTo(map);
flagBtn.addTo(map);
quakeBtn.addTo(map);
exchangeBtn.addTo(map);
weatherBtn.addTo(map);
attributionButton.addTo(map);

// --------------------- FETCH DATA AND POPULATE MODALS ---------------------

// Fetch country names and ISO codes from countryBorders.geo.json on page load
const nameIsoRequest = $.getJSON(
  'libs/php/routines/name-iso.php',
  function (data) {
    countryNameIso = data;
    countryNameIso.sort((a, b) => a.name.localeCompare(b.name));

    const $select = $('#countrySelect');

    $.each(countryNameIso, function (index, country) {
      const countryName = country.name;
      const countryCode = country.iso_a2;
      const $option = $('<option></option>').val(countryCode).text(countryName);
      $select.append($option);
    });
  }
).fail(function (jqXHR, textStatus, errorThrown) {
  showMessageModal('An unexpected error occurred');
  // console.error('Error fetching country data: ', textStatus, errorThrown);
});

// Fetch full country data on page load
const countryDataRequest = $.getJSON(
  'libs/php/routines/country-data.php',
  function (countries) {
    countriesData = countries;
    $('#countryList').text('Select a Country').attr('disabled', true);
  }
).fail(function (jqXHR, textStatus, errorThrown) {
  showMessageModal('An unexpected error occurred');
  // console.error('Error fetching countries:', errorThrown);
});

// Wait until previous on page load requests complete before running user geolocation code
$.when(nameIsoRequest, countryDataRequest).done(function () {
  if (!countriesData) {
    // console.error('countriesData is still undefined after API call.');
    showMessageModal('An unexpected error occurred');
    return;
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var userLat = position.coords.latitude;
        var userLng = position.coords.longitude;
        map.setView([userLat, userLng], 13);

        // Use the coordinates to determine the country
        $.ajax({
          url: 'libs/php/routines/get-country-by-coordinates.php',
          type: 'GET',
          data: { lat: userLat, lng: userLng },
          dataType: 'json',
          success: function (data) {
            if (data.status === 'ok' && data.countryCode) {
              const userCountryCode = data.countryCode;
              selectedCountry = countriesData.find(function (country) {
                return country.cca2 === userCountryCode;
              });
              // Set the dropdown to the user's country and trigger change
              if (selectedCountry) {
                $('#countrySelect').val(userCountryCode).trigger('change');
              } else {
                // console.error(
                //   'Could not find a match in countriesData for code:',
                //   userCountryCode
                // );
                showMessageModal('An unexpected error occurred');
              }
            } else {
              // console.error('Error finding country for user location');
              showMessageModal('An unexpected error occurred');
            }
          },
          error: function (error) {
            //console.error('Error with geolocation country lookup:', error);
            showMessageModal('An unexpected error occurred');
          },
        });
      },
      function (error) {
        // console.error('Geolocation error: ' + error.message);
        showMessageModal('An unexpected error occurred');
        $('#loadingSpinner').fadeOut('slow');
      }
    );
  }
});

// Fetch city map markers
function loadCitiesLayer(countryCode) {
  citiesLayer.clearLayers();
  citiesClusterGroup.clearLayers();

  if (countryCode) {
    $.ajax({
      url: 'libs/php/routines/cities.php',
      type: 'GET',
      data: { countryCode: countryCode },
      dataType: 'json',
      success: function (response) {
        if (response.length > 0) {
          response.forEach(function (city) {
            var lat = city.lat;
            var lon = city.lon;
            var name = city.name;
            var pop = Math.round(city.pop / 100000) * 100000; // Round population to nearest 100,000

            var capitalCity = Array.isArray(selectedCountry.capital)
              ? selectedCountry.capital[0]
              : selectedCountry.capital;
            if (name === capitalCity) {
              capitalLat = lat;
              capitalLng = lon;
            }

            var markerIcon = name === capitalCity ? capitalIcon : cityIcon;

            // Create a marker and add it to the cluster group
            var marker = L.marker([lat, lon], { icon: markerIcon }).bindPopup(
              `<b>${name}, population: ${pop.toLocaleString()}</b>`
            );
            citiesClusterGroup.addLayer(marker);
          });

          if (map.hasLayer(citiesClusterGroup)) {
            citiesClusterGroup.addTo(map);
          }
        } else {
          showMessageModal(
            'No cities found for this country. Please note that cities with a population below 300,000 will not be displayed'
          );
        }
      },
      error: function (error) {
        showMessageModal('An unexpected error occurred');
        // console.error('Error fetching city data:', error);
      },
    });
  }
}

// function loadCitiesLayer(countryCode) {
//   citiesLayer.clearLayers();
//   citiesClusterGroup.clearLayers();

//   if (countryCode) {
//     $.ajax({
//       url: 'libs/php/routines/cities.php',
//       type: 'GET',
//       data: { countryCode: countryCode },
//       dataType: 'json',
//       success: function (response) {
//         if (response.length > 0) {
//           response.forEach(function (city) {
//             var lat = city.lat;
//             var lon = city.lon;
//             var name = city.name;
//             var pop = city.pop;

//             var capitalCity = Array.isArray(selectedCountry.capital)
//               ? selectedCountry.capital[0]
//               : selectedCountry.capital;

//             var markerIcon = name === capitalCity ? capitalIcon : cityIcon;

//             // Create a marker and add it to the cluster group
//             var marker = L.marker([lat, lon], { icon: markerIcon }).bindPopup(
//               `<b>${name}, population: ${pop}</b>`
//             );
//             citiesClusterGroup.addLayer(marker);
//           });

//           if (map.hasLayer(citiesClusterGroup)) {
//             citiesClusterGroup.addTo(map);
//           }
//         } else {
//           showMessageModal(
//             'No cities found for this country. Please note that cities with a population below 300,000 will not be displayed'
//           );
//         }
//       },
//       error: function (error) {
//         console.error('Error fetching city data:', error);
//       },
//     });
//   }
// }

// Fetch Wiki Data on button click
function fetchWikipediaData(countryName) {
  $.ajax({
    url: 'libs/php/routines/wiki-data.php',
    type: 'GET',
    data: { country: countryName },
    dataType: 'json',
    success: function (data) {
      if (data.query && data.query.pages) {
        const page = Object.values(data.query.pages)[0];
        if (page.extract) {
          const fullWikiUrl = `https://en.wikipedia.org/?curid=${page.pageid}`;

          const paragraphs = page.extract
            .split('\n')
            .filter((paragraph) => paragraph.trim() !== '');

          // Select only the first two paragraphs
          let displayText = '';
          if (paragraphs.length > 0) {
            displayText += `<p>${paragraphs[0]}</p>`;
          }
          if (paragraphs.length > 1) {
            displayText += `<p>${paragraphs[1]}...</p>`;
          }

          $('#wikiModalLabel').html(`${countryName} Wiki`);
          $('#wikiExtract').html(displayText);
          $('#wikiModal').modal('show');
          $('#wikiLink').html(`
                        <a href="${fullWikiUrl}" target="_blank">
                            Read more on Wikipedia <i class="fa-solid fa-external-link-alt"></i>
                        </a>
                    `);
        } else {
          showMessageModal('No information available on Wikipedia.');
        }
      } else {
        showMessageModal('No Wikipedia data found.');
      }
    },
    error: function (xhr, status, error) {
      // console.error('Error fetching Wikipedia data:', error);
      showMessageModal('An unexpected error occurred');
    },
  });
}

// Fetch Earthquake Data on button click
function fetchEarthquakeData() {
  $.ajax({
    url: 'libs/php/routines/earthquake-data.php',
    type: 'POST',
    data: {
      latN: latN,
      latS: latS,
      lngE: lngE,
      lngW: lngW,
    },
    dataType: 'json',
    success: function (response) {
      if (response.status.name === 'ok' && response.data.length) {
        clearEarthquakeMarkers(); // Clear any existing markers

        for (let i = 0; i < 5 && i < response.data.length; i++) {
          const earthquake = response.data[i];

          // Format date and time
          let date = new Date(earthquake.datetime);
          let formattedDate = date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });

          // Get earthquake details
          const depth = earthquake.depth.toFixed(1);
          const magnitude = earthquake.magnitude.toFixed(1);
          const lat = earthquake.lat;
          const lng = earthquake.lng;

          // Create a Leaflet marker with the custom earthquake icon
          const marker = L.marker([lat, lng], { icon: earthquakeIcon }).addTo(
            map
          );
          const popupContent = `
                        <strong>#${i + 1}</strong><br>
                        <b>Date/Time:</b> ${formattedDate}<br>
                        <b>Depth:</b> ${depth} km<br>
                        <b>Magnitude:</b> ${magnitude}<br>
                        <b>Location:</b> ${lat.toFixed(2)}, ${lng.toFixed(2)}
                    `;

          marker.bindPopup(popupContent);
          earthquakeMarkers.push(marker);
        }
      } else {
        showMessageModal('No Earthquake Data Available For This Region');
      }
    },
    error: function (xhr, status, error) {
      // console.error('Error fetching earthquake data:', error);
      showMessageModal('Error fetching earthquake data.');
    },
  });
}

function fetchCountryFlag(cca2) {
  const country = countriesData.find((country) => country.cca2 === cca2);

  if (country && country.flags) {
    let flagUrl = country.flags.png;

    $('#flagImage').attr('src', flagUrl);
    $('#flagModalLabel').text(`${country.name.common} National Flag`);
    $('#flagModal').modal('show');
  } else {
    showMessageModal('Flag not found.');
  }
}

// Fetch Weather Data on button click
function fetchWeatherData(lat, lng) {
  if (lat && lng) {
    $.ajax({
      url: 'libs/php/routines/weather.php',
      type: 'GET',
      data: { lat: lat, lng: lng },
      dataType: 'json',
      success: function (response) {
        if (response.cod === '200') {
          const currentWeather = response.list[0];
          const tomorrow = response.list[8];
          const dayAfterTomorrow = response.list[16];
          // Helper function to convert Kelvin to Celsius and round to the nearest whole number
          function kelvinToCelsius(kelvin) {
            return Math.round(kelvin - 273.15);
          }
          $('#weatherInfoModalLabel').text(
            `${selectedCountry.capital} Forecast`
          );

          const weatherInfo = `
                        <div class="weather-current">
                            <div class="today">
                                <h6>TODAY</h6>
                                <div class="weather-icon">
                                    <img src="https://openweathermap.org/img/wn/${
                                      currentWeather.weather[0].icon
                                    }@2x.png" alt="weather icon">
                                </div>
                                <div class="temp">${kelvinToCelsius(
                                  currentWeather.main.temp
                                )}°C</div>
                                <div class="temp-range">${kelvinToCelsius(
                                  currentWeather.main.temp_min
                                )}°C / ${kelvinToCelsius(
            currentWeather.main.temp_max
          )}°C</div>
                                <div class="description">${
                                  currentWeather.weather[0].description
                                }</div>
                            </div>
                        </div>
                        <div class="weather-forecast">
                            <div class="forecast">
                                <h6>${getDayOfWeek(tomorrow.dt_txt)}</h6>
                                <img src="https://openweathermap.org/img/wn/${
                                  tomorrow.weather[0].icon
                                }@2x.png" alt="weather icon">
                                <div>${kelvinToCelsius(
                                  tomorrow.main.temp
                                )}°C</div>
                                <div>${tomorrow.weather[0].description}</div>
                            </div>
                            <div class="forecast">
                                <h6>${getDayOfWeek(
                                  dayAfterTomorrow.dt_txt
                                )}</h6>
                                <img src="https://openweathermap.org/img/wn/${
                                  dayAfterTomorrow.weather[0].icon
                                }@2x.png" alt="weather icon">
                                <div>${kelvinToCelsius(
                                  dayAfterTomorrow.main.temp
                                )}°C</div>
                                <div>${
                                  dayAfterTomorrow.weather[0].description
                                }</div>
                            </div>
                        </div>
                        <div class="weather-footer">
                            <small>Last updated ${new Date().toLocaleTimeString()}, ${new Date().toLocaleDateString()}. Powered by OpenWeather</small>
                        </div>
                    `;

          $('#weatherDetails').html(weatherInfo);
          $('#weatherInfoModal').modal('show');
        } else {
          showMessageModal(
            'Error retrieving weather data: ' + response.message
          );
        }
      },
      error: function () {
        showMessageModal('There was an error processing the request.');
      },
    });
  } else {
    showMessageModal('No coordinates found for this location');
  }
}

// Resets Currency Modal
$('#currencyModal').on('hidden.bs.modal', function () {
  $('#usdAmount').val('');
  $('#conversionResult').html('Enter an amount in USD to see the conversion');
  // Remove the input event listener to prevent stacking
  $('#usdAmount').off('input');
});

// Sets selectedCountry, bounding box and map view when a country is selected
$('#countrySelect').on('change', async function () {
  clearEarthquakeMarkers();
  const selectedCode = $(this).val();

  if (!selectedCode) {
    // console.warn('No country selected or country code is null.');
    showMessageModal('An unexpected error occurred');
    return;
  }

  if (!countriesData || !Array.isArray(countriesData)) {
    // console.error('countriesData is not defined or not an array');
    showMessageModal('An unexpected error occurred');
    return;
  }

  selectedCountry = countriesData.find(function (country) {
    return country.cca2 === selectedCode;
  });

  if (!selectedCountry) {
    // console.error(
    //   'Could not find a match in countriesData for code:',
    //   selectedCode
    // );
    showMessageModal('An unexpected error occurred');
    return;
  }

  try {
    const [boundingBoxResponse, countryBordersResponse] = await Promise.all([
      $.ajax({
        url: 'libs/php/routines/bounding-box.php',
        type: 'POST',
        data: { countryCode: selectedCountry.cca2 },
        dataType: 'json',
      }),
      $.ajax({
        url: 'libs/php/routines/country-borders.php',
        type: 'GET',
        data: { countryCode: selectedCode },
        dataType: 'json',
      }),
    ]);

    if (boundingBoxResponse.status === 'ok') {
      latN = boundingBoxResponse.boundingBox.north;
      latS = boundingBoxResponse.boundingBox.south;
      lngE = boundingBoxResponse.boundingBox.east;
      lngW = boundingBoxResponse.boundingBox.west;
    } else {
      //console.error('Bounding Box Error:', boundingBoxResponse.message);
      showMessageModal('An unexpected error occurred');
    }

    if (countryBordersResponse) {
      if (countryBordersLayer) {
        map.removeLayer(countryBordersLayer);
      }

      countryBordersLayer = L.geoJSON(countryBordersResponse, {
        style: {
          color: '#74C0FC',
          weight: 2,
        },
      }).addTo(map);

      if (countryBordersLayer && countryBordersLayer.getBounds().isValid()) {
        map.fitBounds(countryBordersLayer.getBounds(), { padding: [50, 50] });
      } else {
        // console.warn('Country borders layer is invalid or not loaded.');
        showMessageModal('An unexpected error occurred');
      }
    }
  } catch (error) {
    // console.error('Error handling requests:', error);
    showMessageModal('An unexpected error occurred');
  }

  $('#loadingSpinner').fadeOut('slow');
});

// Fetch national park data and add map markers
function fetchNationalParks(countryCode) {
  $.ajax({
    url: 'libs/php/routines/national-parks.php',
    type: 'POST',
    data: { countryCode: countryCode },
    dataType: 'json',
    success: function (parks) {
      if (parks.length) {
        nationalParksLayer.clearLayers();
        nationalParksClusterGroup.clearLayers();

        parks.forEach(function (park) {
          var lat = park.coordinates[0];
          var lon = park.coordinates[1];
          var parkName = park.name;

          var marker = L.marker([lat, lon], {
            icon: nationalParkIcon,
          }).bindPopup('<b>' + parkName + '</b>');
          nationalParksClusterGroup.addLayer(marker);
        });

        if (map.hasLayer(nationalParksClusterGroup)) {
          nationalParksClusterGroup.addTo(map);
        }
      } else {
        showMessageModal('No national park data available for this country.');
      }
    },
    error: function (xhr, status, error) {
      //console.error('Error fetching national parks:', error);
      showMessageModal('Error retrieving national parks data.');
    },
  });
}

// Populate infoBox with data from selectedCountry when info box is clicked:
function populateInfoModal(country) {
  const $tableBody = $('#infoModal .table tbody');
  $tableBody.empty();

  const capitaliseFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const languages = country.languages;
  const languageList = Object.values(languages);
  const formattedLanguages = languageList.join(', ');

  const continents = country.continents;
  const continentList = Object.values(continents);
  const formattedContinents = continentList.join(', ');

  const rows = `
    <tr>
      <td class="align-middle text-center">
        <i class="fa-solid fa-city" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle text-start text-nowrap">Capital City</td>
      <td class="align-middle text-end">${
        country.capital ? country.capital.join(', ') : 'N/A'
      }</td>
    </tr>
    <tr>
      <td class="align-middle text-center">
        <i class="fa-solid fa-location-dot" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle text-start text-nowrap">Continent</td>
      <td class="align-middle text-end">${formattedContinents}</td>
    </tr>
    <tr>
      <td class="align-middle text-center">
        <i class="fa-solid fa-person" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle text-start text-nowrap">Population</td>
      <td class="align-middle text-end">${country.population.toLocaleString()}</td>
    </tr>
    <tr>
      <td class="align-middle text-center">
        <i class="fa-solid fa-globe" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle text-start text-nowrap">Area</td>
      <td class="align-middle text-end">${country.area.toLocaleString()} km²</td>
    </tr>
    <tr>
      <td class="align-middle text-center">
        <i class="fa-solid fa-car" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle text-start text-nowrap">Driving Side</td>
      <td class="align-middle text-end">${capitaliseFirstLetter(
        country.car.side
      )}</td>
    </tr>
    <tr>
      <td class="align-middle text-center">
        <i class="fa-regular fa-comment-dots" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle text-start text-nowrap">Languages</td>
      <td class="align-middle text-end">${formattedLanguages}</td>
    </tr>
    <tr>
      <td class="align-middle text-center">
        <i class="fa-solid fa-equals" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle text-start text-nowrap">ISO aplha 2</td>
      <td class="align-middle text-end">${country.cca2}</td>
    </tr>
        <tr>
      <td class="align-middle text-center">
        <i class="fa-solid fa-bars" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle text-start text-nowrap">ISO aplha 3</td>
      <td class="align-middle text-end">${country.cca3}</td>
    </tr>
  `;
  $tableBody.append(rows);
}

// Fetches national park map marker info when a country is selected from dropdown
$('#countrySelect').on('change', function () {
  var selectedCountryCode = selectedCountry.cca2;
  fetchNationalParks(selectedCountryCode);
});

// Calls loadCityLayer
$('#countrySelect').on('change', function () {
  var selectedCountryCode = selectedCountry.cca2;
  loadCitiesLayer(selectedCountryCode);
});
