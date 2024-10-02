<?php

$filePath = __DIR__ . '/../resources/countryBorders.geo.json';

if (file_exists($filePath)) {
    $data = json_decode(file_get_contents($filePath), true); 

    function extractCountryData($geoJson) {
        $countryData = [];

        // Loop through each feature in the 'features' array
        foreach ($geoJson['features'] as $feature) {
            $name = $feature['properties']['name'];
            $iso_a3 = $feature['properties']['iso_a3'];

            // Add the extracted data to an array
            $countryData[] = [
                'name' => $name,
                'iso_a3' => $iso_a3
            ];
        }

        return $countryData;
    }

    $extractedData = extractCountryData($data);

    header('Content-Type: application/json');
    echo json_encode($extractedData, JSON_PRETTY_PRINT);
} else {
    header('Content-Type: application/json', true, 404);
    echo json_encode(['error' => 'File not found']);
}
