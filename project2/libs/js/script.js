// ----------------- Handle Authentication -----------------------

// Global variable used for conditional rendering only
var isLoggedIn = false;
// Check authentication status on page load
$(document).ready(function () {
  $.ajax({
    url: 'libs/php/checkAuth.php',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === 200) {
        isLoggedIn = true;
      } else {
        isLoggedIn = false;
      }
      renderAuthButton();
    },
    error: function () {
      //console.error('Error checking authentication status.');
      isLoggedIn = false;
      renderAuthButton();
    },
    complete: function () {
      $('#loadingSpinner').fadeOut('slow');
    },
  });
});
// Login logic, AJAX req to login.php
$('#loginButton').on('click', function (e) {
  e.preventDefault();

  const username = $('#username').val().trim();
  const password = $('#password').val().trim();

  if (!username || !password) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('Please enter both username and password.');
    $('#messageModal').modal('show');
    return;
  }

  $.ajax({
    url: 'libs/php/login.php',
    type: 'POST',
    data: { username, password },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === 200) {
        $('#loginModal').modal('hide');
        $('#messageModal .modal-title').text('Success');
        $('#messageContent').text(
          'Login successful! You now have full access.'
        );
        $('#messageModal').modal('show');
        isLoggedIn = true;
        renderAuthButton();
      } else {
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text(
          response.status.description || 'Invalid username or password.'
        );
        $('#messageModal').modal('show');
      }
    },
    error: function () {
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text('An error occurred during login.');
      $('#messageModal').modal('show');
    },
  });
});
// Logout logic, AJAX req to logout.php
$('#authButtonContainer').on('click', '#logoutButton', function () {
  $.ajax({
    url: 'libs/php/logout.php',
    type: 'POST',
    success: function () {
      isLoggedIn = false;
      renderAuthButton();
      $('#messageModal .modal-title').text('Logged Out');
      $('#messageContent').text('You have successfully logged out.');
      $('#messageModal').modal('show');
    },
    error: function () {
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text(
        'An error occurred during logout. Please try again.'
      );
      $('#messageModal').modal('show');
    },
  });
});
// Renders login/logout button depending on auth status
function renderAuthButton() {
  const $authButtonContainer = $('#authButtonContainer');
  $authButtonContainer.empty();

  if (isLoggedIn) {
    const logoutButton = `
      <button id="logoutButton" class="btn btn-secondary">Logout</button>
    `;
    $authButtonContainer.append(logoutButton);
  } else {
    const loginButton = `
      <button id="loginButton" class="btn btn-primary">Login</button>
    `;
    $authButtonContainer.append(loginButton);

    $('#loginButton').on('click', function () {
      $('#loginModal').modal('show');
    });
  }
}
// Calls renderAuthButton() on page load
$(document).ready(function () {
  renderAuthButton();
});

// ----------------- Fetch Data and Populate Tables ----------------

// AJAX request to getAll.php
function populatePersonnelTable() {
  const $personnelTableBody = $('#personnelTableBody');
  $personnelTableBody.empty();

  $.ajax({
    url: 'libs/php/getAll.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        response.data.forEach((person) => {
          const rowHtml = `
            <tr>
              <td class="align-middle text-nowrap">${
                person.lastName || 'N/A'
              }, ${person.firstName || 'N/A'}</td>
              <td class="align-middle text-nowrap d-md-table-cell">${
                person.jobTitle || ''
              }</td>
              <td class="align-middle text-nowrap d-md-table-cell">${
                person.department || 'N/A'
              }</td>
              <td class="align-middle text-nowrap d-md-table-cell">${
                person.location || 'N/A'
              }</td>
              <td class="align-middle text-nowrap d-md-table-cell">${
                person.email || 'N/A'
              }</td>
              <td class="text-end text-nowrap">
                <button type="button" class="btn btn-primary btn-sm edit-btn" 
                        data-bs-toggle="modal" data-bs-target="#editPersonnelModal" 
                        data-id="${person.id || ''}">
                    <i class="fa-solid fa-pencil fa-fw"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-id="${
                  person.id || ''
                }">
                    <i class="fa-solid fa-trash fa-fw"></i>
                </button>
              </td>
            </tr>
          `;
          $personnelTableBody.append(rowHtml);
        });
      } else {
        // //console.error(
        //   'Failed to fetch personnel data:',
        //   response.status.description
        // );
        return;
      }
    },
    error: function (xhr, status, error) {
      // console.error('Error fetching personnel data:', status, error);
    },
  });
}
// AJAX request to getDepartmentsWithLocations.php
function populateDepartmentsTable() {
  const $departmentsTableBody = $('#departmentTableBody');
  $departmentsTableBody.empty();

  $.ajax({
    url: 'libs/php/getDepartmentsWithLocations.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        response.data.forEach((department) => {
          const rowHtml = `
            <tr>
              <td class="align-middle text-nowrap">${
                department.departmentName || 'Unknown'
              }</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${
                department.locationName || 'Unknown'
              }</td>
              <td class="align-middle text-end text-nowrap">
                <button
                  type="button"
                  class="btn btn-primary btn-sm editDepartmentBtn"
                  data-bs-toggle="modal"
                  data-bs-target="#editDepartmentModal"
                  data-id="${department.departmentID}"
                >
                  <i class="fa-solid fa-pencil fa-fw"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-primary btn-sm deleteDepartmentBtn"
                  data-id="${department.departmentID}"
                >
                  <i class="fa-solid fa-trash fa-fw"></i>
                </button>
              </td>
            </tr>
          `;

          $departmentsTableBody.append(rowHtml);
        });
      } else {
        // console.error(
        //   'Failed to fetch departments with locations:',
        //   response.status.description
        // );
      }
    },
    error: function (xhr, status, error) {
      // console.error(
      //   'Error fetching departments with locations:',
      //   status,
      //   error
      // );
    },
  });
}
// AJAX request to getAllLocations.php
function populateLocationsTable() {
  const $locationTableBody = $('#locationTableBody');
  $locationTableBody.empty();

  $.ajax({
    url: 'libs/php/getAllLocations.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        response.data.forEach((location) => {
          const rowHtml = `
            <tr>
              <td class="align-middle text-nowrap">${
                location.name || 'Unknown'
              }</td>
              <td class="align-middle text-end text-nowrap">
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${
                  location.id
                }">
                  <i class="fa-solid fa-pencil fa-fw"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm deleteLocationBtn" data-id="${
                  location.id
                }">
                  <i class="fa-solid fa-trash fa-fw"></i>
                </button>
              </td>
            </tr>
          `;
          $locationTableBody.append(rowHtml);
        });
      } else {
        // console.error(
        //   'Failed to fetch locations:',
        //   response.status.description
        // );
      }
    },
    error: function (xhr, status, error) {
      // console.error('Error fetching locations:', status, error);
    },
  });
}
// Calls each of the above populate table functions
function fetchAllData() {
  populatePersonnelTable();
  populateDepartmentsTable();
  populateLocationsTable();
}
// Calls fetchAllData on page load
document.addEventListener('DOMContentLoaded', fetchAllData);

