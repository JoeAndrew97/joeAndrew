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
        echo json_encode($output);
        exit;
    }

    $query = $conn->prepare('INSERT INTO personnel (firstName, lastName, departmentID, email, locationID) VALUES (?, ?, ?, ?, ?)');

    $query->bind_param('ssisi', $_POST['firstName'], $_POST['lastName'], $_POST['departmentID'], $_POST['email'], $_POST['locationID']);

    if (!$query->execute()) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";
        echo json_encode($output);
        exit;
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";

    $query->close();
    $conn->close();

    echo json_encode($output);
?>
