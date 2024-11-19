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

// Call all populateTable() functions on page load
document.addEventListener('DOMContentLoaded', function () {
  populatePersonnelTable();
  populateDepartmentsTable();
  populateLocationsTable();
});

// Filters search bar results and toggles clear search button visibility
// REFACTOR FOR MULTI-USER
$('#searchInp').on('keyup', function () {
  const searchTerm = $(this).val().trim();

  // Show or hide the "Clear Search" text based on input value
  if (searchTerm.length > 0) {
    $('#clearSearch').show();
  } else {
    $('#clearSearch').hide();
  }

  // Normalize input for case-insensitive search
  const normalizedTerm = searchTerm.toLowerCase();

  // Filter Personnel Table
  $('#personnelTableBody tr').each(function () {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(normalizedTerm));
  });

  // Filter Departments Table
  $('#departmentTableBody tr').each(function () {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(normalizedTerm));
  });

  // Filter Locations Table
  $('#locationTableBody tr').each(function () {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(normalizedTerm));
  });
});

// Clears search bar and removes search term filters
// REFACTOR FOR MULTI-USER?
$('#clearSearch').on('click', function () {
  $('#searchInp').val('');
  $(this).hide();

  // Show all rows in all tables
  $(
    '#personnelTableBody tr, #departmentTableBody tr, #locationTableBody tr'
  ).show();
});

// INCOMPLETE - refreshes info for tables with 'active' class
$('#refreshBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    // Check this - will also call functions to populate depts. and locations tables, not very efficient
    fetchAllData();
  } else {
    if ($('#departmentsBtn').hasClass('active')) {
      // Refresh department table
    } else {
      // Refresh location table
    }
  }
});

// INCOMPLETE - Opens modal for filter button
$('#filterBtn').click(function () {
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
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
