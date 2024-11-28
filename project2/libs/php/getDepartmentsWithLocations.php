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

$query = '
    SELECT 
        department.id AS departmentID,
        department.name AS departmentName,
        location.id AS locationID, 
        location.name AS locationName
    FROM department
    LEFT JOIN location ON department.locationID = location.id
    ORDER BY department.name, location.name
';

$result = $conn->query($query);

if (!$result) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'failure',
            'description' => 'Query failed: ' . $conn->error,
        ],
    ]);
    exit;
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    'status' => [
        'code' => '200',
        'name' => 'ok',
        'description' => 'success',
        'returnedIn' => (microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"]) . " ms",
    ],
    'data' => $data,
]);

$conn->close(); 
