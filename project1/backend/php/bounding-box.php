<?php
// For API and CORS issues
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Check if country code is provided
if (!isset($_POST['countryCode'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'No country code provided'
    ]);
    exit();
}

// GeoNames username HIDE USERNAME ---------------
$geoNamesUsername = 'joeandrew'; 

$countryCode = $_POST['countryCode'];


$apiUrl = "http://api.geonames.org/countryInfoJSON?formatted=true&country=$countryCode&username=$geoNamesUsername";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);


$data = json_decode($response, true);


if (isset($data['geonames']) && !empty($data['geonames'])) {
    $countryInfo = $data['geonames'][0];

    // Extract bounding box coordinates
    $boundingBox = [
        'north' => $countryInfo['north'],
        'south' => $countryInfo['south'],
        'east'  => $countryInfo['east'],
        'west'  => $countryInfo['west']
    ];

    // Return the bounding box as a JSON response
    echo json_encode([
        'status' => 'ok',
        'boundingBox' => $boundingBox
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Unable to fetch bounding box data'
    ]);
}
?>
