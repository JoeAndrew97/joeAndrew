<?php

// For API and CORS issues
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$url = 'https://restcountries.com/v3.1/all';

// Initialize cURL session and set options 
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
curl_setopt($ch, CURLOPT_HTTPGET, true); 

// Execute cURL request
$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(['error' => curl_error($ch)]);
} else {
    // Decode the JSON response
    $data = json_decode($response, true);

    header('Content-Type: application/json'); 
    // Convert the PHP array back to JSON
    echo json_encode($data); 
}

curl_close($ch);

?>

