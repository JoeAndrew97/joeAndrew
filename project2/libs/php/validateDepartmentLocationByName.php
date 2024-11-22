<?php
// For adding new departments, checks against name rather than ID to prevent duplicates
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

// Check if a department with the same name already exists in the database
$query = $conn->prepare('SELECT locationID FROM department WHERE name = ?');
$query->bind_param('s', $name);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    $existingDepartment = $result->fetch_assoc();

    // If the department exists but in a different location, prevent the addition
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

// If no conflict is found, return success
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
