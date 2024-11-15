// Called by fetchAllData()
function populatePersonnelTable(data) {
  const $personnelTableBody = $('#personnelTableBody');
  $personnelTableBody.empty(); // Clear any existing rows

  data.forEach((person) => {
    const rowHtml = `
      <tr>
        <td class="align-middle text-nowrap">${person.lastName || 'N/A'}, ${
      person.firstName || 'N/A'
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
}

// Called by fetchAllData() -- !check that correct values are used as identifiers when edit department modal appears! -- existing HTML uses data.id - may need to refer to DB
function populateDepartmentsTable(data) {
  const $departmentsTableBody = $('#departmentTableBody');
  $departmentsTableBody.empty();

  // Create a Map to store unique departments and their locations
  const departmentsMap = new Map();

  // Iterate through the data to populate the map
  data.forEach((person) => {
    const department = person.department || 'Unknown';
    const location = person.location || 'Unknown';

    // Use the department as the key and location as the value
    if (!departmentsMap.has(department)) {
      departmentsMap.set(department, location);
    }
  });

  // Iterate through the map to build table rows
  departmentsMap.forEach((location, department) => {
    const rowHtml = `
      <tr>
        <td class="align-middle text-nowrap">${department}</td>
        <td class="align-middle text-nowrap d-none d-md-table-cell">${location}</td>
        <td class="align-middle text-end text-nowrap">
          <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-department="${department}">
            <i class="fa-solid fa-pencil fa-fw"></i>
          </button>
          <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-department="${department}">
            <i class="fa-solid fa-trash fa-fw"></i>
          </button>
        </td>
      </tr>
    `;
    $departmentsTableBody.append(rowHtml);
  });
}

// Called by fetchAllData()
function populateLocationsTable(data) {
  const $locationTableBody = $('#locationTableBody');
  $locationTableBody.empty();

  // Create a Set to store unique locations
  const locationsSet = new Set();

  // Iterate through the data to populate the Set
  data.forEach((person) => {
    const location = person.location || 'Unknown';
    locationsSet.add(location); // Add unique locations to the Set
  });

  // Iterate through the Set to build table rows
  locationsSet.forEach((location) => {
    const rowHtml = `
      <tr>
        <td class="align-middle text-nowrap">${location}</td>
        <td class="align-middle text-end text-nowrap">
          <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-location="${location}">
            <i class="fa-solid fa-pencil fa-fw"></i>
          </button>
          <button type="button" class="btn btn-primary btn-sm deleteLocationBtn" data-location="${location}">
            <i class="fa-solid fa-trash fa-fw"></i>
          </button>
        </td>
      </tr>
    `;
    $locationTableBody.append(rowHtml);
  });
}

// Fetch data from getAll.php and calls each populate table function
function fetchAllData() {
  fetch('http://localhost/project2/joeAndrew/project2/libs/php/getAll.php')
    .then((response) => response.json())
    .then((result) => {
      if (result.status.code === '200') {
        populatePersonnelTable(result.data);
        populateDepartmentsTable(result.data);
        populateLocationsTable(result.data);
      } else {
        console.error('Error fetching data:', result.status.description);
      }
    })
    .catch((error) => console.error('Fetch error:', error));
}

// Calls fetchAllData to populate all tables on page load
document.addEventListener('DOMContentLoaded', fetchAllData);

// ------------------- Original code below --------------------

// INCOMPLETE - will filter results as search bar inputs are entered
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

// Clear search bar and hide the "Clear Search" text when clicked
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
