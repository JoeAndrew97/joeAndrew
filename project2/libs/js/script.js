// Global variables to store selected filter values
let selectedDepartmentID = '0'; // Default to "All"
let selectedLocationID = '0'; // Default to "All"

// ----------------- Fetch Data and Populate Tables ----------------

// AJAX request to getAll.php
function populatePersonnelTable() {
  $('#searchInp').val('');
  $('#clearSearch').hide();
  const $personnelTableBody = $('#personnelTableBody');
  $personnelTableBody.empty();

  $.ajax({
    url: 'libs/php/getAll.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const frag = document.createDocumentFragment();

        response.data.forEach((person) => {
          const row = document.createElement('tr');

          const nameCell = document.createElement('td');
          nameCell.classList.add('align-middle', 'text-nowrap');
          nameCell.textContent = `${person.lastName || 'N/A'}, ${
            person.firstName || 'N/A'
          }`;
          row.appendChild(nameCell);

          const jobTitleCell = document.createElement('td');
          jobTitleCell.classList.add(
            'align-middle',
            'text-nowrap',
            'd-md-table-cell'
          );
          jobTitleCell.textContent = person.jobTitle || '';
          row.appendChild(jobTitleCell);

          const departmentCell = document.createElement('td');
          departmentCell.classList.add(
            'align-middle',
            'text-nowrap',
            'd-md-table-cell'
          );
          departmentCell.textContent = person.department || 'N/A';
          row.appendChild(departmentCell);

          const locationCell = document.createElement('td');
          locationCell.classList.add(
            'align-middle',
            'text-nowrap',
            'd-md-table-cell'
          );
          locationCell.textContent = person.location || 'N/A';
          row.appendChild(locationCell);

          const emailCell = document.createElement('td');
          emailCell.classList.add(
            'align-middle',
            'text-nowrap',
            'd-md-table-cell'
          );
          emailCell.textContent = person.email || 'N/A';
          row.appendChild(emailCell);

          const actionCell = document.createElement('td');
          actionCell.classList.add('text-end', 'text-nowrap');

          const editButton = document.createElement('button');
          editButton.type = 'button';
          editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'edit-btn');
          editButton.setAttribute('data-bs-toggle', 'modal');
          editButton.setAttribute('data-bs-target', '#editPersonnelModal');
          editButton.setAttribute('data-id', person.id || '');
          editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
          actionCell.appendChild(editButton);

          const deleteButton = document.createElement('button');
          deleteButton.type = 'button';
          deleteButton.classList.add(
            'btn',
            'btn-primary',
            'btn-sm',
            'deletePersonnelBtn'
          );
          deleteButton.setAttribute('data-id', person.id || '');
          deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
          actionCell.appendChild(deleteButton);

          row.appendChild(actionCell);
          frag.appendChild(row);
        });

        $personnelTableBody.append(frag);
        $('#searchInp').val('');
      } else {
        // console.error(
        //   'Failed to fetch personnel data:',
        //   response.status.description
        // );
      }
    },
    // error: function (xhr, status, error) {
    //   console.error('Error fetching personnel data:', status, error);
    // },
  });
}
// AJAX request to getDepartmentsWithLocations.php
function populateDepartmentsTable() {
  $('#searchInp').val('');
  $('#clearSearch').hide();
  const $departmentsTableBody = $('#departmentTableBody');
  $departmentsTableBody.empty();

  $.ajax({
    url: 'libs/php/getDepartmentsWithLocations.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const frag = document.createDocumentFragment();

        response.data.forEach((department) => {
          const row = document.createElement('tr');

          const departmentNameCell = document.createElement('td');
          departmentNameCell.classList.add('align-middle', 'text-nowrap');
          departmentNameCell.textContent =
            department.departmentName || 'Unknown';
          row.appendChild(departmentNameCell);

          const locationNameCell = document.createElement('td');
          locationNameCell.classList.add(
            'align-middle',
            'text-nowrap',
            'd-none',
            'd-md-table-cell'
          );
          locationNameCell.textContent = department.locationName || 'Unknown';
          row.appendChild(locationNameCell);

          const actionCell = document.createElement('td');
          actionCell.classList.add('align-middle', 'text-end', 'text-nowrap');

          const editButton = document.createElement('button');
          editButton.type = 'button';
          editButton.classList.add(
            'btn',
            'btn-primary',
            'btn-sm',
            'editDepartmentBtn'
          );
          editButton.setAttribute('data-bs-toggle', 'modal');
          editButton.setAttribute('data-bs-target', '#editDepartmentModal');
          editButton.setAttribute('data-id', department.departmentID);
          editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
          actionCell.appendChild(editButton);

          const deleteButton = document.createElement('button');
          deleteButton.type = 'button';
          deleteButton.classList.add(
            'btn',
            'btn-primary',
            'btn-sm',
            'deleteDepartmentBtn'
          );
          deleteButton.setAttribute('data-id', department.departmentID);
          deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
          actionCell.appendChild(deleteButton);

          row.appendChild(actionCell);
          frag.appendChild(row);
        });

        $departmentsTableBody.append(frag);
        $('#searchInp').val('');
      } else {
        console.error(
          'Failed to fetch departments:',
          response.status.description
        );
      }
    },
    error: function (xhr, status, error) {
      console.error('Error fetching departments:', status, error);
    },
  });
}
// AJAX request to getAllLocations.php
function populateLocationsTable() {
  $('#searchInp').val('');
  $('#clearSearch').hide();
  const $locationTableBody = $('#locationTableBody');
  $locationTableBody.empty();

  $.ajax({
    url: 'libs/php/getAllLocations.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const frag = document.createDocumentFragment();

        response.data.forEach((location) => {
          const row = document.createElement('tr');

          const locationNameCell = document.createElement('td');
          locationNameCell.classList.add('align-middle', 'text-nowrap');
          locationNameCell.textContent = location.name || 'Unknown';
          row.appendChild(locationNameCell);

          const actionCell = document.createElement('td');
          actionCell.classList.add('align-middle', 'text-end', 'text-nowrap');

          const editButton = document.createElement('button');
          editButton.type = 'button';
          editButton.classList.add(
            'btn',
            'btn-primary',
            'btn-sm',
            'editLocationBtn'
          );
          editButton.setAttribute('data-bs-toggle', 'modal');
          editButton.setAttribute('data-bs-target', '#editLocationModal');
          editButton.setAttribute('data-id', location.id);
          editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
          actionCell.appendChild(editButton);

          const deleteButton = document.createElement('button');
          deleteButton.type = 'button';
          deleteButton.classList.add(
            'btn',
            'btn-primary',
            'btn-sm',
            'deleteLocationBtn'
          );
          deleteButton.setAttribute('data-id', location.id);
          deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
          actionCell.appendChild(deleteButton);

          row.appendChild(actionCell);
          frag.appendChild(row);
        });

        $locationTableBody.append(frag);
        $('#searchInp').val('');
      } else {
        // console.error(
        //   'Failed to fetch locations:',
        //   response.status.description
        // );
      }
    },
    // error: function (xhr, status, error) {
    //   console.error('Error fetching locations:', status, error);
    // },
  });
}

