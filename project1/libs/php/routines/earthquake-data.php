<?php
require __DIR__ . "/../config.php";
$username= $config["API_ACCESS"]["GEONAMES_USERNAME"];

$url = "http://api.geonames.org/earthquakesJSON?north=".$_REQUEST['latN']."&south=".$_REQUEST['latS']."&east=".$_REQUEST['lngE']."&west=".$_REQUEST['lngW']."&username=" . $username;

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$result = curl_exec($ch);
curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . "ms";
$output['data'] = $decode["earthquakes"];

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);