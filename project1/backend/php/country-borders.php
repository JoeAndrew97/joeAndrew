<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

$filePath = __DIR__ . '/../resources/countryBorders.geo.json';

if (isset($_GET['countryCode'])) {
    $countryCode = $_GET['countryCode'];

    $data = file_get_contents($filePath);
    $geoJson = json_decode($data, true);

    $countryFeature = null;
    foreach ($geoJson['features'] as $feature) {
        if ($feature['properties']['iso_a3'] === $countryCode) {
            $countryFeature = $feature;
            break;
        }
    }

    if ($countryFeature) {
        echo json_encode($countryFeature);
    } else {
        echo json_encode(['error' => 'Country not found']);
    }
} else {
    echo json_encode(['error' => 'No country code specified']);
}