// Calls each of the above populate table functions
function fetchAllData() {
  populatePersonnelTable();
  populateDepartmentsTable();
  populateLocationsTable();
  $('#loadingSpinner').fadeOut('slow');
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
  $tableBody.find('.no-results').remove();

  const visibleRows = $tableBody.find('tr:visible').length;
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
  selectedDepartmentID = 0;
  selectedLocationID = 0;
  fetchAllData();
});

// ----------------- Filter Button Functionality  ----------------

// Opens filter modal (triggered via a button)
$('#filterBtn').click(function () {
  $('#filterPersonnelModal').modal('show');
});

// Toggle filter button status active/disabled
function toggleFilterButtonState() {
  if ($('#personnelBtn').hasClass('active')) {
    $('#filterBtn').prop('disabled', false);
  } else {
    $('#filterBtn').prop('disabled', true);
  }
}
$(document).ready(function () {
  toggleFilterButtonState();
});
$('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
  toggleFilterButtonState();
});

// Populate dropdowns when the modal is shown
$('#filterPersonnelModal').on('show.bs.modal', function () {
  const $departmentDropdown = $('#filterPersonnelByDepartment');
  const $locationDropdown = $('#filterPersonnelByLocation');

  $departmentDropdown.empty().append('<option value="0">All</option>');
  $locationDropdown.empty().append('<option value="0">All</option>');

  // Populate Department Dropdown
  $.ajax({
    url: 'libs/php/getAllDepartments.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        response.data.forEach((department) => {
          const option = `<option value="${department.id}">${department.name}</option>`;
          $departmentDropdown.append(option);
        });
        $departmentDropdown.val(selectedDepartmentID);
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
        response.data.forEach((location) => {
          const option = `<option value="${location.id}">${location.name}</option>`;
          $locationDropdown.append(option);
        });
        $locationDropdown.val(selectedLocationID);
      }
    },
    error: function () {
      console.error('Failed to load locations.');
    },
  });
});

