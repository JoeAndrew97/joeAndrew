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


$id = $_POST['id'] ?? null;
$firstName = $_POST['firstName'] ?? null;
$lastName = $_POST['lastName'] ?? null;
$jobTitle = $_POST['jobTitle'] ?? ''; 
$email = $_POST['email'] ?? null;
$departmentID = $_POST['departmentID'] ?? null;

if (!is_numeric($id) || !is_numeric($departmentID) || empty($firstName) || empty($lastName) || empty($email)) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid or missing inputs.',
        ],
    ]);
    exit;
}

$locationQuery = $conn->prepare('SELECT locationID FROM department WHERE id = ?');
$locationQuery->bind_param('i', $departmentID);
$locationQuery->execute();
$locationResult = $locationQuery->get_result();

if ($locationResult->num_rows === 0) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'error',
            'description' => 'Invalid department ID.',
        ],
    ]);
    $locationQuery->close();
    $conn->close();
    exit;
}

$locationRow = $locationResult->fetch_assoc();
$departmentLocationID = $locationRow['locationID'];
$locationQuery->close();

$updateQuery = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?');

if (!$updateQuery) {
    echo json_encode([
        'status' => [
            'code' => '500',
            'name' => 'failure',
            'description' => 'Failed to prepare the update query: ' . $conn->error,
        ],
    ]);
    $conn->close();
    exit;
}

$updateQuery->bind_param('ssssii', $firstName, $lastName, $jobTitle, $email, $departmentID, $id);

if ($updateQuery->execute()) {
    echo json_encode([
        'status' => [
            'code' => '200',
            'name' => 'success',
            'description' => 'Employee updated successfully.',
        ],
        'data' => [
            'locationID' => $departmentLocationID, 
        ],
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => '500',
            'name' => 'failure',
            'description' => 'Failed to execute the update query: ' . $updateQuery->error,
        ],
    ]);
}

$updateQuery->close();
$conn->close();
?>


