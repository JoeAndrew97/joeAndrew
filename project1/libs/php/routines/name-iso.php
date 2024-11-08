<?php
$filePath = __DIR__ . '/../resources/countryBorders.geo.json';

$data = json_decode(file_get_contents($filePath), true);

function extractCountryData($geoJson) {
    $countryData = [];

    foreach ($geoJson['features'] as $feature) {
        $name = $feature['properties']['name'];
        $iso_a2 = $feature['properties']['iso_a2'];

        $countryData[] = [
            'name' => $name,
            'iso_a2' => $iso_a2,
        ];
    }

    return $countryData;
}

$extractedData = extractCountryData($data);

header('Content-Type: application/json');
echo json_encode($extractedData, JSON_PRETTY_PRINT);
