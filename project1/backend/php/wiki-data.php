<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if (isset($_GET['country'])) {
    $country = urlencode($_GET['country']);

    if (strtolower($country) === 'bahamas') {
        $country = 'The_Bahamas';
    }

    $url = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles={$country}&exintro=true&explaintext=true";
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
    curl_setopt($ch, CURLOPT_HTTPGET, true); 

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo json_encode(['error' => curl_error($ch)]);
    } else {
        $data = json_decode($response, true);

        header('Content-Type: application/json'); 
        echo json_encode($data); 
    }

    curl_close($ch);
} else {
    echo json_encode(['error' => 'No country specified']);
}
