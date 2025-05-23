<?php

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

$checkQuery = $conn->prepare('SELECT id, locationID FROM department WHERE name = ? AND id != ?');
$checkQuery->bind_param('si', $name, $departmentID);
$checkQuery->execute();
$result = $checkQuery->get_result();

if ($result->num_rows > 0) {
    $existingDepartment = $result->fetch_assoc();

    if ($existingDepartment['locationID'] != $locationID) {
        echo json_encode([
            'status' => [
                'code' => '400',
                'name' => 'error',
                'description' => 'A department with this name already exists in another location. Only one location is allowed per department.',
            ],
        ]);
        $checkQuery->close();
        $conn->close();
        exit;
    }
}

$checkQuery->close();

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
