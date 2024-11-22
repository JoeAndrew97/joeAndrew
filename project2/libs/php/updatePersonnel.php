<?php
// Enable error reporting for development (remove in production)
ini_set('display_errors', 'On');
error_reporting(E_ALL);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    echo json_encode([
        'status' => [
            'code' => '300',
            'name' => 'failure',
            'description' => 'Database unavailable',
        ],
    ]);
    exit;
}

// Validate inputs
$id = $_POST['id'] ?? null;
$firstName = $_POST['firstName'] ?? null;
$lastName = $_POST['lastName'] ?? null;
$jobTitle = $_POST['jobTitle'] ?? ''; // Optional
$email = $_POST['email'] ?? null;
$departmentID = $_POST['departmentID'] ?? null;

if (!is_numeric($id) || !is_numeric($departmentID) || empty($firstName) || empty($lastName) || empty($email)) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid or missing inputs.',
        ],
    ]);
    exit;
}

// Step 1: Fetch the locationID associated with the departmentID
$locationQuery = $conn->prepare('SELECT locationID FROM department WHERE id = ?');
$locationQuery->bind_param('i', $departmentID);
$locationQuery->execute();
$locationResult = $locationQuery->get_result();

if ($locationResult->num_rows === 0) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid department ID.',
        ],
    ]);
    $locationQuery->close();
    $conn->close();
    exit;
}

$locationRow = $locationResult->fetch_assoc();
$departmentLocationID = $locationRow['locationID'];
$locationQuery->close();

// Step 2: Validate that the employee is assigned a valid department for their location
// Fetch the employee's current locationID based on departmentID
$employeeLocationQuery = $conn->prepare('SELECT d.locationID FROM personnel p JOIN department d ON p.departmentID = d.id WHERE p.id = ?');
$employeeLocationQuery->bind_param('i', $id);
$employeeLocationQuery->execute();
$employeeLocationResult = $employeeLocationQuery->get_result();

if ($employeeLocationResult->num_rows === 0) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid employee ID or department association.',
        ],
    ]);
    $employeeLocationQuery->close();
    $conn->close();
    exit;
}

$employeeLocationRow = $employeeLocationResult->fetch_assoc();
$employeeLocationID = $employeeLocationRow['locationID'];
$employeeLocationQuery->close();

// Check if the department's location matches the employee's location
if ($departmentLocationID !== $employeeLocationID) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'The selected department does not belong to the employee\'s location.',
        ],
    ]);
    $conn->close();
    exit;
}

// Step 3: Update the personnel record
$updateQuery = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?');

if (!$updateQuery) {
    echo json_encode([
        'status' => [
            'code' => '500',
            'name' => 'failure',
            'description' => 'Failed to prepare the update query: ' . $conn->error,
        ],
    ]);
    $conn->close();
    exit;
}

$updateQuery->bind_param('ssssii', $firstName, $lastName, $jobTitle, $email, $departmentID, $id);

if ($updateQuery->execute()) {
    echo json_encode([
        'status' => [
            'code' => '200',
            'name' => 'success',
            'description' => 'Employee updated successfully.',
        ],
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => '500',
            'name' => 'failure',
            'description' => 'Failed to execute the update query: ' . $updateQuery->error,
        ],
    ]);
}

$updateQuery->close();
$conn->close();
?>

