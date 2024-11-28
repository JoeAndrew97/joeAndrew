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

$departmentID = $_GET['departmentID'] ?? null;

if (!is_numeric($departmentID)) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid department ID.',
        ],
    ]);
    exit;
}

$query = $conn->prepare('SELECT l.name AS locationName FROM department d JOIN location l ON d.locationID = l.id WHERE d.id = ?');
$query->bind_param('i', $departmentID);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        'status' => [
            'code' => '200',
            'name' => 'success',
            'description' => 'Location fetched successfully.',
        ],
        'data' => $row,
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => '404',
            'name' => 'error',
            'description' => 'Location not found.',
        ],
    ]);
}

$query->close();
$conn->close();
?>
