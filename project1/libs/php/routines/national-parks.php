<?php
    $jsonFilePath = __DIR__ . '/../resources/national_parks.json';

    $countryCode = $_POST['countryCode'];
    $jsonData = file_get_contents($jsonFilePath);
    $nationalParks = json_decode($jsonData, true);
    
    $filteredParks = array_filter($nationalParks, function($park) use ($countryCode) {
        return $park['countryCode'] === $countryCode;
    });
    
    echo json_encode(array_values($filteredParks));
