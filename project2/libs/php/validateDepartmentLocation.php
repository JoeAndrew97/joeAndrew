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
    
    $departmentID = $_POST['departmentID'] ?? null;
    $locationID = $_POST['locationID'] ?? null;
    
    if (!is_numeric($departmentID) || !is_numeric($locationID)) {
        echo json_encode([
            'status' => [
                'code' => '400',
                'name' => 'error',
                'description' => 'Invalid or missing inputs.',
            ],
        ]);
        exit;
    }
    
    // Specify the exact columns to select
    $query = $conn->prepare('SELECT id, name, locationID FROM department WHERE id = ? AND locationID = ?');
    $query->bind_param('ii', $departmentID, $locationID);
    $query->execute();
    $result = $query->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode([
            'status' => [
                'code' => '400',
                'name' => 'error',
                'description' => 'Invalid department and location association.',
            ],
        ]);
        exit;
    }
    
    echo json_encode([
        'status' => [
            'code' => '200',
            'name' => 'success',
            'description' => 'Validation successful.',
        ],
    ]);
    
    $query->close();
    $conn->close();
?>

