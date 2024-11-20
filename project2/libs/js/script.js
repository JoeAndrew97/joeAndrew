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
                person.jobTitle || '' // Include jobTitle here
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

// ----------------- Add Button Functionality  ----------------

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
  } else {
    console.log('Add functionality not implemented for this tab.');
  }
});

$('#addBtn').click(function () {
  if (!isAuth) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('You are not authorized to add new locations.');
    $('#messageModal').modal('show');
    return;
  }

  if ($('#locationsBtn').hasClass('active')) {
    // Reset the form
    $('#addLocationForm')[0].reset();

    // Open the Add Location modal
    $('#addLocationModal').modal('show');
  } else if ($('#departmentsBtn').hasClass('active')) {
    // Handle adding a department if necessary
    console.log('Open Add Department Modal');
  } else if ($('#personnelBtn').hasClass('active')) {
    // Handle adding personnel if necessary
    console.log('Open Add Personnel Modal');
  }
});

// Save New Location
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

  // Capitalize the first letter of each word
  const formattedLocationName = locationName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Validate the formatted location name
  $.ajax({
    url: 'libs/php/insertLocation.php',
    method: 'POST',
    data: {
      name: formattedLocationName,
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

// $('#saveLocationBtn').click(function () {
//   const locationName = $('#addLocationName').val().trim();

//   // Close the modal immediately
//   $('#addLocationModal').modal('hide');

//   // Check if the user is authorized
//   if (!isAuth) {
//     $('#messageModal .modal-title').text('Error');
//     $('#messageContent').text('You are not authorized to add new locations.');
//     $('#messageModal').modal('show');
//     return;
//   }

//   // Check if the location name is filled
//   if (!locationName) {
//     $('#messageModal .modal-title').text('Error');
//     $('#messageContent').text('Please enter a location name.');
//     $('#messageModal').modal('show');
//     return;
//   }

//   // Capitalize the location name
//   const formattedLocationName = capitaliseFirstLetter(locationName);

//   // Send AJAX request to add the new location
//   $.ajax({
//     url: 'libs/php/insertLocation.php',
//     method: 'POST',
//     data: {
//       name: formattedLocationName, // Pass the location name to the PHP script
//     },
//     dataType: 'json',
//     success: function (response) {
//       if (response.status.code === '200') {
//         // Refresh the Locations Table
//         populateLocationsTable();

//         // Show success message
//         $('#messageModal .modal-title').text('Success');
//         $('#messageContent').text('Location added successfully!');
//         $('#messageModal').modal('show');
//       } else {
//         $('#messageModal .modal-title').text('Error');
//         $('#messageContent').text('Failed to add location. Please try again.');
//         $('#messageModal').modal('show');
//       }
//     },
//     error: function (xhr, status, error) {
//       console.error('Error during add request:', status, error);
//       $('#messageModal .modal-title').text('Error');
//       $('#messageContent').text(
//         'An error occurred while adding the location. Please try again.'
//       );
//       $('#messageModal').modal('show');
//     },
//   });
// });

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

  // Check if the user is authorized
  if (!isAuth) {
    $('#messageModal .modal-title').text('Error');
    $('#messageContent').text('You are not authorized to add new departments.');
    $('#messageModal').modal('show');
    return;
  }

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
    url: 'libs/php/validateDepartmentLocation.php',
    method: 'POST',
    data: {
      name: formattedDepartmentName, // Check against department name
      locationID: locationID, // Use locationID
    },
    dataType: 'json',
    success: function (response) {
      if (response.status.code === '400') {
        // Show validation error if the department-location association is invalid
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
          name: formattedDepartmentName, // 'name' matches the PHP script
          locationID: locationID, // 'locationID' matches the PHP script
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

//   // Validate department-location association before proceeding
//   $.ajax({
//     url: 'libs/php/validateDepartmentLocation.php',
//     method: 'POST',
//     data: {
//       departmentID: null, // New department, so departmentID is not needed
//       locationID: locationID,
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

// ----------------- Add Department Button Functionality  ----------------

// ----------------- INCOMPLETE  ----------------

// INCOMPLETE - Refreshes table when personnal tab button is clicked

$('#personnelBtn').click(function () {
  // Call function to refresh personnel table
});

// ------------------------------------------------------------------

// INCOMPLETE - Refreshes table when departmets tab button is clicked
$('#departmentsBtn').click(function () {
  // Call function to refresh department table
});

// INCOMPLETE - Refreshes table when locations tab button is clicked
$('#locationsBtn').click(function () {
  // Call function to refresh location table
});

// INCOMPLETE? - Opens edit personnel modal
// $('#editPersonnelModal').on('show.bs.modal', function (e) {
//   $.ajax({
//     url: 'https://coding.itcareerswitch.co.uk/companydirectory/libs/php/getPersonnelByID.php',
//     type: 'POST',
//     dataType: 'json',
//     data: {
//       // Retrieve the data-id attribute from the calling button
//       // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
//       // for the non-jQuery JavaScript alternative
//       id: $(e.relatedTarget).attr('data-id'),
//     },
//     success: function (result) {
//       var resultCode = result.status.code;

//       if (resultCode == 200) {
//         // Update the hidden input with the employee id so that
//         // it can be referenced when the form is submitted

//         $('#editPersonnelEmployeeID').val(result.data.personnel[0].id);

//         $('#editPersonnelFirstName').val(result.data.personnel[0].firstName);
//         $('#editPersonnelLastName').val(result.data.personnel[0].lastName);
//         $('#editPersonnelJobTitle').val(result.data.personnel[0].jobTitle);
//         $('#editPersonnelEmailAddress').val(result.data.personnel[0].email);

//         $('#editPersonnelDepartment').html('');

//         $.each(result.data.department, function () {
//           $('#editPersonnelDepartment').append(
//             $('<option>', {
//               value: this.id,
//               text: this.name,
//             })
//           );
//         });

//         $('#editPersonnelDepartment').val(
//           result.data.personnel[0].departmentID
//         );
//       } else {
//         $('#editPersonnelModal .modal-title').replaceWith(
//           'Error retrieving data'
//         );
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       $('#editPersonnelModal .modal-title').replaceWith(
//         'Error retrieving data'
//       );
//     },
//   });
// });

// Executes when the form button with type="submit" is clicked
$('#editPersonnelForm').on('submit', function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
});

// Even if search was not event driven, conflicts could occur - need handling for if user clicks on result that is no longer there
// test multiple user functionality with multiple browser sesstions

// ADD PRELOADER
