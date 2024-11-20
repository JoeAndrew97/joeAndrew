<?php

// currently not used 


include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    echo json_encode(['status' => ['code' => 300, 'name' => 'failure', 'description' => 'database unavailable']]);
    exit;
}

$query = 'SELECT DISTINCT jobTitle AS name FROM personnel WHERE jobTitle IS NOT NULL AND jobTitle != "" ORDER BY jobTitle';

$result = $conn->query($query);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(['status' => ['code' => 200, 'name' => 'ok', 'description' => 'success'], 'data' => $data]);

$conn->close();
?>
