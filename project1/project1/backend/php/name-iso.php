<?php

// Dynamically construct the file path
$filePath = __DIR__ . '/../resources/countryBorders.geo.json';

// Ensure the file exists before proceeding
if (file_exists($filePath)) {
    $data = json_decode(file_get_contents($filePath), true); // Load the GeoJSON file

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

    // Use the function to extract the country data
    $extractedData = extractCountryData($data);

    // Output the result as JSON
    header('Content-Type: application/json');
    echo json_encode($extractedData, JSON_PRETTY_PRINT);
} else {
    // Handle the case where the file is not found
    header('Content-Type: application/json', true, 404);
    echo json_encode(['error' => 'File not found']);
}
