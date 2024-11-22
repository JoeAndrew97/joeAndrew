<?php

// Enable error reporting for development (remove for production)
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Include the configuration file for database credentials
include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Establish the database connection
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $output['status']['code'] = "405";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Invalid request method";
    echo json_encode($output);
    exit;
}

// Get input data from the POST request
$id = $_POST['id'];
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$jobTitle = $_POST['jobTitle'];
$email = $_POST['email'];
$departmentID = $_POST['departmentID'];

// Validate input data
if (empty($id) || empty($firstName) || empty($lastName) || empty($email) || empty($departmentID)) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Missing required fields";
    echo json_encode($output);
    exit;
}

// Prepare and execute the SQL query to update the personnel record
$stmt = $conn->prepare("UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?");

if (!$stmt) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Failed to prepare statement: " . $conn->error;
    echo json_encode($output);
    exit;
}

$stmt->bind_param('ssssii', $firstName, $lastName, $jobTitle, $email, $departmentID, $id);

if ($stmt->execute()) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Employee updated successfully";
} else {
    $output['status']['code'] = "500";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Failed to execute statement: " . $stmt->error;
}

// Close the statement and the database connection
$stmt->close();
mysqli_close($conn);

// Add timing information to the response
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

// Output the response as JSON
echo json_encode($output);

?>

