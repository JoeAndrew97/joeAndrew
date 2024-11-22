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
$departmentID = $_POST['departmentID'] ?? null;
$name = $_POST['name'] ?? null;
$locationID = $_POST['locationID'] ?? null;

if (!is_numeric($departmentID) || empty($name) || !is_numeric($locationID)) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid or missing inputs.',
        ],
    ]);
    exit;
}

// Update the department's name and location
$updateQuery = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');
$updateQuery->bind_param('sii', $name, $locationID, $departmentID);

if ($updateQuery->execute()) {
    echo json_encode([
        'status' => [
            'code' => '200',
            'name' => 'success',
            'description' => 'Department updated successfully.',
        ],
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => '500',
            'name' => 'failure',
            'description' => 'Failed to update department: ' . $updateQuery->error,
        ],
    ]);
}

$updateQuery->close();
$conn->close();
?>

