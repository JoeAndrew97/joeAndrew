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

$name = $_POST['name'] ?? null;
$locationID = $_POST['locationID'] ?? null;

if (empty($name) || !is_numeric($locationID)) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid or missing inputs.',
        ],
    ]);
    exit;
}

$query = $conn->prepare('SELECT locationID FROM department WHERE name = ?');
$query->bind_param('s', $name);
$query->execute();
$result = $query->get_result();

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
        $query->close();
        $conn->close();
        exit;
    }
}

echo json_encode([
    'status' => [
        'code' => '200',
        'name' => 'success',
        'description' => 'Validation successful. No duplicate department found.',
    ],
]);

$query->close();
$conn->close();
?>