// Reset global filter values when the modal is hidden
$('#filterPersonnelModal').on('hidden.bs.modal', function () {
  selectedDepartmentID = $('#filterPersonnelByDepartment').val();
  selectedLocationID = $('#filterPersonnelByLocation').val();
});

// Reset the other dropdown to "All" when one is selected
$('#filterPersonnelByDepartment').on('change', function () {
  if ($(this).val() !== '0') {
    $('#filterPersonnelByLocation').val('0');
    selectedLocationID = '0';
  }
  selectedDepartmentID = $(this).val();
});

$('#filterPersonnelByLocation').on('change', function () {
  if ($(this).val() !== '0') {
    $('#filterPersonnelByDepartment').val('0');
    selectedDepartmentID = '0';
  }
  selectedLocationID = $(this).val();
});

// Event listener for changes in dropdowns to apply filter
$('#filterPersonnelByDepartment, #filterPersonnelByLocation').on(
  'change',
  function () {
    applyFilter(selectedDepartmentID, selectedLocationID);
  }
);

// Applies filter by calling filterPersonnel.php routine
function applyFilter(departmentID, locationID) {
  $.ajax({
    url: 'libs/php/filterPersonnel.php',
    method: 'GET',
    data: {
      departmentID: departmentID || '0',
      locationID: locationID || '0',
    },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const filteredData = response.data.filtered;

        const $personnelTableBody = $('#personnelTableBody');
        $personnelTableBody.empty();

        const frag = document.createDocumentFragment();

        filteredData.forEach((person) => {
          const row = document.createElement('tr');

          // Last Name, First Name
          const nameCell = document.createElement('td');
          nameCell.classList.add('align-middle', 'text-nowrap');
          nameCell.textContent = `${person.lastName || 'N/A'}, ${
            person.firstName || 'N/A'
          }`;
          row.appendChild(nameCell);

          // Job Title
          const jobTitleCell = document.createElement('td');
          jobTitleCell.classList.add(
            'align-middle',
            'text-nowrap',
            'd-md-table-cell'
          );
          jobTitleCell.textContent = person.jobTitle || '';
          row.appendChild(jobTitleCell);

          // Department Name
          const departmentCell = document.createElement('td');
          departmentCell.classList.add(
            'align-middle',
            'text-nowrap',
            'd-md-table-cell'
          );
          departmentCell.textContent = person.departmentName || 'N/A';
          row.appendChild(departmentCell);

          // Location Name
          const locationCell = document.createElement('td');
          locationCell.classList.add(
            'align-middle',
            'text-nowrap',
            'd-md-table-cell'
          );
          locationCell.textContent = person.locationName || 'N/A';
          row.appendChild(locationCell);

          // Email
          const emailCell = document.createElement('td');
          emailCell.classList.add(
            'align-middle',
            'text-nowrap',
            'd-md-table-cell'
          );
          emailCell.textContent = person.email || 'N/A';
          row.appendChild(emailCell);

          // Action Buttons
          const actionCell = document.createElement('td');
          actionCell.classList.add('text-end', 'text-nowrap');

          // Edit Button
          const editButton = document.createElement('button');
          editButton.type = 'button';
          editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'edit-btn');
          editButton.setAttribute('data-bs-toggle', 'modal');
          editButton.setAttribute('data-bs-target', '#editPersonnelModal');
          editButton.setAttribute('data-id', person.id || '');
          editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
          actionCell.appendChild(editButton);

          // Delete Button
          const deleteButton = document.createElement('button');
          deleteButton.type = 'button';
          deleteButton.classList.add(
            'btn',
            'btn-primary',
            'btn-sm',
            'deletePersonnelBtn'
          );
          deleteButton.setAttribute('data-id', person.id || '');
          deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
          actionCell.appendChild(deleteButton);

          row.appendChild(actionCell);
          frag.appendChild(row);
        });

        $personnelTableBody.append(frag);
      } else {
        // console.error(
        //   'Failed to filter personnel:',
        //   response.status.description
        // );
      }
    },
    // error: function () {
    //   console.error('Error during filter request.');
    // },
  });
}

