// For development purposes when users are updating/deleting/creating, will need initially setting to false for production
var isAuth = true;

// ----------------- Fetch Data and Populate Tables ----------------

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

        // Attach click event to all edit buttons
        $('.edit-btn').on('click', function () {
          const employeeId = $(this).data('id');
          populateEditModal(employeeId);
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
// Calls fetchAllData on page load
document.addEventListener('DOMContentLoaded', fetchAllData);

// ----------------- Search Bar Functionality  ----------------

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
            item.jobTitle || 'N/A' // Add jobTitle here, fallback to 'N/A'
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

// ----------------- Refresh Button Functionality  ----------------

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

// ----------------- Filter Button Functionality  ----------------

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

    // Dynamically add the Job Title filter if job titles exist
    $.ajax({
      url: 'libs/php/getAllJobTitles.php',
      method: 'GET',
      dataType: 'json',
      success: function (response) {
        if (response.status.code === 200 && response.data.length > 0) {
          // Append Job Title filter to the modal if job titles exist
          $filterContent.append(`
            <div class="mb-3">
              <label for="filterJobTitle" class="form-label">Job Title</label>
              <select id="filterJobTitle" class="form-select">
                <option value="">All Job Titles</option>
              </select>
            </div>
          `);

          // Populate Job Title dropdown
          const $jobTitleDropdown = $('#filterJobTitle');
          response.data.forEach((jobTitle) => {
            $jobTitleDropdown.append(
              `<option value="${jobTitle.name}">${jobTitle.name}</option>`
            );
          });
        }
      },
      error: function () {
        console.error('Failed to load job titles.');
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

  // Populate the dropdown options dynamically
  populateFilterDropdowns();
});
function populateFilterDropdowns() {
  let ajaxCallsRemaining = 2; // Track only two dropdowns for departments and locations

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
        console.error(
          'Failed to load departments:',
          response.status.description
        );
      }
    },
    error: function () {
      console.error('Failed to load departments.');
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
        console.error('Failed to load locations:', response.status.description);
      }
    },
    error: function () {
      console.error('Failed to load locations.');
    },
    complete: function () {
      ajaxCallsRemaining--;
      onDropdownsPopulated();
    },
  });
}
// function populateFilterDropdowns() {
//   let ajaxCallsRemaining = 3; // Track the number of pending AJAX calls

//   function onDropdownsPopulated() {
//     // Show the modal only when all dropdowns have been populated
//     if (ajaxCallsRemaining === 0) {
//       $('#filterModal').modal('show');
//     }
//   }

//   // Populate Department Dropdown
//   $.ajax({
//     url: 'libs/php/getAllDepartments.php',
//     method: 'GET',
//     dataType: 'json',
//     success: function (response) {
//       if (response.status.code === '200') {
//         const $departmentDropdown = $('#filterDepartment');
//         if ($departmentDropdown.length) {
//           $departmentDropdown.empty();
//           $departmentDropdown.append(
//             '<option value="">All Departments</option>'
//           );
//           response.data.forEach((department) => {
//             $departmentDropdown.append(
//               `<option value="${department.id}">${department.name}</option>`
//             );
//           });
//         }
//       } else {
//         console.error(
//           'Failed to load departments:',
//           response.status.description
//         );
//       }
//     },
//     error: function () {
//       console.error('Failed to load departments.');
//     },
//     complete: function () {
//       ajaxCallsRemaining--;
//       onDropdownsPopulated();
//     },
//   });

//   // Populate Location Dropdown
//   $.ajax({
//     url: 'libs/php/getAllLocations.php',
//     method: 'GET',
//     dataType: 'json',
//     success: function (response) {
//       if (response.status.code === '200') {
//         const $locationDropdown = $('#filterLocation');
//         if ($locationDropdown.length) {
//           $locationDropdown.empty();
//           $locationDropdown.append('<option value="">All Locations</option>');
//           response.data.forEach((location) => {
//             $locationDropdown.append(
//               `<option value="${location.id}">${location.name}</option>`
//             );
//           });
//         }
//       } else {
//         console.error('Failed to load locations:', response.status.description);
//       }
//     },
//     error: function () {
//       console.error('Failed to load locations.');
//     },
//     complete: function () {
//       ajaxCallsRemaining--;
//       onDropdownsPopulated();
//     },
//   });

