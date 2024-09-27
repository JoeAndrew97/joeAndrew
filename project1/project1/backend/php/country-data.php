<?php
// ---- cURL request to RESTcountries API
// Enable CORS headers for cross-origin access
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// The URL to fetch country data from the Rest Countries API
$url = 'https://restcountries.com/v3.1/all';

// Initialize cURL session and set options
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPGET, true);

// Execute cURL request
$response = curl_exec($ch);

if (curl_errno($ch)) {
    // Return a JSON-encoded error
    echo json_encode(['error' => curl_error($ch)]);
} else {
    // Decode the JSON response
    $data = json_decode($response, true);

    // If cURL returns invalid JSON, handle the error
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['error' => 'Failed to parse JSON']);
    } else {
        // Ensure no extra output before or after the JSON response
        ob_clean(); // Clean output buffer before sending JSON response

        // Output the JSON data
        echo json_encode($data);
    }
}

curl_close($ch);