<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if (isset($_GET['country'])) {
    $country = urlencode($_GET['country']);
    
    $url = "https://restcountries.com/v3.1/name/$country?fields=flags";

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

        if (isset($data[0]['flags']['png'])) {
            echo json_encode(['flag_url' => $data[0]['flags']['png']]);
        } else {
            echo json_encode(['error' => 'Flag not found']);
        }
    }
    curl_close($ch);
} else {
    echo json_encode(['error' => 'No country specified']);
}
