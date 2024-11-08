<?php
require __DIR__ . "/../config.php";
$app_id = $config["API_ACCESS"]["OPENEXCHANGERATES_API_KEY"];

$localCurrency = $_POST['localCurrency'];

$api_url = "https://openexchangerates.org/api/latest.json?app_id=" . $app_id;

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

echo json_encode([
    'status' => 'success',
    'rate' => $data['rates'][$localCurrency]
]);