//   // Populate Job Title Dropdown
//   $.ajax({
//     url: 'libs/php/getAllJobTitles.php',
//     method: 'GET',
//     dataType: 'json',
//     success: function (response) {
//       if (response.status.code === 200 && response.data.length > 0) {
//         const $filterContent = $('#filterContent');
//         const jobTitleFilterHTML = `
//           <div class="mb-3">
//             <label for="filterJobTitle" class="form-label">Job Title</label>
//             <select id="filterJobTitle" class="form-select">
//               <option value="">All Job Titles</option>
//             </select>
//           </div>
//         `;
//         $filterContent.append(jobTitleFilterHTML);

//         const $jobTitleDropdown = $('#filterJobTitle');
//         if ($jobTitleDropdown.length) {
//           $jobTitleDropdown.empty();
//           $jobTitleDropdown.append('<option value="">All Job Titles</option>');
//           response.data.forEach((jobTitle) => {
//             $jobTitleDropdown.append(
//               `<option value="${jobTitle.name}">${jobTitle.name}</option>`
//             );
//           });
//         }
//       }
//     },
//     error: function () {
//       console.error('Failed to load job titles.');
//     },
//     complete: function () {
//       ajaxCallsRemaining--;
//       onDropdownsPopulated();
//     },
//   });
// }

// // Modified `#filterBtn` click handler to avoid hardcoding Job Title
// $('#filterBtn').click(function () {
//   const $filterContent = $('#filterContent');

//   if ($('#personnelBtn').hasClass('active')) {
//     changeModalTitle('Filter Personnel');
//     // Filter for Personnel Table
//     $filterContent.html(`
//       <div class="mb-3">
//         <label for="filterDepartment" class="form-label">Department</label>
//         <select id="filterDepartment" class="form-select">
//           <option value="">All Departments</option>
//         </select>
//       </div>
//       <div class="mb-3">
//         <label for="filterLocation" class="form-label">Location</label>
//         <select id="filterLocation" class="form-select">
//           <option value="">All Locations</option>
//         </select>
//       </div>
//     `);
//   } else if ($('#departmentsBtn').hasClass('active')) {
//     changeModalTitle('Filter Departments');
//     // Filter for Departments Table
//     $filterContent.html(`
//       <div class="mb-3">
//         <label for="filterLocation" class="form-label">Location</label>
//         <select id="filterLocation" class="form-select">
//           <option value="">All Locations</option>
//         </select>
//       </div>
//     `);
//   }

//   // Populate dropdown options dynamically
//   populateFilterDropdowns();
// });

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
$('#applyFilter').click(function () {
  const selectedDepartmentID = $('#filterDepartment').val(); // Get departmentID
  const selectedLocationID = $('#filterLocation').val(); // Get locationID
  const selectedJobTitle = $('#filterJobTitle').length
    ? $('#filterJobTitle').val()
    : null; // Get job title if available

  if ($('#personnelBtn').hasClass('active')) {
    // Filter Personnel Table
    $.ajax({
      url: 'libs/php/filterPersonnel.php',
      method: 'GET',
      data: {
        departmentID: selectedDepartmentID || '', // Use departmentID
        locationID: selectedLocationID || '', // Use locationID
        jobTitle: selectedJobTitle || '', // Optional job title
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

          // Close the modal
          $('#filterModal').modal('hide');
        } else {
          console.error(
            'Failed to filter personnel:',
            response.status.description
          );
        }
      },
      error: function (xhr, status, error) {
        console.error('Error during personnel filter request:', status, error);
      },
    });
  } else if ($('#departmentsBtn').hasClass('active')) {
    // Filter Departments Table
    $.ajax({
      url: 'libs/php/filterDepartments.php',
      method: 'GET',
      data: {
        locationID: selectedLocationID || '', // Use locationID
        departmentID: selectedDepartmentID || '', // Use departmentID if needed
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
        } else {
          console.error(
            'Failed to filter departments:',
            response.status.description
          );
        }
      },
      error: function (xhr, status, error) {
        console.error('Error during department filter request:', status, error);
      },
    });
  }
});

