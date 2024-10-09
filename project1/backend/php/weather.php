<?php
require __DIR__ . "/../config.php";
$apiKey = $config["API_ACCESS"]["OPENWEATHER_API_KEY"];

if (isset($_GET['lat']) && isset($_GET['lng'])) {
    $lat = $_GET['lat'];
    $lng = $_GET['lng'];
    //$apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat={$lat}&lon={$lng}&appid={$apiKey}&units=metric";
    $apiUrl = "api.openweathermap.org/data/2.5/forecast?lat={$lat}&lon={$lng}&appid={$apiKey}";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    header('Content-Type: application/json');
    echo $response;
} else {
    echo json_encode(["error" => "Latitude and Longitude not provided"]);
}
