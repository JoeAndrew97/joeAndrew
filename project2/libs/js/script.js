// Uses passed in JSON data to populate the 'Personel' table
function populatePersonnelTable(data) {
  const personnelTableBody = document.getElementById('personnelTableBody');
  personnelTableBody.innerHTML = ''; // Clear any existing rows

  data.forEach((person) => {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td class="align-middle text-nowrap">${person.lastName || ''}, ${
      person.firstName || ''
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
      `;

    personnelTableBody.appendChild(row);
  });
}

// Fetch data from getAll.php and calls populatePersonnelTable(result)
function fetchAllData() {
  fetch('http://localhost/project2/joeAndrew/project2/libs/php/getAll.php')
    .then((response) => response.json())
    .then((result) => {
      if (result.status.code === '200') {
        populatePersonnelTable(result.data);
      } else {
        console.error('Error fetching data:', result.status.description);
      }
    })
    .catch((error) => console.error('Fetch error:', error));
}

// Call fetch function when the page loads
document.addEventListener('DOMContentLoaded', fetchAllData);

// ------------------- Original code below --------------------

// INCOMPLETE - will filter results as search bar inputs are entered
$('#searchInp').on('keyup', function () {
  // your code
});

// INCOMPLETE - refreshes info for tables with 'active' class
$('#refreshBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
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
