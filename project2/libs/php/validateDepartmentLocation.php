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

    // Validate inputs to prevent SQL injection
    $departmentID = $_POST['departmentID'];
    $locationID = $_POST['locationID'];

    if (!is_numeric($departmentID) || !is_numeric($locationID)) {
        echo json_encode([
            'status' => [
                'code' => '400',
                'name' => 'error',
                'description' => 'Invalid input format',
            ],
        ]);
        exit;
    }

    // Use prepared statement to validate department and location
    $query = $conn->prepare(
        'SELECT * FROM department WHERE id = ? AND locationID = ?'
    );

    $query->bind_param('ii', $departmentID, $locationID);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows === 0) {
        echo json_encode([
            'status' => [
                'code' => '400',
                'name' => 'error',
                'description' => 'The selected department is not associated with the specified location.',
            ],
        ]);
        exit;
    }

    echo json_encode([
        'status' => [
            'code' => '200',
            'name' => 'success',
            'description' => 'Validation successful',
        ],
    ]);

    $query->close();
    $conn->close();
?>

