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

// ----------------- MAP, LAYERS AND ICONS ---------------------

// Map Layer Icons
var cityIcon = L.icon({
  iconUrl: './resources/city.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

var capitalIcon = L.icon({
  iconUrl: './resources/capital-city.png',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

var nationalParkIcon = L.icon({
  iconUrl: './resources/park.png',
  iconSize: [32, 37],
  iconAnchor: [16, 37],
  popupAnchor: [0, -28],
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
  Cities: citiesClusterGroup,
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

$(document).ready(function () {
  //
  // --------------------- DEFINE BUTTONS ---------------------

  var attributionButton = L.control({ position: 'bottomright' });

  attributionButton.onAdd = function (map) {
    var div = L.DomUtil.create(
      'div',
      'leaflet-bar leaflet-control leaflet-control-custom'
    );
    div.innerHTML =
      '<i class="fas fa-info-circle" style="font-size:18px; cursor: pointer;"></i>';
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
  var infoBtn = L.easyButton('fa-info fa-xl', function (btn, map) {
    if (selectedCountry) {
      populateInfoModal(selectedCountry);
      $('#infoModal').modal('show');
    } else {
      alert('Please select a country first.');
    }
  });

  // Wikipedia button, calls fetchWikipediaData()
  var wikiBtn = L.easyButton('fa-book fa-lg', function (btn, map) {
    if (selectedCountry) {
      fetchWikipediaData(selectedCountry.name.common);
    } else {
      alert('Please select a country first.');
    }
  });

  // Flag button, calls fetchCountryFlag()
  var flagBtn = L.easyButton('fa-flag fa-lg', function (btn, map) {
    if (selectedCountry) {
      fetchCountryFlag(selectedCountry.name.common);
    } else {
      alert('Please select a country first.');
    }
  });

  // Earthquake Button, calls fetchEarthquakeData()
  var quakeBtn = L.easyButton('fa-house-crack fa-lg', function (btn, map) {
    if (selectedCountry) {
      fetchEarthquakeData();
    } else {
      alert('Please select a country first.');
    }
  });

  // Exchange Rate Button, opens currency modal
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
      $('#currencyModalLabel').html(
        `Local Currency: ${localCurrencyName} ( ${currencySymbol} )`
      );
      $('#currencyModal').modal('show');
    } catch (error) {
      console.error('Error fetching data:', error); // Catch and log any potential errors
      alert('Please select a country first.');
    }
  });

  //  Weather Button, calls fetch weather data
  var weatherBtn = L.easyButton('fa-cloud fa-lg', function (btn, map) {
    if (typeof selectedCountry === 'undefined' || !selectedCountry.latlng) {
      alert('Please select a country first.');
      return;
    }

    try {
      fetchWeatherData(selectedCountry.latlng[0], selectedCountry.latlng[1]);
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred.');
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

  // --------------------- LOCATE USER ON LOGIN ---------------------

  // Custom icon for the user's marker
  var userIcon = L.icon({
    iconUrl: './resources/location.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
  // Handle User Location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var userLat = position.coords.latitude;
        var userLng = position.coords.longitude;
        map.setView([userLat, userLng], 13);

        L.marker([userLat, userLng], { icon: userIcon })
          .addTo(map)
          .bindPopup('You are here!')
          .openPopup();

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

  // --------------------- FETCH DATA AND POPULATE MODALS ---------------------

  // Populate dropdown menu from geoJSON file on page load
  $.getJSON('../backend/php/name-iso.php', function (data) {
    countryNameIso = data;
    countryNameIso.sort((a, b) => a.name.localeCompare(b.name));

    const $select = $('#countrySelect');

    $.each(countryNameIso, function (index, country) {
      const countryName = country.name;
      const countryCode = country.iso_a3;

      const $option = $('<option></option>').val(countryCode).text(countryName);
      $select.append($option);
    });
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.error('Error fetching country data: ', textStatus, errorThrown);
  });

  // Call RESTcountries API, assign full return value to countriesData on page load
  $.getJSON('../backend/php/country-data.php', function (countries) {
    countriesData = countries;
    $('#countryList').text('Select a Country').attr('disabled', true);
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.error('Error fetching countries:', errorThrown);
  });

  // Fetch city map markers
  function loadCitiesLayer(countryCode) {
    citiesLayer.clearLayers();
    citiesClusterGroup.clearLayers();

    if (countryCode) {
      $.ajax({
        url: '../backend/php/cities.php',
        type: 'GET',
        data: { countryCode: countryCode },
        dataType: 'json',
        success: function (response) {
          if (response.length > 0) {
            response.forEach(function (city) {
              var lat = city.lat;
              var lon = city.lon;
              var name = city.name;
              var pop = city.pop;

              var capitalCity = Array.isArray(selectedCountry.capital)
                ? selectedCountry.capital[0]
                : selectedCountry.capital;

              var markerIcon = name === capitalCity ? capitalIcon : cityIcon;

              // Create a marker and add it to the cluster group
              var marker = L.marker([lat, lon], { icon: markerIcon }).bindPopup(
                `<b>${name}, population: ${pop}</b>`
              );
              citiesClusterGroup.addLayer(marker);
            });

            if (map.hasLayer(citiesClusterGroup)) {
              citiesClusterGroup.addTo(map);
            }
          } else {
            alert(
              'No cities found for this country. Please note that cities with a population below 300,000 will not be displayed'
            );
          }
        },
        error: function (error) {
          console.error('Error fetching city data:', error);
        },
      });
    }
  }

  // Fetch Wiki Data on button click
  function fetchWikipediaData(countryName) {
    $.ajax({
      url: '../backend/php/wiki-data.php',
      type: 'GET',
      data: { country: countryName },
      dataType: 'json',
      success: function (data) {
        if (data.query && data.query.pages) {
          const page = Object.values(data.query.pages)[0];
          if (page.extract) {
            const fullWikiUrl = `https://en.wikipedia.org/?curid=${page.pageid}`;
            $('#wikiModalLabel').html(`
              <i class="fa-brands fa-wikipedia-w"></i>   :  ${countryName}
            `);
            $('#wikiExtract').text(page.extract);
            $('#wikiModal').modal('show');
            $('#wikiLink').html(`
              <a href="${fullWikiUrl}" target="_blank">
                Read more on Wikipedia <i class="fa-solid fa-external-link-alt"></i>
              </a>
            `);
          } else {
            alert('No information available on Wikipedia.');
          }
        } else {
          alert('No Wikipedia data found.');
        }
      },
      error: function (xhr, status, error) {
        console.error('Error fetching Wikipedia data:', error);
        alert('Error fetching Wikipedia data.');
      },
    });
  }

  // Fetch Earthquake Data on button click

  function fetchEarthquakeData() {
    $.ajax({
      url: '../backend/php/earthquake-data.php',
      type: 'POST',
      data: {
        latN: latN,
        latS: latS,
        lngE: lngE,
        lngW: lngW,
      },
      dataType: 'json',
      success: function (response) {
        if (response.status.name == 'ok') {
          if (response.data.length) {
            let modalBodyContent = '';

            const numberIcons = ['①', '②', '③', '④', '⑤'];

            for (let i = 0; i < 5 && i < response.data.length; i++) {
              let date = response.data[i].datetime;
              let depth = response.data[i].depth.toFixed(2);
              let magnitude = response.data[i].magnitude.toFixed(2);
              let lat = response.data[i].lat;
              let lng = response.data[i].lng;

              // Grouping data into separate rows for each description and value
              modalBodyContent += `
                <tr>
                  <td colspan="3" style="text-align: center; font-size: 1.5em;">
                    <span>${numberIcons[i]}</span>
                  </td>
                </tr>
                <tr>
                  <td><i class="fa-solid fa-clock"></i></td>
                  <td>Date/Time</td>
                  <td>${date}</td>
                </tr>
                <tr>
                  <td><i class="fa-solid fa-ruler-vertical"></i></td>
                  <td>Depth</td>
                  <td>${depth} km</td>
                </tr>
                <tr>
                  <td><i class="fa-solid fa-wave-square"></i></td>
                  <td>Magnitude</td>
                  <td>${magnitude}</td>
                </tr>
                <tr>
                  <td><i class="fa-solid fa-map-marker-alt"></i></td>
                  <td>Latitude</td>
                  <td>${lat}</td>
                </tr>
                <tr>
                  <td><i class="fa-solid fa-map-marker-alt"></i></td>
                  <td>Longitude</td>
                  <td>${lng}</td>
                </tr>
                <tr><td colspan="3"><hr></td></tr> <!-- Divider between earthquakes -->
              `;
            }

            $('#earthquakeInfo .modal-body tbody').html(modalBodyContent);
            $('#earthquakeModalLabel').text('Most Powerful Recent Earthquakes');
            $('#earthquakeInfo').modal('show');
          } else {
            $('#earthquakeInfo .modal-body tbody').html(
              '<tr><td>No Earthquake Data Available For This Region</td></tr>'
            );
            $('#earthquakeModalLabel').text('Most Powerful Recent Earthquakes');
            $('#earthquakeInfo').modal('show');
          }
        }
      },
      error: function (xhr, status, error) {
        console.error('Error fetching earthquake data:', error);
      },
    });
  }

  // Fetch Flag Data on button click
  function fetchCountryFlag(countryName) {
    $.ajax({
      url: '../backend/php/flags.php',
      type: 'GET',
      data: { country: countryName },
      dataType: 'json',
      success: function (data) {
        if (data.flag_url) {
          if (data.flag_url == 'https://flagcdn.com/w320/tw.png') {
            data.flag_url = 'https://flagcdn.com/w320/cn.png';
          }
          $('#flagImage').attr('src', data.flag_url);
          $('#flagModalLabel').text(countryName + ' National Flag');
          $('#flagModal').modal('show');
        } else {
          alert('Flag not found.');
        }
      },
      error: function (xhr, status, error) {
        console.error('Error fetching country flag:', error);
        alert('Error fetching country flag.');
      },
    });
  }

  // Fetch Weather Data on button click

  function fetchWeatherData(lat, lng) {
    if (lat && lng) {
      $.ajax({
        url: '../backend/php/weather.php',
        type: 'GET',
        data: { lat: lat, lng: lng },
        dataType: 'json',
        success: function (response) {
          if (response.cod === '200') {
            var currentWeather = response.list[0];
            var morningForecast = response.list.find((item) =>
              item.dt_txt.includes('09:00:00')
            );
            var afternoonForecast = response.list.find((item) =>
              item.dt_txt.includes('12:00:00')
            );
            var eveningForecast = response.list.find((item) =>
              item.dt_txt.includes('18:00:00')
            );

            // Helper function to convert Kelvin to Celsius
            function kelvinToCelsius(kelvin) {
              return (kelvin - 273.15).toFixed(2);
            }

            // Helper function to get day of the week
            function getDayOfWeek(dateString) {
              const date = new Date(dateString);
              const options = { weekday: 'long' };
              return new Intl.DateTimeFormat('en-US', options).format(date);
            }

            // Construct weather info with icons for morning, afternoon, and evening
            var weatherInfo = `
              <div class="current-weather">
                <strong>Location:</strong> ${selectedCountry.name.common} <br>
                <img src="https://openweathermap.org/img/wn/${
                  currentWeather.weather[0].icon
                }@2x.png" alt="weather icon"> <br>
                <span>${kelvinToCelsius(currentWeather.main.temp)}°C - ${
              currentWeather.weather[0].description
            }</span><br>
                <span><strong>Humidity:</strong> ${
                  currentWeather.main.humidity
                }%</span><br>
                <span><strong>Wind:</strong> ${
                  currentWeather.wind.speed
                } m/s</span>
              </div>
  
              <div class="forecast-section">
                <div class="forecast">
                  <h6>Morning</h6>
                  <img src="https://openweathermap.org/img/wn/${
                    morningForecast.weather[0].icon
                  }@2x.png" alt="weather icon">
                  <div>${kelvinToCelsius(morningForecast.main.temp)}°C</div>
                  <div>${morningForecast.weather[0].description}</div>
                </div>
                <div class="forecast">
                  <h6>Afternoon</h6>
                  <img src="https://openweathermap.org/img/wn/${
                    afternoonForecast.weather[0].icon
                  }@2x.png" alt="weather icon">
                  <div>${kelvinToCelsius(afternoonForecast.main.temp)}°C</div>
                  <div>${afternoonForecast.weather[0].description}</div>
                </div>
                <div class="forecast">
                  <h6>Evening</h6>
                  <img src="https://openweathermap.org/img/wn/${
                    eveningForecast.weather[0].icon
                  }@2x.png" alt="weather icon">
                  <div>${kelvinToCelsius(eveningForecast.main.temp)}°C</div>
                  <div>${eveningForecast.weather[0].description}</div>
                </div>
              </div>
  
              <div class="forecast-3day">
                ${response.list
                  .slice(8, 24)
                  .map((forecast, index) => {
                    if (index % 8 === 0) {
                      // Get 1 forecast per day (every 8th interval)
                      const dayOfWeek = getDayOfWeek(forecast.dt_txt);
                      return `
                      <div class="day-forecast">
                        <strong>${dayOfWeek}</strong>
                        <img src="https://openweathermap.org/img/wn/${
                          forecast.weather[0].icon
                        }@2x.png" alt="weather icon">
                        <div>Temp: ${kelvinToCelsius(
                          forecast.main.temp
                        )}°C</div>
                        <div>${forecast.weather[0].description}</div>
                      </div>
                    `;
                    }
                    return '';
                  })
                  .join('')}
              </div>
            `;

            $('#weatherDetails').html(weatherInfo);
            $('#weatherInfoModal').modal('show');
          } else {
            alert('Error retrieving weather data: ' + response.message);
          }
        },
        error: function () {
          alert('There was an error processing the request.');
        },
      });
    } else {
      alert('No coordinates found for this location');
    }
  }

  // Fetch Currency Conversion Data on convert button click

  $('#convertButton').click(function () {
    // Get the user input for the amount of USD to convert
    var currencyQuantity = $('#usdAmount').val();

    // Validate that the user entered a valid number
    if (currencyQuantity === '' || isNaN(currencyQuantity)) {
      alert('Please enter a valid amount in USD.');
      return;
    }

    console.log('Selected Currency: ', selectedCurrency);
    console.log('Local Currency: ', localCurrency);
    console.log('Amount to Convert:', currencyQuantity);

    // Perform the AJAX request to fetch the conversion rate
    $.ajax({
      url: '../backend/php/exchange-rates.php',
      method: 'POST',
      dataType: 'json',
      data: {
        localCurrency: localCurrency,
      },
      success: function (response) {
        if (response.status === 'success') {
          var conversionRate = response.rate; // Get the exchange rate from the response
          var convertedAmount = currencyQuantity * conversionRate; // Calculate the converted amount

          // Display the result with the arrow icon in the conversionResult element
          $('#conversionResult').html(`
            ${currencyQuantity} USD 
            <i class="fa-solid fa-arrow-right"></i> 
            ${convertedAmount.toFixed(2)} ${localCurrency}
          `);

          console.log(
            currencyQuantity +
              ' USD is worth ' +
              convertedAmount.toFixed(2) +
              ' ' +
              localCurrency
          );
        } else {
          console.log('Error: ' + response.message);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('AJAX Request Error: ' + textStatus + ', ' + errorThrown);
      },
    });
  });

  // When a country is selected from the dropdown menu store bounding box coordinates and overlay border
  $('#countrySelect').on('change', async function () {
    const selectedCode = $(this).val();

    selectedCountry = countriesData.find(function (country) {
      return country.cca3 === selectedCode;
    });

    if (!selectedCode) {
      alert('Error selecting country');
      return;
    }

    try {
      const [boundingBoxResponse, countryBordersResponse] = await Promise.all([
        $.ajax({
          url: '../backend/php/bounding-box.php',
          type: 'POST',
          data: { countryCode: selectedCountry.cca2 },
          dataType: 'json',
        }),
        $.ajax({
          url: '../backend/php/country-borders.php',
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
        console.error('Bounding Box Error:', boundingBoxResponse.message);
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

        map.fitBounds(countryBordersLayer.getBounds());
      }
    } catch (error) {
      console.error('Error handling requests:', error);
    }

    // Center the map on the selected country's coordinates and add marker
    if (selectedCountry) {
      const latlng = selectedCountry.latlng;
      map.setView(latlng, 6);
      if (currentMarker) {
        map.removeLayer(currentMarker);
      }

      currentMarker = L.marker(latlng).addTo(map);

      if ($('#citiesLayerToggle').is(':checked')) {
        loadCitiesLayer(selectedCountry.cca2); // Reload city data for the selected country
      }
    }
  });

  // Recenter map when country is selected from dropdown menu
  $('#countrySelect').on('change', function () {
    const selectedCode = $(this).val();

    selectedCountry = countriesData.find(
      (country) => country.cca3 === selectedCode
    );

    if (selectedCountry) {
      const latlng = selectedCountry.latlng;
      map.setView(latlng, 6);
      if (
        layerControl._layers.find((layer) => layer.name === 'Cities').overlay
      ) {
        loadCitiesLayer(selectedCountry.cca2);
      }
    }
  });

  // Fetch national park data and add map markers
  function fetchNationalParks(countryCode) {
    $.ajax({
      url: '../backend/php/national-parks.php',
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
          alert('No national park data available for this country.');
        }
      },
      error: function (xhr, status, error) {
        console.error('Error fetching national parks:', error);
        alert('Error retrieving national parks data.');
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

    const timezones = country.timezones;
    const timezoneList = Object.values(timezones);
    const formattedTimezones = timezoneList.join(', ');

    const continents = country.continents;
    const continentList = Object.values(continents);
    const formattedContinents = continentList.join(', ');

    const rows = `
    <tr>
      <td colspan="3" class="text-center h3">${country.name.common}</td>
    </tr>
    <tr>
      <td class="align-middle text-center">
        <i class="fa-solid fa-city" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle">
        Capital City:
      </td>
      <td class="align-middle">${
        country.capital ? country.capital.join(', ') : 'N/A'
      }</td>
    </tr>
    <tr>
      <td class="align-middle text-center">
        <i class="fa-solid fa-location-dot" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle">
        Continent:
      </td>
      <td class="align-middle">${formattedContinents}</td>
    </tr>
     <tr>
      <td class="align-middle text-center">
       <i class="fa-solid fa-location-crosshairs" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle">
        Sub-Region:
      </td>
      <td class="align-middle">${country.subregion}</td>
    </tr>
    <tr>
      <td class="align-middle text-center">
        <i class="fa-solid fa-person" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle">Population:</td>
      <td class="align-middle">${country.population.toLocaleString()}</td>
    </tr>
    <tr>
      <td class="align-middle text-center">
        <i class="fa-solid fa-globe" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle">Area:</td>
      <td class="align-middle">${country.area.toLocaleString()} km²</td>
    </tr>
    <tr>
      <td class="align-middle text-center">
        <i class="fa-solid fa-car" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle">Driving Side:</td>
      <td class="align-middle">${capitaliseFirstLetter(country.car.side)}</td>
    </tr>
    <tr>
      <td class="align-middle text-center">
        <i class="fa-regular fa-comment-dots" style="color: #74C0FC;"></i>
      </td>
      <td class="align-middle">Languages:</td>
      <td class="align-middle">${formattedLanguages}</td>
    </tr>
      <tr>
        <td class="align-middle text-center">
          <i class="fa-solid fa-clock" style="color: #74C0FC;"></i>
        </td>
        <td class="align-middle">Timezones:</td>
        <td class="align-middle">${formattedTimezones}</td>
    </tr>
  `;
    $tableBody.append(rows);
  }

  // Fetches national park map marker info when a country is selected from dropdown
  $('#countrySelect').on('change', function () {
    var selectedCountryCode = selectedCountry.cca2;
    fetchNationalParks(selectedCountryCode);
  });

  // Event listener for cities layer toggle
  $('#citiesLayerToggle').on('change', function () {
    if (this.checked) {
      if (selectedCountry) {
        loadCitiesLayer(selectedCountry.cca2);
      } else {
        alert('Please select a country first.');
        $('#citiesLayerToggle').prop('checked', false);
      }
    } else {
      if (map.hasLayer(citiesLayer)) {
        map.removeLayer(citiesLayer);
      }
    }
  });
});
