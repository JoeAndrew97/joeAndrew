<?php
// Enable error reporting for development
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

$departmentID = $_POST['id'] ?? null;

if (!is_numeric($departmentID)) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid or missing department ID.',
        ],
    ]);
    exit;
}

// Check for dependent personnel
$checkQuery = $conn->prepare('SELECT id FROM personnel WHERE departmentID = ?');
$checkQuery->bind_param('i', $departmentID);
$checkQuery->execute();
$checkResult = $checkQuery->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Department cannot be deleted because it has associated personnel.',
        ],
    ]);
    $checkQuery->close();
    $conn->close();
    exit;
}

// Proceed with deletion
$deleteQuery = $conn->prepare('DELETE FROM department WHERE id = ?');
$deleteQuery->bind_param('i', $departmentID);

if ($deleteQuery->execute()) {
    echo json_encode([
        'status' => [
            'code' => '200',
            'name' => 'success',
            'description' => 'Department deleted successfully.',
        ],
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => '500',
            'name' => 'failure',
            'description' => 'Failed to delete department: ' . $deleteQuery->error,
        ],
    ]);
}

$checkQuery->close();
$deleteQuery->close();
$conn->close();
?>
