<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require __DIR__ . "/../config.php";
$geoNamesUsername = $config["API_ACCESS"]["GEONAMES_USERNAME"];

$countryCode = $_POST['countryCode'];
$apiUrl = "http://api.geonames.org/countryInfoJSON?formatted=true&country=$countryCode&username=$geoNamesUsername";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

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
