// preloader function
window.onload = function () {
  document.getElementById('preloader').style.display = 'none';
};

// helper function returns country name from coordinates
async function getCountryFromCoordinates(lat, lng) {
  const apiKey = 'f78de399088a414eba24af1395a7ae09';
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      console.log(data);
      const country = data.results[0].formatted;
      console.log('Country:', country);
      return country;
    } else {
      console.log('No country found for the given coordinates.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching country data:', error);
    return null;
  }
}

// helper function returns a country's name from two letter ISO code
async function getCountryNameFromISO(isoCode) {
  const apiKey = 'f78de399088a414eba24af1395a7ae09';
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${isoCode}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      const country = data.results[0].components.country;
      console.log('Country:', country);
      return country;
    } else {
      console.log('No country found for the given code.');
    }
  } catch (error) {
    console.error('Error fetching country data:', error);
  }
}

$(document).ready(function () {
  // hide results initially
  $('#earthquake-data').hide();
  $('#postcode-data').hide();
  $('#country-data').hide();

  // earthquakes lookup
  $('#fetchQuakeData').on('click', function () {
    $('#earthquake-data').show();
    $.ajax({
      url: 'libs/php/earthquake-functions.php',
      type: 'POST',
      dataType: 'json',
      data: {
        latN: $('#lat-north').val(),
        latS: $('#lat-south').val(),
        lngE: $('#lng-east').val(),
        lngW: $('#lng-west').val(),
      },
      success: function (response) {
        if (response.status.name == 'ok') {
          let date = response.data[0].datetime;
          let depth = response.data[0].depth;
          let depthRounded = depth.toFixed(2);
          let magnitude = response.data[0].magnitude;
          let magRounded = magnitude.toFixed(2);
          let lat = response.data[0].lat;
          let lng = response.data[0].lng;
          const getLocation = async () => {
            const response = await getCountryFromCoordinates(lat, lng);
            if (response) {
              $('#location').html(response);
            } else {
              console.log('no location found');
            }
          };
          getLocation();

          $('#date').html(date);
          $('#depth').html(depthRounded);
          $('#magnitude').html(magRounded);
        }
      },
      error: function () {
        $('#results-cell').html('An error occurred while fetching the data.');
      },
    });
  });

  // postcode lookup
  $('#postcodeSubmit').on('click', function () {
    $('#postcode-data').show();
    $.ajax({
      url: 'libs/php/post-code-functions.php',
      type: 'POST',
      dataType: 'json',
      data: {
        postcode: $('#postcodeInput').val(),
        country: $('#postcodeCountry').val(),
      },
      success: function (response) {
        if (response.status.name == 'ok') {
          let location = response.data;
          $('#postcode-location').html(location);
        }
      },
      error: function () {
        $('#results-cell').html(
          'An error occurred while fetching the data. Please double check a vaild postcode has been entered'
        );
      },
    });
  });

  // country lookup
  $('#countrySubmit').on('click', function () {
    $('#country-data').show();
    $.ajax({
      url: 'libs/php/country-functions.php',
      type: 'POST',
      dataType: 'json',
      data: {
        lat: $('#lat').val(),
        lng: $('#lng').val(),
      },
      success: function (response) {
        if (response.status.name == 'ok') {
          let isoCode = response.data;
          const getCountry = async () => {
            const response = await getCountryNameFromISO(isoCode);
            if (response) {
              $('#country-location').html(response);
            } else {
              console.log('no location found');
            }
          };
          getCountry();
        }
      },
      error: function () {
        $('#results-cell').html(
          'An error occurred while fetching the data. Please double check a vaild postcode has been entered'
        );
      },
    });
  });
});

// Areas of improvement:
// Sanitise inputs
// Hide API keys
// Reset button
// Only one input visible at a time