// -----------------  Search Bar Functionality  ----------------

// Populates tables based off search bar input
function populateSearchResults(data) {
  // Clear all table bodies
  $('#personnelTableBody').empty();
  $('#departmentTableBody').empty();
  $('#locationTableBody').empty();

  // Populate Personnel Table
  data.forEach((item) => {
    if (item.firstName && item.lastName) {
      const personnelRow = `
        <tr>
          <td class="align-middle text-nowrap">${item.lastName || 'N/A'}, ${
        item.firstName || 'N/A'
      }</td>
          <td class="align-middle text-nowrap d-md-table-cell">${
            item.departmentName || 'N/A'
          }</td>
          <td class="align-middle text-nowrap d-md-table-cell">${
            item.locationName || 'N/A'
          }</td>
          <td class="align-middle text-nowrap d-md-table-cell">${
            item.jobTitle || 'N/A'
          }</td>
          <td class="align-middle text-nowrap d-md-table-cell">${
            item.email || 'N/A'
          }</td>
          <td class="text-end text-nowrap">
              <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${
                item.id || ''
              }">
                  <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${
                item.id || ''
              }">
                  <i class="fa-solid fa-trash fa-fw"></i>
              </button>
          </td>
        </tr>
      `;
      $('#personnelTableBody').append(personnelRow);
    }
  });

  // Populate Departments Table
  const uniqueDepartments = new Map();
  data.forEach((item) => {
    if (item.departmentName && item.locationName) {
      const key = `${item.departmentID}-${item.locationID}`;
      if (!uniqueDepartments.has(key)) {
        uniqueDepartments.set(key, {
          departmentName: item.departmentName,
          locationName: item.locationName,
        });
        const departmentRow = `
          <tr>
            <td class="align-middle text-nowrap">${item.departmentName}</td>
            <td class="align-middle text-nowrap d-md-table-cell">${item.locationName}</td>
            <td class="align-middle text-end text-nowrap">
              <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${item.departmentID}">
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="${item.departmentID}">
                <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            </td>
          </tr>
        `;
        $('#departmentTableBody').append(departmentRow);
      }
    }
  });

  // Populate Locations Table
  const uniqueLocations = new Map();
  data.forEach((item) => {
    if (item.locationName) {
      if (!uniqueLocations.has(item.locationID)) {
        uniqueLocations.set(item.locationID, item.locationName);
        const locationRow = `
          <tr>
            <td class="align-middle text-nowrap">${item.locationName}</td>
            <td class="align-middle text-end text-nowrap">
              <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${item.locationID}">
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm deleteLocationBtn" data-id="${item.locationID}">
                <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            </td>
          </tr>
        `;
        $('#locationTableBody').append(locationRow);
      }
    }
  });
}
// Used if no results are available from user's search bar query
function showNoResultsMessage(tableSelector, message) {
  const $tableBody = $(tableSelector);
  // Remove existing "no results" row if present
  $tableBody.find('.no-results').remove();

  const visibleRows = $tableBody.find('tr:visible').length;
  // Append "No Results" message only if no visible rows exist
  if (visibleRows === 0) {
    $tableBody.append(
      `<tr class="no-results"><td colspan="100%" class="text-center">${message}</td></tr>`
    );
  }
}
// Filters search bar results and toggles clear search button visibility
$('#searchInp').on('keyup', function () {
  const searchTerm = $(this).val().trim().toLowerCase();

  if (searchTerm.length > 0) {
    $('#clearSearch').show();
  } else {
    $('#clearSearch').hide();
  }

  $('#personnelTableBody tr').each(function () {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(searchTerm));
  });
  showNoResultsMessage('#personnelTableBody', 'No matching personnel found.');

  $('#departmentTableBody tr').each(function () {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(searchTerm));
  });
  showNoResultsMessage(
    '#departmentTableBody',
    'No matching departments found.'
  );

  $('#locationTableBody tr').each(function () {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(searchTerm));
  });
  showNoResultsMessage('#locationTableBody', 'No matching locations found.');
});
// Hooks into tab events to remove any lingering 'No Results' messages
$('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
  $('.no-results').remove();
  const activeTab = $(this).data('bs-target');

  if (activeTab === '#personnel-tab-pane') {
    showNoResultsMessage('#personnelTableBody', 'No matching personnel found.');
  } else if (activeTab === '#departments-tab-pane') {
    showNoResultsMessage(
      '#departmentTableBody',
      'No matching departments found.'
    );
  } else if (activeTab === '#locations-tab-pane') {
    showNoResultsMessage('#locationTableBody', 'No matching locations found.');
  }
});
// Clears search bar and removes search term filters
$('#clearSearch').on('click', function () {
  $('#searchInp').val('');
  $(this).hide();
  $(
    '#personnelTableBody tr, #departmentTableBody tr, #locationTableBody tr'
  ).show();
  $('.no-results').remove();
});

