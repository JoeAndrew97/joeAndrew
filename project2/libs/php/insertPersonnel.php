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

    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $jobTitle = $_POST['jobTitle'];
    $email = $_POST['email'];
    $departmentID = $_POST['departmentID'];

    if (!is_numeric($departmentID) || empty($firstName) || empty($lastName) || empty($email)) {
        echo json_encode([
            'status' => [
                'code' => '400',
                'name' => 'error',
                'description' => 'Invalid input format',
            ],
        ]);
        exit;
    }

$query = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES (?, ?, ?, ?, ?)');

$query->bind_param(
    'ssssi',
    $_POST['firstName'],
    $_POST['lastName'],
    $_POST['jobTitle'], 
    $_POST['email'],
    $_POST['departmentID']
);

if (!$query->execute()) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    echo json_encode($output);
    exit;
}


    echo json_encode([
        'status' => [
            'code' => '200',
            'name' => 'success',
            'description' => 'Personnel added successfully',
        ],
    ]);

    $query->close();
    $conn->close();
?>