// -----------------  Add Button Functionality  ----------------

// Used for formatting names before submission to DB
function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Resets forms and populates dropdowns when the add button is clicked
$('#addBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    $('#addPersonnelModal').modal('show');
  } else if ($('#departmentsBtn').hasClass('active')) {
    $('#addDepartmentModal').modal('show');
  } else if ($('#locationsBtn').hasClass('active')) {
    $('#addLocationModal').modal('show');
  }
});

// Populate dropdowns when personnel modal is shown
$('#addPersonnelModal').on('show.bs.modal', function () {
  $('#addPersonnelForm')[0].reset();
  populateAddPersonnelDropdowns();
});

// Populate dropdowns when personnel modal is shown
$('#addPersonnelModal').on('show.bs.modal', function () {
  $('#addPersonnelForm')[0].reset();
  populateAddPersonnelDropdowns();
});

// Populate dropdowns when department modal is shown
$('#addDepartmentModal').on('show.bs.modal', function () {
  $('#addDepartmentForm')[0].reset();
  populateAddDepartmentDropdowns();
});

// Reset location modal form when shown
$('#addLocationModal').on('show.bs.modal', function () {
  $('#addLocationForm')[0].reset();
});

// AJAX call to populate location dropdown for departments
function populateAddPersonnelDropdowns() {
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
      }
    },
    // error: function () {
    //   console.error('Failed to load departments.');
    // },
  });
}
// AJAX call to getAllLocations.php
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
    // error: function () {
    //   console.error('Failed to load locations.');
    // },
  });
}
// Handle form submissions for personnel
$('#addPersonnelForm').on('submit', function (e) {
  e.preventDefault();

  let firstName = $('#addFirstName').val().trim();
  let lastName = $('#addLastName').val().trim();
  const departmentID = $('#addDepartment').val();
  const email = $('#addEmail').val().trim();
  const jobTitle = $('#addJobTitle').val().trim();

  if (!firstName || !lastName || !departmentID || !email) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('Please fill out all required fields.');
    $('#messageModal').modal('show');
    return;
  }

  firstName = capitaliseFirstLetter(firstName);
  lastName = capitaliseFirstLetter(lastName);

  // Fetch location for the selected department
  $.ajax({
    url: 'libs/php/getLocationByDepartmentID.php',
    method: 'GET',
    data: { departmentID: departmentID },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const locationName = response.data.locationName;

        $.ajax({
          url: 'libs/php/insertPersonnel.php',
          method: 'POST',
          data: {
            firstName,
            lastName,
            departmentID,
            email,
            locationName, // Automatically fetched location
            jobTitle,
          },
          dataType: 'json',
          success: function (response) {
            $('#addPersonnelModal').modal('hide');
            if (response.status.code === '200') {
              populatePersonnelTable();
              // $('#messageModal .modal-title').text('Success');
              // $('#messageContent').text('Personnel added successfully.');
              // $('#messageModal').modal('show');
            } else {
              $('#messageModal .modal-title').text('Error');
              $('#messageContent').text('Failed to add personnel.');
              $('#messageModal').modal('show');
            }
          },
          error: function () {
            $('#messageModal .modal-title').text('Error');
            $('#messageContent').text(
              'An error occurred while adding personnel.'
            );
            $('#messageModal').modal('show');
          },
        });
      } else {
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text('Failed to fetch location for department.');
        $('#messageModal').modal('show');
      }
    },
    error: function () {
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text(
        'An error occurred while fetching the location.'
      );
      $('#messageModal').modal('show');
    },
  });
});