// ----------------- Refresh Button Functionality  ----------------

// Refreshes info for all tables
$('#refreshBtn').click(function () {
  $('#searchInp').val('');
  $('#clearSearch').hide();
  fetchAllData();
});

// ----------------- Filter Button Functionality  ----------------

//Event handler filter modal
$('#filterBtn').click(function () {
  const $filterContent = $('#filterContent');

  if ($('#personnelBtn').hasClass('active')) {
    changeModalTitle('Filter Personnel');
    // Filter for Personnel Table
    $filterContent.html(`
      <div class="mb-3">
        <label for="filterDepartment" class="form-label">Department</label>
        <select id="filterDepartment" class="form-select">
          <option value="">All Departments</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="filterLocation" class="form-label">Location</label>
        <select id="filterLocation" class="form-select">
          <option value="">All Locations</option>
        </select>
      </div>
    `);

    // Dynamically add the Job Title filter if job titles exist in the DB
    $.ajax({
      url: 'libs/php/getAllJobTitles.php',
      method: 'GET',
      dataType: 'json',
      success: function (response) {
        if (response.status.code === 200 && response.data.length > 0) {
          $filterContent.append(`
            <div class="mb-3">
              <label for="filterJobTitle" class="form-label">Job Title</label>
              <select id="filterJobTitle" class="form-select">
                <option value="">All Job Titles</option>
              </select>
            </div>
          `);

          const $jobTitleDropdown = $('#filterJobTitle');
          response.data.forEach((jobTitle) => {
            $jobTitleDropdown.append(
              `<option value="${jobTitle.name}">${jobTitle.name}</option>`
            );
          });
        }
      },
      error: function () {
        // console.error('Failed to load job titles.');
      },
    });
  } else if ($('#departmentsBtn').hasClass('active')) {
    changeModalTitle('Filter Departments');
    // Filter for Departments Table
    $filterContent.html(`
      <div class="mb-3">
        <label for="filterLocation" class="form-label">Location</label>
        <select id="filterLocation" class="form-select">
          <option value="">All Locations</option>
        </select>
      </div>
    `);
  }

  populateFilterDropdowns();
});
// AJAX reqs to getAllDepartments.php / getAllLocations.php to populate filter modal dropdown menu
function populateFilterDropdowns() {
  let ajaxCallsRemaining = 2;

  function onDropdownsPopulated() {
    // Show the modal only when all dropdowns have been populated
    if (ajaxCallsRemaining === 0) {
      $('#filterModal').modal('show');
    }
  }

  // Populate Department Dropdown
  $.ajax({
    url: 'libs/php/getAllDepartments.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const $departmentDropdown = $('#filterDepartment');
        if ($departmentDropdown.length) {
          $departmentDropdown.empty();
          $departmentDropdown.append(
            '<option value="">All Departments</option>'
          );
          response.data.forEach((department) => {
            $departmentDropdown.append(
              `<option value="${department.id}">${department.name}</option>`
            );
          });
        }
      } else {
        // console.error(
        //   'Failed to load departments:',
        //   response.status.description
        // );
        return;
      }
    },
    error: function () {
      // console.error('Failed to load departments.');
      return;
    },
    complete: function () {
      ajaxCallsRemaining--;
      onDropdownsPopulated();
    },
  });

  // Populate Location Dropdown
  $.ajax({
    url: 'libs/php/getAllLocations.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const $locationDropdown = $('#filterLocation');
        if ($locationDropdown.length) {
          $locationDropdown.empty();
          $locationDropdown.append('<option value="">All Locations</option>');
          response.data.forEach((location) => {
            $locationDropdown.append(
              `<option value="${location.id}">${location.name}</option>`
            );
          });
        }
      } else {
        // console.error('Failed to load locations:', response.status.description);
      }
    },
    error: function () {
      // console.error('Failed to load locations.');
    },
    complete: function () {
      ajaxCallsRemaining--;
      onDropdownsPopulated();
    },
  });
}
// Disables filter button when locations tab is active
function toggleFilterButtonState() {
  if ($('#locationsBtn').hasClass('active')) {
    $('#filterBtn').prop('disabled', true); // Disable the filter button
  } else {
    $('#filterBtn').prop('disabled', false); // Enable the filter button
  }
}
// Initialize filter button state on page load
$(document).ready(function () {
  toggleFilterButtonState();
});
// Calls toggleFilterButtonState() when user changes tab
$('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
  toggleFilterButtonState();
});
// Changes the filter modal title
function changeModalTitle(newTitle) {
  $('#filterModal .modal-title').text(newTitle);
}
// AJAX reqs to filterPersonnel.php / filterDepartments.php to retrieve filtered results
$('#applyFilter').click(function () {
  const selectedDepartmentID = $('#filterDepartment').val();
  const selectedLocationID = $('#filterLocation').val();
  const selectedJobTitle = $('#filterJobTitle').length
    ? $('#filterJobTitle').val()
    : null;

  if ($('#personnelBtn').hasClass('active')) {
    // Filter Personnel Table
    $.ajax({
      url: 'libs/php/filterPersonnel.php',
      method: 'GET',
      data: {
        departmentID: selectedDepartmentID || '',
        locationID: selectedLocationID || '',
        jobTitle: selectedJobTitle || '',
      },
      dataType: 'json',
      success: function (response) {
        if (response.status.code === '200') {
          const filteredData = response.data.filtered;

          // Clear and repopulate Personnel Table
          $('#personnelTableBody').empty();
          filteredData.forEach((person) => {
            const rowHtml = `
              <tr>
                <td class="align-middle text-nowrap">${
                  person.lastName || 'N/A'
                }, ${person.firstName || 'N/A'}</td>
                <td class="align-middle text-nowrap d-md-table-cell">${
                  person.jobTitle || ''
                }</td>
                <td class="align-middle text-nowrap d-md-table-cell">${
                  person.departmentName || 'N/A'
                }</td>
                <td class="align-middle text-nowrap d-md-table-cell">${
                  person.locationName || 'N/A'
                }</td>
                <td class="align-middle text-nowrap d-md-table-cell">${
                  person.email || 'N/A'
                }</td>
                <td class="text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${
                    person.id || ''
                  }">
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${
                    person.id || ''
                  }">
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>
            `;
            $('#personnelTableBody').append(rowHtml);
          });

          $('#filterModal').modal('hide');
        } else {
          // console.error(
          //   'Failed to filter personnel:',
          //   response.status.description
          // );
        }
      },
      error: function (xhr, status, error) {
        // console.error('Error during personnel filter request:', status, error);
      },
    });
  } else if ($('#departmentsBtn').hasClass('active')) {
    // Filter Departments Table
    $.ajax({
      url: 'libs/php/filterDepartments.php',
      method: 'GET',
      data: {
        locationID: selectedLocationID || '',
        departmentID: selectedDepartmentID || '',
      },
      dataType: 'json',
      success: function (response) {
        if (response.status.code === '200') {
          const filteredData = response.data.filtered;

          $('#departmentTableBody').empty();
          filteredData.forEach((department) => {
            const rowHtml = `
              <tr>
                <td class="align-middle text-nowrap">${department.departmentName}</td>
                <td class="align-middle text-nowrap d-md-table-cell">${department.locationName}</td>
                <td class="align-middle text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${department.departmentID}">
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="${department.departmentID}">
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>
            `;
            $('#departmentTableBody').append(rowHtml);
          });

          $('#filterModal').modal('hide');
        } else {
          // console.error(
          //   'Failed to filter departments:',
          //   response.status.description
          // );
        }
      },
      error: function (xhr, status, error) {
        // console.error('Error during department filter request:', status, error);
      },
    });
  }
});

