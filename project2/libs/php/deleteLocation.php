<?php
// Enable error reporting for development
// A location cannot be deleted if it has associated departments (department.locationID)
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

$locationID = $_POST['id'] ?? null;

if (!is_numeric($locationID)) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid or missing location ID.',
        ],
    ]);
    exit;
}

// Check for dependent departments
$checkQuery = $conn->prepare('SELECT id FROM department WHERE locationID = ?');
$checkQuery->bind_param('i', $locationID);
$checkQuery->execute();
$checkResult = $checkQuery->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Location cannot be deleted because it has associated departments.',
        ],
    ]);
    $checkQuery->close();
    $conn->close();
    exit;
}

// Proceed with deletion
$deleteQuery = $conn->prepare('DELETE FROM location WHERE id = ?');
$deleteQuery->bind_param('i', $locationID);

if ($deleteQuery->execute()) {
    echo json_encode([
        'status' => [
            'code' => '200',
            'name' => 'success',
            'description' => 'Location deleted successfully.',
        ],
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => '500',
            'name' => 'failure',
            'description' => 'Failed to delete location: ' . $deleteQuery->error,
        ],
    ]);
}

$checkQuery->close();
$deleteQuery->close();
$conn->close();
?>