// Handle form submissions for departments
$('#addDepartmentForm').on('submit', function (e) {
  e.preventDefault();

  const departmentName = $('#addDepartmentName').val().trim();
  const locationID = $('#addDepartmentLocation').val();

  if (!departmentName || !locationID) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('Please fill out all required fields.');
    $('#messageModal').modal('show');
    return;
  }

  const formattedDepartmentName = capitaliseFirstLetter(departmentName);

  $.ajax({
    url: 'libs/php/validateDepartmentLocationByName.php',
    method: 'POST',
    data: { name: formattedDepartmentName, locationID },
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
        data: { name: formattedDepartmentName, locationID },
        dataType: 'json',
        success: function (response) {
          $('#addDepartmentModal').modal('hide');
          if (response.status.code === '200') {
            populateDepartmentsTable();
            // $('#messageModal .modal-title').text('Success');
            // $('#messageContent').text('Department added successfully.');
            // $('#messageModal').modal('show');
          } else {
            $('#messageModal .modal-title').text('Error');
            $('#messageContent').text('Failed to add department.');
            $('#messageModal').modal('show');
          }
        },
        error: function () {
          $('#messageModal .modal-title').text('Error');
          $('#messageContent').text(
            'An error occurred while adding department.'
          );
          $('#messageModal').modal('show');
        },
      });
    },
    error: function () {
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text('Failed to validate department.');
      $('#messageModal').modal('show');
    },
  });
});
// Handle form submissions for locations
$('#addLocationForm').on('submit', function (e) {
  e.preventDefault();

  const locationName = $('#addLocationName').val().trim();

  if (!locationName) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('Please enter a location name.');
    $('#messageModal').modal('show');
    return;
  }

  const formattedLocationName = locationName
    .split(' ')
    .map((word) => capitaliseFirstLetter(word))
    .join(' ');

  $.ajax({
    url: 'libs/php/insertLocation.php',
    method: 'POST',
    data: { name: formattedLocationName },
    dataType: 'json',
    success: function (response) {
      $('#addLocationModal').modal('hide');
      if (response.status.code === '200') {
        populateLocationsTable();
        // $('#messageModal .modal.title').text('Success');
        // $('#messageContent').text('Location added successfully.');
        // $('#messageModal').modal('show');
      } else {
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text(response.status.description);
        $('#messageModal').modal('show');
      }
    },
    error: function () {
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
        // $('#messageContent').text(response.status.description);
        // $('#messageModal').modal('show');
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
        // $('#messageContent').text(response.status.description);
        // $('#messageModal').modal('show');
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
        // $('#messageContent').text(response.status.description);
        // $('#messageModal').modal('show');
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

// Global variables to track ID and type of item being deleted
let itemToDelete = null;
let deleteType = null;

// Handle delete button clicks for all delete buttons
$('body').on(
  'click',
  '.deletePersonnelBtn, .deleteLocationBtn, .deleteDepartmentBtn',
  function () {
    itemToDelete = $(this).data('id');
    if ($(this).hasClass('deletePersonnelBtn')) {
      deleteType = 'personnel';
      $('#confirmDeleteModal').modal('show');
    } else if ($(this).hasClass('deleteLocationBtn')) {
      deleteType = 'location';
      checkDependencies(
        'libs/php/checkLocationDependencies.php',
        'This location cannot be deleted because it has associated departments.'
      );
    } else if ($(this).hasClass('deleteDepartmentBtn')) {
      deleteType = 'department';
      checkDependencies(
        'libs/php/checkDepartmentDependencies.php',
        'This department cannot be deleted because it has associated personnel.'
      );
    }
  }
);
// Function to check dependencies for location or department
function checkDependencies(url, dependencyMessage) {
  let nameUrl = '';
  let method = 'GET';
  let data = { id: itemToDelete };

  if (deleteType === 'location') {
    nameUrl = 'libs/php/getLocationByID.php';
  } else if (deleteType === 'department') {
    nameUrl = 'libs/php/getDepartmentByID.php';
    method = 'POST';
  }
  $.ajax({
    url: nameUrl,
    type: method,
    data: data,
    dataType: 'json',
    success: function (nameResponse) {
      if (nameResponse.status.code === '200') {
        const entityName = nameResponse.data[0]?.name || 'this item';

        // Now check dependencies
        $.ajax({
          url: url,
          type: 'GET',
          data: { id: itemToDelete },
          dataType: 'json',
          success: function (response) {
            if (response.status && response.status.code === 200) {
              if (response.data && response.data.count > 0) {
                // Dependencies exist, show message modal with item name
                $('#messageModal .modal-title').text('Cannot Delete');
                $('#messageContent').html(
                  `<strong>${entityName}</strong> cannot be deleted because ${dependencyMessage}`
                );
                $('#messageModal').modal('show');
              } else {
                // No dependencies, proceed to show the delete modal
                $('#confirmDeleteModal').modal('show');
              }
            } else {
              $('#messageModal .modal-title').text('Error');
              $('#messageContent').text('Failed to check dependencies.');
              $('#messageModal').modal('show');
            }
          },
          error: function () {
            $('#messageModal .modal-title').text('Error');
            $('#messageContent').text(
              'An error occurred while checking dependencies.'
            );
            $('#messageModal').modal('show');
          },
        });
      } else {
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text('Failed to retrieve item details.');
        $('#messageModal').modal('show');
      }
    },
    error: function () {
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text(
        'An error occurred while retrieving the item details.'
      );
      $('#messageModal').modal('show');
    },
  });
}
// Retrieve selected item's name and display in modal to the user
$('#confirmDeleteModal').on('show.bs.modal', function () {
  let url = '';
  let method = 'GET';
  let data = { id: itemToDelete };

  if (deleteType === 'personnel') {
    url = 'libs/php/getPersonnelByID.php';
    method = 'POST';
  } else if (deleteType === 'location') {
    url = 'libs/php/getLocationByID.php';
  } else if (deleteType === 'department') {
    url = 'libs/php/getDepartmentByID.php';
    method = 'POST';
  }

  $.ajax({
    url: url,
    type: method,
    data: data,
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        let entityName = '';
        if (deleteType === 'personnel') {
          entityName =
            response.data.personnel[0]?.firstName +
              ' ' +
              response.data.personnel[0]?.lastName || 'this item';
        } else {
          entityName = response.data[0]?.name || 'this item';
        }

        $('#confirmDeleteModal .modal-body p').html(
          `Are you sure you want to delete <strong>${entityName}</strong>?`
        );
        $('#confirmDeleteForm input[name="id"]').val(itemToDelete);
      } else {
        $('#confirmDeleteModal').modal('hide');
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text('Failed to retrieve item details.');
        $('#messageModal').modal('show');
      }
    },
    error: function () {
      $('#confirmDeleteModal').modal('hide');
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text(
        'An error occurred while retrieving the item details.'
      );
      $('#messageModal').modal('show');
    },
  });
});
// Form submission handler for deletion
$('#confirmDeleteForm').on('submit', function (e) {
  e.preventDefault(); // Prevent the form's default behavior (navigating to action)

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
    data: $(this).serialize(),
    dataType: 'json',
    success: function (response) {
      $('#confirmDeleteModal').modal('hide');
      if (response.status.code === '200') {
        // $('#messageModal .modal-title').text('Success');
        // $('#messageContent').text(successMessage);
        // $('#messageModal').modal('show');

        if (deleteType === 'personnel') populatePersonnelTable();
        if (deleteType === 'location') populateLocationsTable();
        if (deleteType === 'department') populateDepartmentsTable();
      } else {
        // Show error modal
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
});

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