// -----------------  Add Button Functionality  ----------------

// Used for formatting names before submission to DB
function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
// Opens add modal, depending on currently open tab
$('#addBtn').click(function () {
  if (!isAuth) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('You are not authorized to add new items.');
    $('#messageModal').modal('show');
    return;
  }

  if ($('#personnelBtn').hasClass('active')) {
    // Reset and show Add Personnel Modal
    $('#addPersonnelForm')[0].reset();
    populateAddPersonnelDropdowns();
    $('#addPersonnelModal').modal('show');
  } else if ($('#departmentsBtn').hasClass('active')) {
    // Reset and show Add Department Modal
    $('#addDepartmentForm')[0].reset();
    populateAddDepartmentDropdowns();
    $('#addDepartmentModal').modal('show');
  } else if ($('#locationsBtn').hasClass('active')) {
    // Reset and show Add Location Modal
    $('#addLocationForm')[0].reset();
    $('#addLocationModal').modal('show');
  } else {
    console.log('Add functionality not implemented for this tab.');
  }
});
// Function to populate the Department and Location dropdowns
function populateAddPersonnelDropdowns(callback) {
  let ajaxCallsRemaining = 2; // Track both dropdowns

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
        console.error(
          'Failed to load departments:',
          response.status.description
        );
      }
    },
    error: function () {
      console.error('Failed to load departments.');
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
        console.error('Failed to load locations:', response.status.description);
      }
    },
    error: function () {
      console.error('Failed to load locations.');
    },
    complete: function () {
      ajaxCallsRemaining--;
      onDropdownsPopulated();
    },
  });
}
function populateAddDepartmentDropdowns() {
  // Populate Location Dropdown
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
      console.error('Failed to load locations.');
    },
  });
}
// When new personnel details have been added, sends data to insertPersonnel.php script to add personnel to DB
$('#savePersonnelBtn').click(function () {
  // Get and trim the inputs
  let firstName = $('#addFirstName').val().trim();
  let lastName = $('#addLastName').val().trim();
  const departmentID = $('#addDepartment').val();
  const email = $('#addEmail').val().trim();
  const locationID = $('#addLocation').val();
  const jobTitle = $('#addJobTitle').val().trim(); // New field

  // Close the modal immediately
  $('#addPersonnelModal').modal('hide');

  // Check if the user is authorized
  if (!isAuth) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('You are not authorized to add new personnel.');
    $('#messageModal').modal('show');
    return;
  }

  // Check if all required fields are filled
  if (!firstName || !lastName || !departmentID || !email || !locationID) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('Please fill out all required fields.');
    $('#messageModal').modal('show');
    return;
  }

  // Capitalize first name and last name
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

      // Send AJAX request to add personnel
      $.ajax({
        url: 'libs/php/insertPersonnel.php',
        method: 'POST',
        data: {
          firstName,
          lastName,
          departmentID,
          email,
          locationID,
          jobTitle, // Include jobTitle in the request
        },
        dataType: 'json',
        success: function (response) {
          if (response.status.code === '200') {
            // Refresh the Personnel Table
            populatePersonnelTable();

            // Show success message
            $('#messageModal .modal-title').text('Success');
            $('#messageContent').text('Personnel added successfully!');
            $('#messageModal').modal('show');
          } else {
            $('#messageModal .modal-title').text('Error');
            $('#messageContent').text(
              'Failed to add personnel. Please try again.'
            );
            $('#messageModal').modal('show');
          }
        },
        error: function (xhr, status, error) {
          console.error('Error during add request:', status, error);
          $('#messageModal .modal-title').text('Error');
          $('#messageContent').text(
            'An error occurred while adding personnel. Please try again.'
          );
          $('#messageModal').modal('show');
        },
      });
    },
    error: function (xhr, status, error) {
      console.error('Error validating department and location:', status, error);
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text(
        'Failed to validate department and location. Please try again.'
      );
      $('#messageModal').modal('show');
    },
  });
});

