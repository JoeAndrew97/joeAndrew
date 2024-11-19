// AJAX request to getAll.php
function populatePersonnelTable() {
  const $personnelTableBody = $('#personnelTableBody');
  $personnelTableBody.empty(); // Clear any existing rows

  // Fetch the latest data from the server
  $.ajax({
    url: 'libs/php/getAll.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        // Populate the table with the fetched data
        response.data.forEach((person) => {
          const rowHtml = `
            <tr>
              <td class="align-middle text-nowrap">${
                person.lastName || 'N/A'
              }, ${person.firstName || 'N/A'}</td>
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
          $personnelTableBody.append(rowHtml);
        });
      } else {
        console.error(
          'Failed to fetch personnel data:',
          response.status.description
        );
      }
    },
    error: function (xhr, status, error) {
      console.error('Error fetching personnel data:', status, error);
    },
  });
}

// AJAX request to getDepartmentsWithLocations.php
function populateDepartmentsTable() {
  const $departmentsTableBody = $('#departmentTableBody');
  $departmentsTableBody.empty(); // Clear any existing rows

  // Fetch the latest department and location data
  $.ajax({
    url: 'libs/php/getDepartmentsWithLocations.php', // Endpoint to fetch department and location data
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        // Populate the table with the fetched data
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
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${
                  department.departmentID
                }">
                  <i class="fa-solid fa-pencil fa-fw"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="${
                  department.departmentID
                }">
                  <i class="fa-solid fa-trash fa-fw"></i>
                </button>
              </td>
            </tr>
          `;
          $departmentsTableBody.append(rowHtml);
        });
      } else {
        console.error(
          'Failed to fetch departments with locations:',
          response.status.description
        );
      }
    },
    error: function (xhr, status, error) {
      console.error(
        'Error fetching departments with locations:',
        status,
        error
      );
    },
  });
}

// AJAX request to getAllLocations.php
function populateLocationsTable() {
  const $locationTableBody = $('#locationTableBody');
  $locationTableBody.empty(); // Clear any existing rows

  // Fetch the latest location data from the server
  $.ajax({
    url: 'libs/php/getAllLocations.php', // Endpoint to fetch location data
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        // Populate the table with the fetched data
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
        console.error(
          'Failed to fetch locations:',
          response.status.description
        );
      }
    },
    error: function (xhr, status, error) {
      console.error('Error fetching locations:', status, error);
    },
  });
}

// Calls each of the above populate table functions
function fetchAllData() {
  populatePersonnelTable();
  populateDepartmentsTable();
  populateLocationsTable();
}

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

  // Count visible rows
  const visibleRows = $tableBody.find('tr:visible').length;

  // Append "No Results" message only if no visible rows exist
  if (visibleRows === 0) {
    $tableBody.append(
      `<tr class="no-results"><td colspan="100%" class="text-center">${message}</td></tr>`
    );
  }
}

// Populate filter modal dropdown menu
function populateFilterDropdowns() {
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
              `<option value="${department.name}">${department.name}</option>`
            );
          });
        }
      }
    },
    error: function () {
      console.error('Failed to load departments.');
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
              `<option value="${location.name}">${location.name}</option>`
            );
          });
        }
      }
    },
    error: function () {
      console.error('Failed to load locations.');
    },
  });
}

// Calls fetchAllData on page load
document.addEventListener('DOMContentLoaded', fetchAllData);

// Disables fitler button when locations tab is active
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

// Calls toggleFilterButtonState() when user changed tab
$('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
  toggleFilterButtonState();
});

// Changes the filter modal title
function changeModalTitle(newTitle) {
  $('#filterModal .modal-title').text(newTitle);
}

// calls changeModalTitle() when filter button is clicked, depending on which tab is active
$('#filterBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    changeModalTitle('Filter Personnel');
  } else if ($('#departmentsBtn').hasClass('active')) {
    changeModalTitle('Filter Departments');
  }
  $('#filterModal').modal('show');
});

// Filters search bar results and toggles clear search button visibility
$('#searchInp').on('keyup', function () {
  const searchTerm = $(this).val().trim().toLowerCase();

  // Show or hide the "Clear Search" text based on input value
  if (searchTerm.length > 0) {
    $('#clearSearch').show();
  } else {
    $('#clearSearch').hide();
  }

  // Filter Personnel Table
  $('#personnelTableBody tr').each(function () {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(searchTerm));
  });
  showNoResultsMessage('#personnelTableBody', 'No matching personnel found.');

  // Filter Departments Table
  $('#departmentTableBody tr').each(function () {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(searchTerm));
  });
  showNoResultsMessage(
    '#departmentTableBody',
    'No matching departments found.'
  );

  // Filter Locations Table
  $('#locationTableBody tr').each(function () {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(searchTerm));
  });
  showNoResultsMessage('#locationTableBody', 'No matching locations found.');
});

// Hooks into tab events to remove any lingering 'No Results' messages
$('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
  // Remove any lingering "No Results" rows from all tables
  $('.no-results').remove();

  // Check for "No Results" in the active tab
  const activeTab = $(this).data('bs-target'); // Get the active tab pane selector

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

  // Show all rows in all tables
  $(
    '#personnelTableBody tr, #departmentTableBody tr, #locationTableBody tr'
  ).show();

  // Optionally remove "no results" messages
  $('.no-results').remove();
});

