<?php
session_start(); // Ensure session is started

include 'config.php';

header('Content-Type: application/json');

$username = $_POST['username'] ?? null;
$password = $_POST['password'] ?? null;

// Validate inputs
if (!$username || !$password) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'error',
            'description' => 'Username and password are required',
        ],
    ]);
    exit;
}

// Check username and password
if ($username === $admin_username && password_verify($password, $hashedPassword)) {
    $_SESSION['isAuth'] = true;
    echo json_encode([
        'status' => [
            'code' => 200,
            'name' => 'success',
            'description' => 'Login successful',
        ],
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => 401,
            'name' => 'error',
            'description' => 'Invalid username or password',
        ],
    ]);
}

