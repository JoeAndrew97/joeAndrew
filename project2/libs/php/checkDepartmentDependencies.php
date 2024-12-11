<?php
include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port);

if (mysqli_connect_errno()) {
    echo json_encode(['status' => ['code' => 300, 'name' => 'failure', 'description' => 'Database unavailable']]);
    exit;
}

$departmentID = $_GET['id'] ?? null;

if (!is_numeric($departmentID)) {
    echo json_encode(['status' => ['code' => 400, 'name' => 'error', 'description' => 'Invalid ID']]);
    exit;
}

$query = $conn->prepare("SELECT COUNT(id) AS count FROM personnel WHERE departmentID = ?");
$query->bind_param("i", $departmentID);
$query->execute();

$result = $query->get_result();
$data = $result->fetch_assoc();

echo json_encode(['status' => ['code' => 200, 'name' => 'ok'], 'data' => $data]);

$query->close();
$conn->close();
?>
