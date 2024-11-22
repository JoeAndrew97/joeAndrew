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

// Query to get department data with location
$query = '
    SELECT 
        department.id AS departmentID,
        department.name AS departmentName,
        location.id AS locationID, 
        location.name AS locationName
    FROM department
    LEFT JOIN location ON department.locationID = location.id
    ORDER BY department.name, location.name
';

$result = $conn->query($query);

if (!$result) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'failure',
            'description' => 'Query failed: ' . $conn->error,
        ],
    ]);
    exit;
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    'status' => [
        'code' => '200',
        'name' => 'ok',
        'description' => 'success',
        'returnedIn' => (microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"]) . " ms",
    ],
    'data' => $data,
]);

$conn->close();




    // CHANGED TO INCLUDE IDs 
    // // Enable error reporting for debugging (remove in production)
    // ini_set('display_errors', 'On');
    // error_reporting(E_ALL);

    // $executionStartTime = microtime(true);

    // include("config.php");

    // header('Content-Type: application/json; charset=UTF-8');

    // $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    // if (mysqli_connect_errno()) {
        
    //     $output['status']['code'] = "300";
    //     $output['status']['name'] = "failure";
    //     $output['status']['description'] = "database unavailable";
    //     $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    //     $output['data'] = [];

    //     mysqli_close($conn);

    //     echo json_encode($output);

    //     exit;
    // }	

    // // Query to join department and location tables
    // $query = 'SELECT d.id AS departmentID, d.name AS departmentName, l.name AS locationName 
    //           FROM department d 
    //           LEFT JOIN location l ON d.locationID = l.id 
    //           ORDER BY d.name';

    // $result = $conn->query($query);
    
    // if (!$result) {
    //     $output['status']['code'] = "400";
    //     $output['status']['name'] = "executed";
    //     $output['status']['description'] = "query failed";	
    //     $output['data'] = [];

    //     mysqli_close($conn);

    //     echo json_encode($output); 

    //     exit;
    // }
   
    // $data = [];

    // while ($row = mysqli_fetch_assoc($result)) {
    //     array_push($data, $row);
    // }

    // $output['status']['code'] = "200";
    // $output['status']['name'] = "ok";
    // $output['status']['description'] = "success";
    // $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    // $output['data'] = $data;
    
    // mysqli_close($conn);

    // echo json_encode($output); 