// -----------------  Add Button Functionality  ----------------

// Used for formatting names before submission to DB
function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
// Resets and shows add modal, depending on currently open tab
$('#addBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    $('#addPersonnelForm')[0].reset();
    populateAddPersonnelDropdowns();
    $('#addPersonnelModal').modal('show');
  } else if ($('#departmentsBtn').hasClass('active')) {
    $('#addDepartmentForm')[0].reset();
    populateAddDepartmentDropdowns();
    $('#addDepartmentModal').modal('show');
  } else if ($('#locationsBtn').hasClass('active')) {
    $('#addLocationForm')[0].reset();
    $('#addLocationModal').modal('show');
  } else {
    // console.log('Add functionality not implemented for this tab.');
  }
});
// AJAX calls to populate department and location dropdowns for add personnel
function populateAddPersonnelDropdowns(callback) {
  let ajaxCallsRemaining = 2;

  function onDropdownsPopulated() {
    if (ajaxCallsRemaining === 0 && typeof callback === 'function') {
      callback(); // Execute the callback after both dropdowns are populated
    }
  }

  // Populate Department Dropdown
  $.ajax({
    url: 'libs/php/getAllDepartments.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const $departmentDropdown = $('#addDepartment');
        $departmentDropdown.empty();
        $departmentDropdown.append(
          '<option value="">Select a department</option>'
        );
        response.data.forEach((department) => {
          $departmentDropdown.append(
            `<option value="${department.id}">${department.name}</option>`
          );
        });
      } else {
        // console.error(
        //   'Failed to load departments:',
        //   response.status.description
        // );
      }
    },
    error: function () {
      // console.error('Failed to load departments.');
    },
    complete: function () {
      ajaxCallsRemaining--;
      onDropdownsPopulated();
    },
  });

  // Populate Location Dropdown
  $.ajax({
    url: 'libs/php/getAllLocations.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const $locationDropdown = $('#addLocation');
        $locationDropdown.empty();
        $locationDropdown.append('<option value="">Select a location</option>');
        response.data.forEach((location) => {
          $locationDropdown.append(
            `<option value="${location.id}">${location.name}</option>`
          );
        });
      } else {
        // console.error('Failed to load locations:', response.status.description);
      }
    },
    error: function () {
      // console.error('Failed to load locations.');
    },
    complete: function () {
      ajaxCallsRemaining--;
      onDropdownsPopulated();
    },
  });
}
// AJAX call to populate location dropdown for add department
function populateAddDepartmentDropdowns() {
  $.ajax({
    url: 'libs/php/getAllLocations.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const $locationDropdown = $('#addDepartmentLocation');
        $locationDropdown.empty();
        $locationDropdown.append('<option value="">Select a location</option>');
        response.data.forEach((location) => {
          $locationDropdown.append(
            `<option value="${location.id}">${location.name}</option>`
          );
        });
      }
    },
    error: function () {
      // console.error('Failed to load locations.');
    },
  });
}
// When new personnel details are added, sends data to insertPersonnel.php after vaildating location/dept association
$('#savePersonnelBtn').click(function () {
  let firstName = $('#addFirstName').val().trim();
  let lastName = $('#addLastName').val().trim();
  const departmentID = $('#addDepartment').val();
  const email = $('#addEmail').val().trim();
  const locationID = $('#addLocation').val();
  const jobTitle = $('#addJobTitle').val().trim();

  $('#addPersonnelModal').modal('hide');

  if (!firstName || !lastName || !departmentID || !email || !locationID) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('Please fill out all required fields.');
    $('#messageModal').modal('show');
    return;
  }

  firstName = capitaliseFirstLetter(firstName);
  lastName = capitaliseFirstLetter(lastName);

  // Validate location and department association
  $.ajax({
    url: 'libs/php/validateDepartmentLocation.php',
    method: 'POST',
    data: {
      departmentID: departmentID,
      locationID: locationID,
    },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '400') {
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text(response.status.description);
        $('#messageModal').modal('show');
        return;
      }

      $.ajax({
        url: 'libs/php/insertPersonnel.php',
        method: 'POST',
        data: {
          firstName,
          lastName,
          departmentID,
          email,
          locationID,
          jobTitle,
        },
        dataType: 'json',
        success: function (response) {
          if (response.status.code === '200') {
            populatePersonnelTable();

            $('#messageModal .modal-title').text('Success');
            $('#messageContent').text('Personnel added successfully!');
            $('#messageModal').modal('show');
          } else {
            $('#messageModal .modal-title').text('Error');
            $('#messageContent').text(
              'Failed to add personnel. Please try again. Note only admins may perform this action.'
            );
            $('#messageModal').modal('show');
            $('#searchInp').val('');
          }
        },
        error: function (xhr, status, error) {
          // console.error('Error during add request:', status, error);
          $('#messageModal .modal-title').text('Error');
          $('#messageContent').text(
            'An error occurred while adding personnel. Please try again.'
          );
          $('#messageModal').modal('show');
        },
      });
    },
    error: function (xhr, status, error) {
      // console.error('Error validating department and location:', status, error);
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text(
        'Failed to validate department and location. Please try again.'
      );
      $('#messageModal').modal('show');
    },
  });
});
// When new department details are added, sends data to insertDepartment.php after vailidating identical dept does not exist in DB already
$('#saveDepartmentBtn').click(function () {
  const departmentName = $('#addDepartmentName').val().trim();
  const locationID = $('#addDepartmentLocation').val();

  $('#addDepartmentModal').modal('hide');

  if (!departmentName || !locationID) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('Please fill out all required fields.');
    $('#messageModal').modal('show');
    return;
  }

  const formattedDepartmentName = capitaliseFirstLetter(departmentName);

  // Validate department name and location association
  $.ajax({
    url: 'libs/php/validateDepartmentLocationByName.php',
    method: 'POST',
    data: {
      name: formattedDepartmentName,
      locationID: locationID,
    },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '400') {
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text(response.status.description);
        $('#messageModal').modal('show');
        return;
      }

      $.ajax({
        url: 'libs/php/insertDepartment.php',
        method: 'POST',
        data: {
          name: formattedDepartmentName,
          locationID: locationID,
        },
        dataType: 'json',
        success: function (response) {
          if (response.status.code === '200') {
            populateDepartmentsTable();

            $('#messageModal .modal-title').text('Success');
            $('#messageContent').text('Department added successfully!');
            $('#messageModal').modal('show');
          } else {
            $('#messageModal .modal-title').text('Error');
            $('#messageContent').text(
              'Failed to add department. Please try again.'
            );
            $('#messageModal').modal('show');
            $('#searchInp').val('');
          }
        },
        error: function (xhr, status, error) {
          // console.error('Error during add request:', status, error);
          $('#messageModal .modal-title').text('Error');
          $('#messageContent').text(
            'An error occurred while adding the department. Please try again.'
          );
          $('#messageModal').modal('show');
        },
      });
    },
    error: function (xhr, status, error) {
      // console.error('Error validating department and location:', status, error);
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text(
        'Failed to validate department and location. Please try again.'
      );
      $('#messageModal').modal('show');
    },
  });
});
// Function to capitalize the first letter of each word
function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
// When new location details are added, sends data to insertLocation.php after formatting the name
$('#saveLocationBtn').click(function () {
  const locationName = $('#addLocationName').val().trim();

  $('#addLocationModal').modal('hide');

  if (!locationName) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('Please enter a location name.');
    $('#messageModal').modal('show');
    return;
  }

  const formattedLocationName = locationName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  $.ajax({
    url: 'libs/php/insertLocation.php',
    method: 'POST',
    data: {
      name: formattedLocationName,
    },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        populateLocationsTable();

        $('#messageModal .modal-title').text('Success');
        $('#messageContent').text('Location added successfully!');
        $('#messageModal').modal('show');
        $('#searchInp').val('');
      } else if (response.status.code === '400') {
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text(response.status.description);
        $('#messageModal').modal('show');
        $('#searchInp').val('');
      } else {
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text('Failed to add location. Please try again.');
        $('#messageModal').modal('show');
        $('#searchInp').val('');
      }
    },
    error: function (xhr, status, error) {
      //console.error('Error during add request:', status, error);
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text(
        'An error occurred while adding the location. Please try again.'
      );
      $('#messageModal').modal('show');
    },
  });
});

