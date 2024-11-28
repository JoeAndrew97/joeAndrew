<?php

include("config.php");
include("init.php");

requireAuth(); 

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


$name = $_POST['name'];

if (empty($name)) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid or missing location name.',
        ],
    ]);
    exit;
}


$formattedName = ucwords(strtolower($name));


$query = $conn->prepare('SELECT COUNT(*) AS count FROM location WHERE LOWER(name) = LOWER(?)');
$query->bind_param('s', $formattedName);
$query->execute();
$result = $query->get_result();
$row = $result->fetch_assoc();

if ($row['count'] > 0) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'A location with this name already exists.',
        ],
    ]);
    exit;
}


$query = $conn->prepare('INSERT INTO location (name) VALUES(?)');
$query->bind_param('s', $formattedName);
$query->execute();

if (false === $query) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Query failed',
        ],
    ]);
    exit;
}

echo json_encode([
    'status' => [
        'code' => '200',
        'name' => 'ok',
        'description' => 'Location added successfully.',
    ],
]);

$query->close();
$conn->close();
?>
