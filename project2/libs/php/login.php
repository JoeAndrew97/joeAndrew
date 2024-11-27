<?php
session_start();

include("config.php");

// Validate inputs
$username = $_POST['username'] ?? null;
$password = $_POST['password'] ?? null;

if (!$username || !$password) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'error',
            'description' => 'Missing username or password.',
        ],
    ]);
    exit;
}

// Check credentials
if ($username === $admin_username && password_verify($password, $hashedPassword)) {
    $_SESSION['isAuth'] = true; // Set session variable
    echo json_encode([
        'status' => [
            'code' => 200,
            'name' => 'success',
            'description' => 'Login successful.',
        ],
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => 401,
            'name' => 'error',
            'description' => 'Invalid username or password.',
        ],
    ]);
}
?>


