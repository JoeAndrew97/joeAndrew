<?php

include("init.php");
requireAuth(); 

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
$personnelID = $_POST['id'] ?? null;

if (!is_numeric($personnelID)) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid or missing personnel ID.',
        ],
    ]);
    exit;
}

// Proceed with deletion
$query = $conn->prepare('DELETE FROM personnel WHERE id = ?');
$query->bind_param('i', $personnelID);

if ($query->execute()) {
    echo json_encode([
        'status' => [
            'code' => '200',
            'name' => 'success',
            'description' => 'Personnel deleted successfully.',
        ],
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => '500',
            'name' => 'error',
            'description' => 'Failed to delete personnel: ' . $query->error,
        ],
    ]);
}

$query->close();
$conn->close();
?>


