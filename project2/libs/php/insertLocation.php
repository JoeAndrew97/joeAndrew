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

// Validate the location name
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

// Capitalize the first letter of each word in the name
$formattedName = ucwords(strtolower($name));

// Check if the location already exists (case-insensitive)
$query = $conn->prepare('SELECT * FROM location WHERE LOWER(name) = LOWER(?)');
$query->bind_param('s', $formattedName);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'A location with this name already exists.',
        ],
    ]);
    exit;
}

// Insert the new location
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