// -----------------  Refresh Functions  ---------------------

// Refresh the corresponding tab when clicked:
$('#personnelBtn').click(function () {
  populatePersonnelTable();
});
$('#departmentsBtn').click(function () {
  populateDepartmentsTable();
});
$('#locationsBtn').click(function () {
  populateLocationsTable();
});

// -----------------  Edit Functionality  ---------------------

// ----- Edit Personnel -----

// Opens edit personnel modal and calls populateEditModal with data-id button attribute
$('#editPersonnelModal').on('show.bs.modal', function (event) {
  const button = $(event.relatedTarget);
  const employeeId = button.data('id');
  if (employeeId) {
    populateEditModal(employeeId);
  } else {
    // console.error('No employee ID found for this button.');
  }
});
// AJAX req to getPersonnelByID.php to populate edit modal dropdowns
function populateEditModal(employeeId) {
  $.ajax({
    url: 'libs/php/getPersonnelByID.php',
    method: 'POST',
    data: { id: employeeId },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const employee = response.data.personnel[0];
        const departments = response.data.department;

        $('#editPersonnelEmployeeID').val(employee.id);
        $('#editPersonnelFirstName').val(employee.firstName);
        $('#editPersonnelLastName').val(employee.lastName);
        $('#editPersonnelJobTitle').val(employee.jobTitle);
        $('#editPersonnelEmailAddress').val(employee.email);

        const $departmentSelect = $('#editPersonnelDepartment');
        $departmentSelect.empty();

        departments.forEach((department) => {
          const isSelected =
            parseInt(department.id) === parseInt(employee.departmentID)
              ? 'selected'
              : '';
          $departmentSelect.append(
            `<option value="${department.id}" ${isSelected}>${department.name}</option>`
          );
        });
      } else {
        // console.error(
        //   'Failed to fetch employee details:',
        //   response.status.description
        // );
      }
    },
    error: function (xhr, status, error) {
      // console.error('Error fetching employee details:', status, error);
    },
  });
}
// AJAX req to getLocationByDepartmentID.php, finds assosiated location for department
$('#editPersonnelDepartment').on('change', function () {
  const selectedDepartmentId = $(this).val();

  $.ajax({
    url: 'libs/php/getLocationByDepartmentID.php',
    method: 'POST',
    data: { departmentID: selectedDepartmentId },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        return;
      } else {
        // console.error(
        //   'Failed to fetch location details:',
        //   response.status.description
        // );
      }
    },
    error: function (xhr, status, error) {
      // console.error('Error fetching location details:', status, error);
    },
  });
});
// AJAX req to updatePersonnel.php when edit form is submitted
$('#editPersonnelForm').on('submit', function (e) {
  e.preventDefault();
  const searchTerm = $('#searchInp').val();

  if (searchTerm.length > 0) {
    $('#searchInp').val('');
    $('#clearSearch').hide();
  }

  const employeeData = {
    id: $('#editPersonnelEmployeeID').val(),
    firstName: $('#editPersonnelFirstName').val(),
    lastName: $('#editPersonnelLastName').val(),
    jobTitle: $('#editPersonnelJobTitle').val() || '',
    email: $('#editPersonnelEmailAddress').val(),
    departmentID: $('#editPersonnelDepartment').val(),
  };

  $.ajax({
    url: 'libs/php/updatePersonnel.php',
    type: 'POST',
    data: employeeData,
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        $('#messageContent').text(response.status.description);
        $('#messageModal').modal('show');
        $('#editPersonnelModal').modal('hide');
        populatePersonnelTable();
      } else {
        $('#editPersonnelModal').modal('hide');
        $('#messageContent').text(response.status.description);
        $('#messageModal').modal('show');
        $('#searchInp').val('');
      }
    },
    error: function () {
      $('#editPersonnelModal').modal('hide');
      $('#messageContent').text(
        'An error occurred while updating the employee.'
      );
      $('#messageModal').modal('show');
    },
  });
});

