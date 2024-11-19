<?php

    // Enable error reporting for development (remove in production)
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

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

    // Insert data into the personnel table
    $query = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES (?, ?, ?, ?, ?)');

    $query->bind_param(
        'ssssi', 
        $_POST['firstName'], 
        $_POST['lastName'], 
        $_POST['jobTitle'], 
        $_POST['email'], 
        $_POST['departmentID']  // This should be passed from the client-side form
    );

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
