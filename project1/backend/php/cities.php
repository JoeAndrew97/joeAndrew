<?php

$filePath = __DIR__ . '/../resources/filtered_cities.json';

if (isset($_GET['countryCode'])) {
    $countryCode = $_GET['countryCode'];

    $cityData = file_get_contents($filePath);
    $cities = json_decode($cityData, true);

    // Filter the cities for the selected country
    $filteredCities = array_filter($cities, function($city) use ($countryCode) {
        return $city['country'] === $countryCode;
    });

    // Return the filtered data as JSON
    header('Content-Type: application/json');
    echo json_encode(array_values($filteredCities));
} else {
    echo json_encode(['error' => 'No country code provided']);
}
?>