// ---- Edit Departments ----

// AJAX req to getAllLocations.php, populates locations with current location as default
function populateLocationsDropdown(preselectedLocationID) {
  // console.log('preSelectedLocationID: ' + preselectedLocationID);
  $.ajax({
    url: 'libs/php/getAllLocations.php',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const $locationDropdown = $('#editDepartmentLocation');
        $locationDropdown.empty();

        response.data.forEach((location) => {
          const isSelected =
            Number(location.id) === Number(preselectedLocationID)
              ? 'selected'
              : '';
          const option = `<option value="${location.id}" ${isSelected}>${location.name}</option>`;
          $locationDropdown.append(option);
        });
      } else {
        // console.error(
        //   'Failed to fetch locations:',
        //   response.status.description
        // );
      }
    },
    error: function (xhr, status, error) {
      // console.error('Error fetching locations:', status, error);
    },
  });
}
// AJAX req to getDepartmentByID.php and calls populateLocationsDropdown() to populate edit dept modal
$('#editDepartmentModal').on('show.bs.modal', function (event) {
  const button = $(event.relatedTarget);
  const departmentID = button.data('id');

  $('#editDepartmentID').val('');
  $('#editDepartmentName').val('');
  $('#editDepartmentLocation').empty();

  $.ajax({
    url: 'libs/php/getDepartmentByID.php',
    type: 'POST',
    data: { id: departmentID },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200' && response.data.length > 0) {
        const department = response.data[0];

        $('#editDepartmentID').val(department.id);
        $('#editDepartmentName').val(department.name);
        // console.log(
        //   'Calling populateLocationsDropdown with:',
        //   department.locationID
        // );
        populateLocationsDropdown(department.locationID);
      } else {
        // console.error(
        //   'Failed to fetch department details:',
        //   response.status.description
        // );
        $('#messageContent').text(
          'Failed to fetch department details. Please try again.'
        );
        $('#editDepartmentModal').modal('hide');
        $('#messageModal').modal('show');
      }
    },
    error: function (xhr, status, error) {
      // console.error('Error fetching department details:', status, error);
      $('#messageContent').text(
        'An error occurred while fetching department details.'
      );
      $('#editDepartmentModal').modal('hide');
      $('#messageModal').modal('show');
    },
  });
});
// AJAX req to updateDepartment.php
$('#editDepartmentForm').on('submit', function (e) {
  e.preventDefault();
  $('#editDepartmentModal').modal('hide');

  const departmentData = {
    departmentID: $('#editDepartmentID').val(),
    name: $('#editDepartmentName').val().trim(),
    locationID: $('#editDepartmentLocation').val(),
  };

  if (
    !departmentData.departmentID ||
    !departmentData.name ||
    !departmentData.locationID
  ) {
    // console.log('Department Data' + departmentData);
    $('#messageContent').text(
      'Please provide a valid department ID, name, and location.'
    );
    $('#messageModal').modal('show');
    $('#editDepartmentModal').modal('hide');
    return;
  }

  $.ajax({
    url: 'libs/php/updateDepartment.php',
    type: 'POST',
    data: departmentData,
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        $('#messageContent').text(response.status.description);
        $('#messageModal').modal('show');
        $('#editDepartmentModal').modal('hide');
        populateDepartmentsTable();
      } else {
        $('#messageContent').text(
          response.status.description || 'An error occurred.'
        );
        $('#messageModal').modal('show');
      }
    },
    error: function (xhr, status, error) {
      $('#editDepartmentModal').modal('hide');
      $('#messageContent').text(
        'An error occurred while updating the department.'
      );
      $('#messageModal').modal('show');
    },
  });
});

