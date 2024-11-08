<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$country = urlencode($_GET['country']);
$url = "https://restcountries.com/v3.1/name/$country?fields=flags";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPGET, true);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

header('Content-Type: application/json');
echo json_encode(['flag_url' => $data[0]['flags']['png']]);