// Refreshes info for all tables
$('#refreshBtn').click(function () {
  // clear search bar
  $('#searchInp').val('');
  $('#clearSearch').hide();
  fetchAllData();
  // refresh table with 'active' class -- original code -- keep
  // if ($('#personnelBtn').hasClass('active')) {
  //   populatePersonnelTable();
  // } else {
  //   if ($('#departmentsBtn').hasClass('active')) {
  //     populateDepartmentsTable();
  //   } else {
  //     populateLocationsTable();
  //   }
  // }
});

// Calls eithr filterPersonnel.php or filterDepartment.php in order to apply filters
$('#applyFilter').click(function () {
  const selectedDepartment = $('#filterDepartment').val();
  const selectedLocation = $('#filterLocation').val();

  if ($('#personnelBtn').hasClass('active')) {
    // Filter Personnel Table
    $.ajax({
      url: 'libs/php/filterPersonnel.php',
      method: 'GET',
      data: {
        department: selectedDepartment,
        location: selectedLocation,
      },
      dataType: 'json',
      success: function (response) {
        if (response.status.code === '200') {
          const filteredData = response.data.filtered;

          // Clear and repopulate the Personnel Table
          $('#personnelTableBody').empty();
          filteredData.forEach((person) => {
            const rowHtml = `
              <tr>
                <td class="align-middle text-nowrap">${
                  person.lastName || 'N/A'
                }, ${person.firstName || 'N/A'}</td>
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

          // Close the modal
          $('#filterModal').modal('hide');
        }
      },
      error: function (xhr, status, error) {
        console.error('Error during filter request:', status, error);
      },
    });
  } else if ($('#departmentsBtn').hasClass('active')) {
    // Filter Departments Table
    $.ajax({
      url: 'libs/php/filterDepartments.php',
      method: 'GET',
      data: {
        location: selectedLocation, // Only location filter applies to departments
      },
      dataType: 'json',
      success: function (response) {
        if (response.status.code === '200') {
          const filteredData = response.data.filtered;

          // Clear and repopulate the Departments Table
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

          // Close the modal
          $('#filterModal').modal('hide');
        }
      },
      error: function (xhr, status, error) {
        console.error('Error during filter request:', status, error);
      },
    });
  }
});

// Opens filter modal and populates dropsdowns
$('#filterBtn').click(function () {
  const $filterContent = $('#filterContent');

  if ($('#personnelBtn').hasClass('active')) {
    // Filter for Personnel Table
    $filterContent.html(`
      <div class="mb-3">
        <label for="filterDepartment" class="form-label">Department</label>
        <select id="filterDepartment" class="form-select">
          <option value="">All Departments</option>
          <!-- Options will be dynamically added here -->
        </select>
      </div>
      <div class="mb-3">
        <label for="filterLocation" class="form-label">Location</label>
        <select id="filterLocation" class="form-select">
          <option value="">All Locations</option>
          <!-- Options will be dynamically added here -->
        </select>
      </div>
    `);
  } else if ($('#departmentsBtn').hasClass('active')) {
    // Filter for Departments Table
    $filterContent.html(`
      <div class="mb-3">
        <label for="filterLocation" class="form-label">Location</label>
        <select id="filterLocation" class="form-select">
          <option value="">All Locations</option>
          <!-- Options will be dynamically added here -->
        </select>
      </div>
    `);
  }

  // Populate dropdown options dynamically
  populateFilterDropdowns();

  // Open the modal
  $('#filterModal').modal('show');
});

// INCOMPLETE - Opens add modal for add button
$('#addBtn').click(function () {
  // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
});

// INCOMPLETE - Refreshes table when personnal tab button is clicked
$('#personnelBtn').click(function () {
  // Call function to refresh personnel table
});

// INCOMPLETE - Refreshes table when departmets tab button is clicked
$('#departmentsBtn').click(function () {
  // Call function to refresh department table
});

// INCOMPLETE - Refreshes table when locations tab button is clicked
$('#locationsBtn').click(function () {
  // Call function to refresh location table
});

// INCOMPLETE? - Opens edit personnel modal
$('#editPersonnelModal').on('show.bs.modal', function (e) {
  $.ajax({
    url: 'https://coding.itcareerswitch.co.uk/companydirectory/libs/php/getPersonnelByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: $(e.relatedTarget).attr('data-id'),
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $('#editPersonnelEmployeeID').val(result.data.personnel[0].id);

        $('#editPersonnelFirstName').val(result.data.personnel[0].firstName);
        $('#editPersonnelLastName').val(result.data.personnel[0].lastName);
        $('#editPersonnelJobTitle').val(result.data.personnel[0].jobTitle);
        $('#editPersonnelEmailAddress').val(result.data.personnel[0].email);

        $('#editPersonnelDepartment').html('');

        $.each(result.data.department, function () {
          $('#editPersonnelDepartment').append(
            $('<option>', {
              value: this.id,
              text: this.name,
            })
          );
        });

        $('#editPersonnelDepartment').val(
          result.data.personnel[0].departmentID
        );
      } else {
        $('#editPersonnelModal .modal-title').replaceWith(
          'Error retrieving data'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editPersonnelModal .modal-title').replaceWith(
        'Error retrieving data'
      );
    },
  });
});

// Executes when the form button with type="submit" is clicked
$('#editPersonnelForm').on('submit', function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
});
