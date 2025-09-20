<?php
/**
 * Settings API Endpoints
 * Handles site settings management
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
        case 'get':
            if ($method === 'GET') {
                handleGetSettings();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'update':
            if ($method === 'PUT') {
                handleUpdateSettings();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'get_by_key':
            if ($method === 'GET') {
                handleGetSettingByKey();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'update_by_key':
            if ($method === 'PUT') {
                handleUpdateSettingByKey();
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
 * Get all settings
 */
function handleGetSettings() {
    $settings = getMultiple("SELECT * FROM settings ORDER BY setting_key ASC");
    
    // Format settings as key-value pairs
    $formattedSettings = [];
    foreach ($settings as $setting) {
        $formattedSettings[$setting['setting_key']] = [
            'value' => $setting['setting_value'],
            'type' => $setting['setting_type'],
            'description' => $setting['description']
        ];
    }
    
    successResponse('Settings retrieved', ['settings' => $formattedSettings]);
}

/**
 * Update multiple settings
 */
function handleUpdateSettings() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['settings'])) {
        errorResponse('Settings data is required');
    }
    
    $settings = $input['settings'];
    $updated = 0;
    $errors = [];
    
    foreach ($settings as $key => $value) {
        try {
            if (updateSetting($key, $value)) {
                $updated++;
            } else {
                $errors[] = "Failed to update $key";
            }
        } catch (Exception $e) {
            $errors[] = "Error updating $key: " . $e->getMessage();
        }
    }
    
    if ($updated > 0) {
        logActivity('settings_update', "Updated $updated settings");
        
        if (!empty($errors)) {
            successResponse("Settings updated with some errors", [
                'updated' => $updated,
                'errors' => $errors
            ]);
        } else {
            successResponse("All settings updated successfully", ['updated' => $updated]);
        }
    } else {
        errorResponse('No settings were updated', 400);
    }
}

/**
 * Get single setting by key
 */
function handleGetSettingByKey() {
    $key = $_GET['key'] ?? '';
    
    if (empty($key)) {
        errorResponse('Setting key is required');
    }
    
    $setting = getSingle("SELECT * FROM settings WHERE setting_key = ?", [$key]);
    
    if (!$setting) {
        errorResponse('Setting not found', 404);
    }
    
    successResponse('Setting retrieved', ['setting' => $setting]);
}

/**
 * Update single setting by key
 */
function handleUpdateSettingByKey() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['key']) || !isset($input['value'])) {
        errorResponse('Setting key and value are required');
    }
    
    $key = sanitizeInput($input['key']);
    $value = $input['value'];
    
    if (updateSetting($key, $value)) {
        logActivity('setting_update', "Setting updated: $key");
        successResponse('Setting updated successfully');
    } else {
        errorResponse('Failed to update setting');
    }
}
?>
