<?php
require __DIR__ . "/../config.php";
$username = $config["API_ACCESS"]["GEONAMES_USERNAME"];

$lat = $_GET['lat'];
$lng = $_GET['lng'];

$url = "http://api.geonames.org/countryCodeJSON?lat=$lat&lng=$lng&username=$username";

$response = file_get_contents($url);
$data = json_decode($response, true);

echo json_encode(['status' => 'ok', 'countryCode' => $data['countryCode']]);