$('#saveDepartmentBtn').click(function () {
  const departmentName = $('#addDepartmentName').val().trim();
  const locationID = $('#addDepartmentLocation').val();

  // Close the modal immediately
  $('#addDepartmentModal').modal('hide');

  // Check if all fields are filled
  if (!departmentName || !locationID) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('Please fill out all required fields.');
    $('#messageModal').modal('show');
    return;
  }

  // Capitalize department name
  const formattedDepartmentName = capitaliseFirstLetter(departmentName);

  // Validate department name and location association before proceeding
  $.ajax({
    url: 'libs/php/validateDepartmentLocationByName.php',
    method: 'POST',
    data: {
      name: formattedDepartmentName, // Check against department name
      locationID: locationID, // Use locationID
    },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '400') {
        // Show validation error if a duplicate department exists
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text(response.status.description);
        $('#messageModal').modal('show');
        return;
      }

      // If validation passes, proceed to insert the new department
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
            // Refresh the Departments Table
            populateDepartmentsTable();

            // Show success message
            $('#messageModal .modal-title').text('Success');
            $('#messageContent').text('Department added successfully!');
            $('#messageModal').modal('show');
          } else {
            $('#messageModal .modal-title').text('Error');
            $('#messageContent').text(
              'Failed to add department. Please try again.'
            );
            $('#messageModal').modal('show');
          }
        },
        error: function (xhr, status, error) {
          console.error('Error during add request:', status, error);
          $('#messageModal .modal-title').text('Error');
          $('#messageContent').text(
            'An error occurred while adding the department. Please try again.'
          );
          $('#messageModal').modal('show');
        },
      });
    },
    error: function (xhr, status, error) {
      console.error('Error validating department and location:', status, error);
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text(
        'Failed to validate department and location. Please try again.'
      );
      $('#messageModal').modal('show');
    },
  });
});

// $('#saveDepartmentBtn').click(function () {
//   const departmentName = $('#addDepartmentName').val().trim();
//   const locationID = $('#addDepartmentLocation').val();

//   // Close the modal immediately
//   $('#addDepartmentModal').modal('hide');

//   // Check if the user is authorized
//   if (!isAuth) {
//     $('#messageModal .modal-title').text('Error');
//     $('#messageContent').text('You are not authorized to add new departments.');
//     $('#messageModal').modal('show');
//     return;
//   }

//   // Check if all fields are filled
//   if (!departmentName || !locationID) {
//     $('#messageModal .modal-title').text('Error');
//     $('#messageContent').text('Please fill out all required fields.');
//     $('#messageModal').modal('show');
//     return;
//   }

//   // Capitalize department name
//   const formattedDepartmentName = capitaliseFirstLetter(departmentName);

//   // Validate department name and location association before proceeding
//   $.ajax({
//     url: 'libs/php/validateDepartmentLocationByName.php',
//     method: 'POST',
//     data: {
//       name: formattedDepartmentName, // Check against department name
//       locationID: locationID, // Use locationID
//     },
//     dataType: 'json',
//     success: function (response) {
//       if (response.status.code === '400') {
//         // Show validation error if the department-location association is invalid
//         $('#messageModal .modal-title').text('Error');
//         $('#messageContent').text(response.status.description);
//         $('#messageModal').modal('show');
//         return;
//       }

//       // If validation passes, proceed to insert the new department
//       $.ajax({
//         url: 'libs/php/insertDepartment.php',
//         method: 'POST',
//         data: {
//           name: formattedDepartmentName, // 'name' matches the PHP script
//           locationID: locationID, // 'locationID' matches the PHP script
//         },
//         dataType: 'json',
//         success: function (response) {
//           if (response.status.code === '200') {
//             // Refresh the Departments Table
//             populateDepartmentsTable();

