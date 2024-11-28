<?php
session_start();
include("config.php");

// Utility function to check authentication
function isAuthenticated() {
    return isset($_SESSION['isAuth']) && $_SESSION['isAuth'] === true;
}

// Utility function to require authentication
function requireAuth() {
    if (!isAuthenticated()) {
        echo json_encode([
            'status' => [
                'code' => 403,
                'name' => 'unauthorized',
                'description' => 'You must be logged in to perform this action.',
            ],
        ]);
        exit;
    }
}
?>
