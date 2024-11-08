<?php
$filePath = __DIR__ . '/../resources/filtered_cities.json';

$countryCode = $_GET['countryCode'];

$cityData = file_get_contents($filePath);
$cities = json_decode($cityData, true);

$filteredCities = array_filter($cities, function($city) use ($countryCode) {
    return $city['country'] === $countryCode;
});

header('Content-Type: application/json');
echo json_encode(array_values($filteredCities));
