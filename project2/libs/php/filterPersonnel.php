<?php
$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Base query
$query = 'SELECT p.id, p.firstName, p.lastName, p.email, p.jobTitle, 
                 d.name AS departmentName, l.name AS locationName
          FROM personnel p
          LEFT JOIN department d ON p.departmentID = d.id
          LEFT JOIN location l ON d.locationID = l.id
          WHERE 1=1';

// Add filters dynamically
$params = [];
$types = '';

if (isset($_GET['departmentID']) && $_GET['departmentID'] != '0') {
    $query .= ' AND d.id = ?';
    $params[] = $_GET['departmentID'];
    $types .= 'i';
}

if (isset($_GET['locationID']) && $_GET['locationID'] != '0') {
    $query .= ' AND l.id = ?';
    $params[] = $_GET['locationID'];
    $types .= 'i';
}

$query .= ' ORDER BY p.lastName, p.firstName';

$stmt = $conn->prepare($query);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['data']['filtered'] = $data;

echo json_encode($output);
?>