//  ----- Edit Locations ----

let locationId = null;

// AJAX req to getLocationByID.php to obtain location name from ID attribute of button
$('#editLocationModal').on('show.bs.modal', function (e) {
  const button = $(e.relatedTarget);
  locationID = button.data('id');

  $.ajax({
    url: 'libs/php/getLocationByID.php',
    type: 'GET',
    data: { id: locationID },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200' && response.data.length > 0) {
        const location = response.data[0];

        $('#editLocationName').val(location.name);

        $('#editLocationModal').modal('show');
      } else {
        // console.error(
        //   'Failed to fetch location details:',
        //   response.status.description
        // );
      }
    },
    error: function (xhr, status, error) {
      // console.error('Error fetching location details:', status, error);
    },
  });
});
// AJAX req to updateLocation.php on form submit
$('#editLocationForm').on('submit', function (e) {
  // console.log('Form submitted');
  $('#editLocationModal').modal('hide');
  e.preventDefault();

  const locationData = {
    id: locationID,
    name: $('#editLocationName').val().trim(),
  };
  if (!locationData.name) {
    $('#messageContent').text('Please provide a valid location name.');
    $('#messageModal').modal('show');
    return;
  }

  $.ajax({
    url: 'libs/php/updateLocation.php',
    type: 'POST',
    data: locationData,
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        $('#messageContent').text(response.status.description);
        $('#messageModal').modal('show');
        $('#editLocationModal').modal('hide');
        populateLocationsTable();
      } else if (response.status.code === '400') {
        $('#messageContent').text(response.status.description);
        $('#messageModal').modal('show');
      } else {
        $('#messageContent').text(
          response.status.description || 'An error occurred.'
        );
        $('#messageModal').modal('show');
      }
    },
    error: function (xhr, status, error) {
      $('#editLocationModal').modal('hide');
      $('#messageContent').text(
        'An error occurred while updating the location.'
      );
      $('#messageModal').modal('show');
    },
  });
});

