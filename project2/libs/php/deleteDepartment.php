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
    
    $query = $conn->prepare('SELECT COUNT(departmentID) AS count FROM personnel WHERE departmentID = ?');
    $query->bind_param('i', $departmentID);
    $query->execute();
    $result = $query->get_result();
    $row = $result->fetch_assoc();
    
    if ($row['count'] > 0) {
        echo json_encode([
            'status' => [
                'code' => '400',
                'name' => 'error',
                'description' => 'This department cannot be deleted because it has associated personnel.',
            ],
        ]);
        $query->close();
        $conn->close();
        exit;
    }
    
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
                'name' => 'error',
                'description' => 'Failed to delete the department.',
            ],
        ]);
    }
    
    $query->close();
    $deleteQuery->close();
    $conn->close();
?>
