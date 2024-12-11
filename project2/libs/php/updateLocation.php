<?php

include("config.php");
// include("init.php");

// requireAuth();

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
$name = $_POST['name'] ?? null;

if (!is_numeric($locationID) || empty($name)) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid or missing inputs.',
        ],
    ]);
    exit;
}

$checkQuery = $conn->prepare('SELECT id FROM location WHERE name = ? AND id != ?');
$checkQuery->bind_param('si', $name, $locationID);
$checkQuery->execute();
$checkResult = $checkQuery->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'A location with this name already exists.',
        ],
    ]);
    $checkQuery->close();
    $conn->close();
    exit;
}

$updateQuery = $conn->prepare('UPDATE location SET name = ? WHERE id = ?');
$updateQuery->bind_param('si', $name, $locationID);

if ($updateQuery->execute()) {
    echo json_encode([
        'status' => [
            'code' => '200',
            'name' => 'success',
            'description' => 'Location updated successfully.',
        ],
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => '500',
            'name' => 'failure',
            'description' => 'Failed to update location: ' . $updateQuery->error,
        ],
    ]);
}

$checkQuery->close();
$updateQuery->close();
$conn->close();
?>