//             // Show success message
//             $('#messageModal .modal-title').text('Success');
//             $('#messageContent').text('Department added successfully!');
//             $('#messageModal').modal('show');
//           } else {
//             $('#messageModal .modal-title').text('Error');
//             $('#messageContent').text(
//               'Failed to add department. Please try again.'
//             );
//             $('#messageModal').modal('show');
//           }
//         },
//         error: function (xhr, status, error) {
//           console.error('Error during add request:', status, error);
//           $('#messageModal .modal-title').text('Error');
//           $('#messageContent').text(
//             'An error occurred while adding the department. Please try again.'
//           );
//           $('#messageModal').modal('show');
//         },
//       });
//     },
//     error: function (xhr, status, error) {
//       console.error('Error validating department and location:', status, error);
//       $('#messageModal .modal-title').text('Error');
//       $('#messageContent').text(
//         'Failed to validate department and location. Please try again.'
//       );
//       $('#messageModal').modal('show');
//     },
//   });
// });
// Function to capitalize the first letter of each word

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
// Handle the "Save" button click for adding a location
$('#saveLocationBtn').click(function () {
  const locationName = $('#addLocationName').val().trim();

  // Close the modal immediately
  $('#addLocationModal').modal('hide');

  // Check if the user is authorized
  if (!isAuth) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('You are not authorized to add new locations.');
    $('#messageModal').modal('show');
    return;
  }

  // Check if the location name is filled
  if (!locationName) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('Please enter a location name.');
    $('#messageModal').modal('show');
    return;
  }

  // Capitalize the first letter of each word in the location name
  const formattedLocationName = locationName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Send AJAX request to add the new location
  $.ajax({
    url: 'libs/php/insertLocation.php',
    method: 'POST',
    data: {
      name: formattedLocationName, // Pass the location name to the PHP script
    },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        // Refresh the Locations Table
        populateLocationsTable();

        // Show success message
        $('#messageModal .modal-title').text('Success');
        $('#messageContent').text('Location added successfully!');
        $('#messageModal').modal('show');
      } else if (response.status.code === '400') {
        // Show error message if the location already exists
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text(response.status.description);
        $('#messageModal').modal('show');
      } else {
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text('Failed to add location. Please try again.');
        $('#messageModal').modal('show');
      }
    },
    error: function (xhr, status, error) {
      console.error('Error during add request:', status, error);
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text(
        'An error occurred while adding the location. Please try again.'
      );
      $('#messageModal').modal('show');
    },
  });
});
// Refresh the Locations Table - DUPLICATE
// function populateLocationsTable() {
//   const $locationTableBody = $('#locationTableBody');
//   $locationTableBody.empty(); // Clear any existing rows

//   // Fetch the latest location data from the server
//   $.ajax({
//     url: 'libs/php/getAllLocations.php', // Endpoint to fetch location data
//     method: 'GET',
//     dataType: 'json',
//     success: function (response) {
//       if (response.status.code === '200') {
//         // Populate the table with the fetched data
//         response.data.forEach((location) => {
//           const rowHtml = `
//             <tr>
//               <td class="align-middle text-nowrap">${
//                 location.name || 'Unknown'
//               }</td>
//               <td class="align-middle text-end text-nowrap">
//                 <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${
//                   location.id
//                 }">
//                   <i class="fa-solid fa-pencil fa-fw"></i>
//                 </button>
//                 <button type="button" class="btn btn-primary btn-sm deleteLocationBtn" data-id="${
//                   location.id
//                 }">
//                   <i class="fa-solid fa-trash fa-fw"></i>
//                 </button>
//               </td>
//             </tr>
//           `;
//           $locationTableBody.append(rowHtml);
//         });
//       } else {
//         console.error(
//           'Failed to fetch locations:',
//           response.status.description
//         );
//       }
//     },
//     error: function (xhr, status, error) {
//       console.error('Error fetching locations:', status, error);
//     },
//   });
// }

// -----------------  Refresh Functions  ---------------------

// Refresh corresponding tab when clicked:
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

// Edit Personnel

