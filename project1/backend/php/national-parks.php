<?php

$jsonFilePath = __DIR__ . '/../resources/national_parks.json';

if (file_exists($jsonFilePath) && is_readable($jsonFilePath)) {
    if (isset($_POST['countryCode'])) {
        $countryCode = $_POST['countryCode'];

        $jsonData = file_get_contents($jsonFilePath);

        $nationalParks = json_decode($jsonData, true);

        $filteredParks = array_filter($nationalParks, function($park) use ($countryCode) {
            return $park['countryCode'] === $countryCode;
        });

        echo json_encode(array_values($filteredParks)); 
    } else {
        echo json_encode(['error' => 'No country code provided']);
    }
} else {
    echo json_encode(['error' => 'Unable to load national parks data']);
}
