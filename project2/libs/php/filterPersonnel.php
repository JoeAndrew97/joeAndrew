<?php
    $executionStartTime = microtime(true);

    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        
        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "database unavailable";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;
    }	

    $query = 'SELECT `p`.`id`, `p`.`firstName`, `p`.`lastName`, `p`.`email`, `p`.`jobTitle`, 
                     `d`.`id` as `departmentID`, `d`.`name` AS `departmentName`, 
                     `l`.`id` as `locationID`, `l`.`name` AS `locationName` 
              FROM `personnel` `p` 
              LEFT JOIN `department` `d` ON (`d`.`id` = `p`.`departmentID`) 
              LEFT JOIN `location` `l` ON (`l`.`id` = `d`.`locationID`) 
              WHERE 1=1';

    $params = [];
    $types = '';

    if (isset($_GET['departmentID']) && !empty($_GET['departmentID'])) { // Changed $_REQUEST to $_GET
        $query .= ' AND `d`.`id` = ?'; 
        $params[] = $_GET['departmentID']; // Changed $_REQUEST to $_GET
        $types .= 'i'; 
    }

    if (isset($_GET['locationID']) && !empty($_GET['locationID'])) { // Changed $_REQUEST to $_GET
        $query .= ' AND `l`.`id` = ?'; 
        $params[] = $_GET['locationID']; // Changed $_REQUEST to $_GET
        $types .= 'i'; 
    }

    if (isset($_GET['jobTitle']) && $_GET['jobTitle'] !== '') { // Changed $_REQUEST to $_GET
        $query .= ' AND `p`.`jobTitle` = ?'; 
        $params[] = $_GET['jobTitle']; // Changed $_REQUEST to $_GET
        $types .= 's'; 
    }

    $query .= ' ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`';

    $stmt = $conn->prepare($query);

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();

    if (false === $stmt) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";	
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;
    }
    
    $result = $stmt->get_result();

    $filteredData = [];

    while ($row = mysqli_fetch_assoc($result)) {
        array_push($filteredData, $row);
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data']['filtered'] = $filteredData;
    
    mysqli_close($conn);

    echo json_encode($output); 
?>
