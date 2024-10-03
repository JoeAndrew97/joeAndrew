<?php
require __DIR__ . "/../config.php";
$app_id= $config["API_ACCESS"]["OPENEXCHANGERATES_API_KEY"];

if (isset($_POST['localCurrency'])) {
    $localCurrency = $_POST['localCurrency'];

    $api_url = "https://openexchangerates.org/api/latest.json?app_id=" . $app_id;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // To return the result as a string

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo json_encode([
            'status' => 'error',
            'message' => curl_error($ch)
        ]);
        curl_close($ch);
        exit();
    }

    curl_close($ch);

    $data = json_decode($response, true);

    if (isset($data['rates'][$localCurrency])) {
        echo json_encode([
            'status' => 'success',
            'rate' => $data['rates'][$localCurrency]
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Currency not found'
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'No currency provided'
    ]);
}