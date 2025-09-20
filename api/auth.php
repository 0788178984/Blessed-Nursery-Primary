<?php
/**
 * Authentication API Endpoints
 * Handles login, logout, and user management
 */

require_once '../config/config.php';

// Set content type to JSON
header('Content-Type: application/json');

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'login':
            if ($method === 'POST') {
                handleLogin();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'logout':
            if ($method === 'POST') {
                handleLogout();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'check':
            if ($method === 'GET') {
                handleCheckAuth();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'register':
            if ($method === 'POST') {
                handleRegister();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'profile':
            if ($method === 'GET') {
                handleGetProfile();
            } elseif ($method === 'PUT') {
                handleUpdateProfile();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        default:
            errorResponse('Invalid action', 400);
    }
} catch (Exception $e) {
    errorResponse($e->getMessage(), 500);
}

/**
 * Handle user login
 */
function handleLogin() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['username']) || !isset($input['password'])) {
        errorResponse('Username and password are required');
    }
    
    $username = sanitizeInput($input['username']);
    $password = $input['password'];
    
    // Get user from database
    $user = getSingle(
        "SELECT id, username, email, password, full_name, role, is_active FROM users WHERE username = ? AND is_active = 1",
        [$username]
    );
    
    if (!$user) {
        errorResponse('Invalid credentials');
    }
    
    // Verify password with MD5
    if (md5($password) !== $user['password']) {
        errorResponse('Invalid credentials');
    }
    
    // Set session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['login_time'] = time();
    
    // Log activity
    logActivity('login', 'User logged in');
    
    successResponse('Login successful', [
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'role' => $user['role']
        ]
    ]);
}

/**
 * Handle user logout
 */
function handleLogout() {
    if (isLoggedIn()) {
        logActivity('logout', 'User logged out');
    }
    
    // Destroy session
    session_destroy();
    
    successResponse('Logout successful');
}

/**
 * Check authentication status
 */
function handleCheckAuth() {
    if (isLoggedIn()) {
        $user = getSingle(
            "SELECT id, username, email, full_name, role FROM users WHERE id = ?",
            [$_SESSION['user_id']]
        );
        
        successResponse('User authenticated', [
            'user' => $user,
            'is_admin' => isAdmin()
        ]);
    } else {
        errorResponse('Not authenticated', 401);
    }
}

/**
 * Handle user registration (admin only)
 */
function handleRegister() {
    requireAdmin();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['username']) || !isset($input['password']) || !isset($input['email']) || !isset($input['full_name'])) {
        errorResponse('All fields are required');
    }
    
    $username = sanitizeInput($input['username']);
    $email = sanitizeInput($input['email']);
    $password = $input['password'];
    $full_name = sanitizeInput($input['full_name']);
    $role = sanitizeInput($input['role'] ?? 'editor');
    
    // Validate email
    if (!validateEmail($email)) {
        errorResponse('Invalid email address');
    }
    
    // Check if username or email already exists
    $existing = getSingle(
        "SELECT id FROM users WHERE username = ? OR email = ?",
        [$username, $email]
    );
    
    if ($existing) {
        errorResponse('Username or email already exists');
    }
    
    // Hash password with MD5
    $hashedPassword = md5($password);
    
    // Insert new user
    $userId = insertRecord(
        "INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)",
        [$username, $email, $hashedPassword, $full_name, $role]
    );
    
    logActivity('register', "New user registered: $username");
    
    successResponse('User registered successfully', ['user_id' => $userId]);
}

/**
 * Get user profile
 */
function handleGetProfile() {
    requireAuth();
    
    $user = getSingle(
        "SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?",
        [$_SESSION['user_id']]
    );
    
    if (!$user) {
        errorResponse('User not found', 404);
    }
    
    successResponse('Profile retrieved', ['user' => $user]);
}

/**
 * Update user profile
 */
function handleUpdateProfile() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        errorResponse('Invalid input data');
    }
    
    $email = sanitizeInput($input['email'] ?? '');
    $full_name = sanitizeInput($input['full_name'] ?? '');
    $password = $input['password'] ?? '';
    
    $updateFields = [];
    $params = [];
    
    if (!empty($email)) {
        if (!validateEmail($email)) {
            errorResponse('Invalid email address');
        }
        
        // Check if email is already taken by another user
        $existing = getSingle(
            "SELECT id FROM users WHERE email = ? AND id != ?",
            [$email, $_SESSION['user_id']]
        );
        
        if ($existing) {
            errorResponse('Email already exists');
        }
        
        $updateFields[] = "email = ?";
        $params[] = $email;
    }
    
    if (!empty($full_name)) {
        $updateFields[] = "full_name = ?";
        $params[] = $full_name;
    }
    
    if (!empty($password)) {
        $updateFields[] = "password = ?";
        $params[] = md5($password);
    }
    
    if (empty($updateFields)) {
        errorResponse('No fields to update');
    }
    
    $params[] = $_SESSION['user_id'];
    
    $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $affected = updateRecord($sql, $params);
    
    if ($affected > 0) {
        logActivity('profile_update', 'Profile updated');
        successResponse('Profile updated successfully');
    } else {
        errorResponse('No changes made');
    }
}
?>
