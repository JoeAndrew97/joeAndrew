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

    // Validate inputs
    $name = $_POST['name'];
    $locationID = $_POST['locationID'];

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

    // Check if a department with the same name already exists
    $query = $conn->prepare('SELECT * FROM department WHERE name = ?');
    $query->bind_param('s', $name);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        echo json_encode([
            'status' => [
                'code' => '400',
                'name' => 'error',
                'description' => 'A department with this name already exists.',
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


