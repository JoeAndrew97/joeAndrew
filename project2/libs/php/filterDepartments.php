<?php

// Enable error reporting for development (remove in production)
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

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

// SQL query with optional filter for location
$query = 'SELECT `d`.`id` AS `departmentID`, `d`.`name` AS `departmentName`, 
                 `l`.`id` AS `locationID`, `l`.`name` AS `locationName` 
          FROM `department` `d`
          LEFT JOIN `location` `l` ON (`l`.`id` = `d`.`locationID`) 
          WHERE 1=1';

$params = [];
$types = '';

// Add filter dynamically if location is provided
if (isset($_REQUEST['locationID']) && !empty($_REQUEST['locationID'])) {
    $query .= ' AND `l`.`id` = ?';
    $params[] = $_REQUEST['locationID'];
    $types .= 'i'; // Integer type
}


$query .= ' ORDER BY `d`.`name`, `l`.`name`';

// Prepare the SQL statement
$stmt = $conn->prepare($query);

// Bind parameters if any filters were added
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();

if (false === $stmt) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";	
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

$result = $stmt->get_result();

$filteredData = [];

while ($row = mysqli_fetch_assoc($result)) {
    array_push($filteredData, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['filtered'] = $filteredData;

mysqli_close($conn);

echo json_encode($output);

?>