function populateLocationsDropdown() {
  // Fetch locations via AJAX
  $.ajax({
    url: 'libs/php/getAllLocations.php',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const $locationDropdown = $('#editPersonnelLocation');
        $locationDropdown.empty(); // Clear existing options

        response.data.forEach((location) => {
          const option = `<option value="${location.id}">${location.name}</option>`;
          $locationDropdown.append(option);
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
$('#editPersonnelModal').on('show.bs.modal', function () {
  populateLocationsDropdown();
});
function populateEditModal(employeeId) {
  // Fetch employee details using AJAX
  $.ajax({
    url: 'libs/php/getPersonnelByID.php',
    method: 'GET',
    data: { id: employeeId },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const employee = response.data.personnel[0];
        const departments = response.data.department;

        // Populate the modal fields
        $('#editPersonnelEmployeeID').val(employee.id);
        $('#editPersonnelFirstName').val(employee.firstName);
        $('#editPersonnelLastName').val(employee.lastName);
        $('#editPersonnelJobTitle').val(employee.jobTitle);
        $('#editPersonnelEmailAddress').val(employee.email);

        // Populate department dropdown
        const $departmentSelect = $('#editPersonnelDepartment');
        $departmentSelect.empty(); // Clear existing options
        departments.forEach((department) => {
          const isSelected =
            department.id === employee.departmentID ? 'selected' : '';
          $departmentSelect.append(
            `<option value="${department.id}" ${isSelected}>${department.name}</option>`
          );
        });
      } else {
        console.error(
          'Failed to fetch employee details:',
          response.status.description
        );
      }
    },
    error: function (xhr, status, error) {
      console.error('Error fetching employee details:', status, error);
    },
  });
}
$('#editPersonnelForm').on('submit', function (e) {
  e.preventDefault();
  const searchTerm = $('#searchInp').val();

  // Show or hide the "Clear Search" text based on input value
  if (searchTerm.length > 0) {
    $('#searchInp').val('');
    $('#clearSearch').hide();
  }

  const employeeData = {
    id: $('#editPersonnelEmployeeID').val(),
    firstName: $('#editPersonnelFirstName').val(),
    lastName: $('#editPersonnelLastName').val(),
    jobTitle: $('#editPersonnelJobTitle').val() || '', // Optional
    email: $('#editPersonnelEmailAddress').val(),
    departmentID: $('#editPersonnelDepartment').val(), // Send department ID
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

// Edit Departments

// Triggered when the edit button is clicked
$('#departmentTableBody').on('click', '.editDepartmentBtn', function () {
  const departmentID = $(this).data('id');

  // Clear any existing data in the modal fields
  $('#editDepartmentID').val('');
  $('#editDepartmentName').val('');
  $('#editDepartmentLocation').empty();

  // Fetch the department details using getDepartmentByID.php
  $.ajax({
    url: 'libs/php/getDepartmentByID.php', // API that fetches department by ID
    type: 'GET',
    data: { id: departmentID }, // Send departmentID as a parameter
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200' && response.data.length > 0) {
        const department = response.data[0];

        // Populate the modal fields
        $('#editDepartmentID').val(department.id); // Populate department ID
        $('#editDepartmentName').val(department.name); // Populate department name

        // Populate and preselect the location dropdown
        populateLocationsDropdown(department.locationID);
      } else {
        console.error(
          'Failed to fetch department details:',
          response.status.description
        );
        $('#messageContent').text(
          'Failed to fetch department details. Please try again.'
        );
        $('#messageModal').modal('show');
      }
    },
    error: function (xhr, status, error) {
      console.error('Error fetching department details:', status, error);
      $('#messageContent').text(
        'An error occurred while fetching department details.'
      );
      $('#messageModal').modal('show');
    },
  });

  // Show the modal
  $('#editDepartmentModal').modal('show');
});

// Helper function to populate and preselect the location dropdown
function populateLocationsDropdown(preselectedLocationID) {
  $.ajax({
    url: 'libs/php/getAllLocations.php', // API that fetches all locations
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        const $locationDropdown = $('#editDepartmentLocation');
        $locationDropdown.empty(); // Clear existing options

        response.data.forEach((location) => {
          const isSelected =
            parseInt(location.id) === parseInt(preselectedLocationID)
              ? 'selected'
              : '';
          const option = `<option value="${location.id}" ${isSelected}>${location.name}</option>`;
          $locationDropdown.append(option);
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

// Submit the edit department form
$('#editDepartmentForm').on('submit', function (e) {
  e.preventDefault();

  const departmentData = {
    departmentID: $('#editDepartmentID').val(),
    name: $('#editDepartmentName').val().trim(),
    locationID: $('#editDepartmentLocation').val(),
  };

  // Validation: Ensure name and locationID are provided
  if (
    !departmentData.departmentID ||
    !departmentData.name ||
    !departmentData.locationID
  ) {
    $('#messageContent').text(
      'Please provide a valid department ID, name, and location.'
    );
    $('#messageModal').modal('show');
    return;
  }

  // Submit the data via AJAX
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
        populateDepartmentsTable(); // Refresh the departments table
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

// Edit Locations

// Triggered when the edit button is clicked
$('#locationTableBody').on(
  'click',
  '.btn-primary[data-bs-target="#editLocationModal"]',
  function () {
    const locationID = $(this).data('id');

    // Fetch the location details using an AJAX call
    $.ajax({
      url: 'libs/php/getLocationByID.php', // Replace with your PHP endpoint for fetching location details
      type: 'GET',
      data: { id: locationID }, // Send location ID as a parameter
      dataType: 'json',
      success: function (response) {
        if (response.status.code === '200' && response.data.length > 0) {
          const location = response.data[0];

          // Populate the modal fields
          $('#editLocationID').val(location.id);
          $('#editLocationName').val(location.name);

          // Show the modal
          $('#editLocationModal').modal('show');
        } else {
          console.error(
            'Failed to fetch location details:',
            response.status.description
          );
        }
      },
      error: function (xhr, status, error) {
        console.error('Error fetching location details:', status, error);
      },
    });
  }
);
// Submit the edit location form
$('#editLocationForm').on('submit', function (e) {
  $('#editLocationModal').modal('hide');
  e.preventDefault();

  const locationData = {
    id: $('#editLocationID').val(),
    name: $('#editLocationName').val().trim(),
  };

  // Validation: Ensure name is provided
  if (!locationData.name) {
    $('#messageContent').text('Please provide a valid location name.');
    $('#messageModal').modal('show');
    return;
  }

  // Submit the data via AJAX
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
        populateLocationsTable(); // Refresh the locations table
      } else if (response.status.code === '400') {
        // Show validation error if the location name already exists
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

// Delete Location

let locationToDelete = null; // Temporary storage for the location ID to be deleted
// Attach click event using delegation for dynamically added buttons
$('#locationTableBody').on('click', '.deleteLocationBtn', function () {
  locationToDelete = $(this).data('id'); // Store the location ID

  // Show confirmation message in the modal
  $('#messageModal .modal-title').text('Confirm Deletion');
  $('#messageContent').text('Are you sure you want to delete this location?');

  // Replace the "OK" button with a "Delete" button for the confirmation modal
  $('#messageModalOkButton')
    .text('Delete')
    .off('click') // Ensure no duplicate click handlers
    .on('click', function () {
      confirmDeleteLocation(); // Proceed with deletion when "Delete" is clicked
    });

  // Display the modal
  $('#messageModal').modal('show');
});
// Function to confirm and delete the location
function confirmDeleteLocation() {
  if (locationToDelete) {
    // Send an AJAX request to delete the location
    $.ajax({
      url: 'libs/php/deleteLocation.php',
      type: 'POST',
      data: { id: locationToDelete },
      dataType: 'json',
      success: function (response) {
        if (response.status.code === '200') {
          // Show success message
          $('#messageModal .modal-title').text('Success');
          $('#messageContent').text('Location deleted successfully.');
          $('#messageModalOkButton')
            .text('OK')
            .off('click')
            .on('click', function () {
              $('#messageModal').modal('hide');
            });
          populateLocationsTable(); // Refresh the table
        } else if (response.status.code === '400') {
          console.log('dependency error');
          // Show dependency error message
          $('#messageModal .modal-title').text('Error');
          $('#messageContent').text(
            response.status.description ||
              'This location cannot be deleted because it has dependent departments.'
          );
          $('#messageModalOkButton')
            .text('OK')
            .off('click')
            .on('click', function () {
              // Only close the modal when the user explicitly clicks "OK"
              $('#messageModal').modal('hide');
            });
        } else {
          // Show generic error message
          $('#messageModal .modal-title').text('Error');
          $('#messageContent').text(
            response.status.description ||
              'An error occurred while deleting the location.'
          );
          $('#messageModalOkButton')
            .text('OK')
            .off('click')
            .on('click', function () {
              $('#messageModal').modal('hide');
            });
        }
        locationToDelete = null; // Clear the stored location ID
      },
      error: function () {
        // Show error message
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text(
          'An error occurred while deleting the location.'
        );
        $('#messageModalOkButton')
          .text('OK')
          .off('click')
          .on('click', function () {
            $('#messageModal').modal('hide');
          });
        locationToDelete = null; // Clear the stored location ID
      },
    });
  }
}

// Delete Department

// Attach click event for delete buttons
$('#departmentTableBody').on('click', '.deleteDepartmentBtn', function () {
  const departmentID = $(this).data('id');

  // Show confirmation modal
  $('#messageModal .modal-title').text('Confirm Deletion');
  $('#messageContent').text('Are you sure you want to delete this department?');
  $('#messageModalOkButton')
    .text('Delete')
    .off('click')
    .on('click', function () {
      confirmDeleteDepartment(departmentID);
    });

  $('#messageModal').modal('show');
});
// Confirm and delete the department
function confirmDeleteDepartment(departmentID) {
  $.ajax({
    url: 'libs/php/deleteDepartment.php',
    type: 'POST',
    data: { id: departmentID },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '200') {
        // Show success message
        $('#messageModal .modal-title').text('Success');
        $('#messageContent').text('Department deleted successfully.');
        $('#messageModalOkButton')
          .text('OK')
          .off('click')
          .on('click', function () {
            $('#messageModal').modal('hide');
          });
        populateDepartmentsTable(); // Refresh the table
      } else if (response.status.code === '400') {
        // Show error message for dependencies
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text(
          response.status.description ||
            'This department cannot be deleted because it has associated personnel.'
        );
        $('#messageModalOkButton')
          .text('OK')
          .off('click')
          .on('click', function () {
            $('#messageModal').modal('hide');
          });
      } else {
        // Show generic error message
        $('#messageModal .modal-title').text('Error');
        $('#messageContent').text(
          response.status.description ||
            'An error occurred while deleting the department.'
        );
        $('#messageModalOkButton')
          .text('OK')
          .off('click')
          .on('click', function () {
            $('#messageModal').modal('hide');
          });
      }
    },
    error: function () {
      // Show error message for AJAX failure
      $('#messageModal .modal-title').text('Error');
      $('#messageContent').text(
        'An error occurred while deleting the department.'
      );
      $('#messageModalOkButton')
        .text('OK')
        .off('click')
        .on('click', function () {
          $('#messageModal').modal('hide');
        });
    },
  });
}

// Delete Personnel

// -------------------------------------------------------------

// Even if search was not event driven, conflicts could occur - need handling for if user clicks on result that is no longer there
// test multiple user functionality with multiple browser sesstions

// ADD PRELOADER
// HANDLE IF USER PRESSES ENTER WHEN A MODAL IS OPEN
// CHECK PREPARED STATEMENTS
// CHECK IF e.preventDefault needed for all
// CHECK FOR on.click vs on.submit event triggers for forms
// CLEAR CONSOLE OF ERRORS AND LOGS
// No match found in 'x' if no search results
// CHECK PREPARED STATEMENTS ARE USED
// ARE ALL MODAL STYLINGS THE SAME?
// CHECK ID'S NOT STORED IN MULTI-USER COMPATIBLE WAY