// ------------------ Delete Functionality ---------------------

// Global variables to track ID and type of item being deleted, used by the confirm delete modal
let itemToDelete = null;
let deleteType = null;

// Handle delete button clicks for Personnel
$('#personnelTableBody').on('click', '.deletePersonnelBtn', function () {
  itemToDelete = $(this).data('id');
  deleteType = 'personnel';

  $('#confirmDeleteModal .modal-body p').text(
    'Are you sure you want to delete this personnel record?'
  );

  $('#confirmDeleteModal').modal('show');
});
// Handle delete button clicks for Locations
$('#locationTableBody').on('click', '.deleteLocationBtn', function () {
  itemToDelete = $(this).data('id');
  deleteType = 'location';

  $('#confirmDeleteModal .modal-body p').text(
    'Are you sure you want to delete this location?'
  );

  $('#confirmDeleteModal').modal('show');
});
// Handle delete button clicks for Departments
$('#departmentTableBody').on('click', '.deleteDepartmentBtn', function () {
  itemToDelete = $(this).data('id');
  deleteType = 'department';

  $('#confirmDeleteModal .modal-body p').text(
    'Are you sure you want to delete this department?'
  );

  $('#confirmDeleteModal').modal('show');
});
// Handle 'show.bs.modal' to reset the confirmation button then calls confirmDeletion() if user confirms
$('#confirmDeleteModal').on('show.bs.modal', function () {
  $('#confirmDeleteBtn')
    .off('click')
    .on('click', function () {
      confirmDeletion(); // Call the appropriate delete function
    });
});
// Function to confirm and handle deletion, handles location, dept and personnel
function confirmDeletion() {
  if (!itemToDelete || !deleteType) return;
  $('#confirmDeleteModal').modal('hide');

  let url = '';
  let successMessage = '';
  let errorMessage = '';

  if (deleteType === 'personnel') {
    url = 'libs/php/deletePersonnel.php';
    successMessage = 'Personnel record deleted successfully.';
    errorMessage = 'Failed to delete personnel record.';
  } else if (deleteType === 'location') {
    url = 'libs/php/deleteLocation.php';
    successMessage = 'Location deleted successfully.';
    errorMessage =
      'This location cannot be deleted because it has dependent departments.';
  } else if (deleteType === 'department') {
    url = 'libs/php/deleteDepartment.php';
    successMessage = 'Department deleted successfully.';
    errorMessage =
      'This department cannot be deleted because it has associated personnel.';
  }

  $.ajax({
    url: url,
    type: 'POST',
    data: { id: itemToDelete },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        // Show success modal
        $('#messageModal .modal-title').text('Success');
        $('#messageContent').text(successMessage);
        $('#messageModal').modal('show');

        // Refresh the appropriate table
        if (deleteType === 'personnel') populatePersonnelTable();
        if (deleteType === 'location') populateLocationsTable();
        if (deleteType === 'department') populateDepartmentsTable();
      } else {
        // Handle dependency or other errors
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text(response.status.description || errorMessage);
        $('#messageModal').modal('show');
      }
    },
    error: function () {
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text(
        'An error occurred while processing your request.'
      );
      $('#messageModal').modal('show');
    },
  });
}

// -------------------------------------------------------------

// Handle modal behaviour
$(document).on('click', '#messageModalOkButton', function () {
  $('#messageModal').modal('hide');
});
$(document).on('keydown', function (event) {
  if (event.key === 'Enter') {
    // Check if a modal is currently open
    if ($('.modal.show').length) {
      event.preventDefault(); // Prevent the default form submission or modal closing
    }
  }
});

// CLEAR CONSOLE OF ERRORS AND LOGS
