<?php

$url = 'http://api.geonames.org/countryCode?lat='.$_REQUEST['lat'].'&lng='.$_REQUEST['lng'].'&username=joeandrew';

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$result = curl_exec($ch);
$filteredResult = substr($result, 0, 2); // Extract first two letters from string response 
curl_close($ch);

$decode = json_decode($filteredResult, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . "ms";
$output['data'] = $filteredResult;

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
?>
