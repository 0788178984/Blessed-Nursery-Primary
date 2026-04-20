<?php
/**
 * Contact API Endpoints
 * Handles contact form submissions and contact management
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
        case 'submit':
            if ($method === 'POST') {
                handleContactSubmit();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'list':
            if ($method === 'GET') {
                handleListMessages();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'get':
            if ($method === 'GET') {
                handleGetMessage();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'update_status':
            if ($method === 'PUT') {
                handleUpdateStatus();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'delete':
            if ($method === 'DELETE') {
                handleDeleteMessage();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'stats':
            if ($method === 'GET') {
                handleGetStats();
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
 * Handle contact form submission
 */
function handleContactSubmit() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        errorResponse('Invalid input data');
    }
    
    $name = sanitizeInput($input['name'] ?? '');
    $email = sanitizeInput($input['email'] ?? '');
    $phone = sanitizeInput($input['phone'] ?? '');
    $subject = sanitizeInput($input['subject'] ?? '');
    $message = sanitizeInput($input['message'] ?? '');
    
    // Validation
    if (empty($name) || empty($email) || empty($message)) {
        errorResponse('Name, email, and message are required');
    }
    
    if (!validateEmail($email)) {
        errorResponse('Invalid email address');
    }
    
    // Get IP address
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // Insert contact message
    $messageId = insertRecord(
        "INSERT INTO contact_messages (name, email, phone, subject, message, ip_address) VALUES (?, ?, ?, ?, ?, ?)",
        [$name, $email, $phone, $subject, $message, $ip_address]
    );
    
    // Send email notification (optional)
    try {
        $adminEmail = getSetting('contact_email', ADMIN_EMAIL);
        $siteName = getSetting('site_title', SITE_NAME);
        
        $emailSubject = "New Contact Message - $siteName";
        $emailBody = "
        New contact message received:
        
        Name: $name
        Email: $email
        Phone: $phone
        Subject: $subject
        
        Message:
        $message
        
        IP Address: $ip_address
        Time: " . date('Y-m-d H:i:s') . "
        ";
        
        // In a real implementation, you would use a proper email library
        // mail($adminEmail, $emailSubject, $emailBody);
        
    } catch (Exception $e) {
        // Log error but don't fail the request
        error_log("Email notification failed: " . $e->getMessage());
    }
    
    successResponse('Message sent successfully. We will get back to you soon!', ['message_id' => $messageId]);
}

/**
 * List contact messages with pagination
 */
function handleListMessages() {
    requireAuth();
    
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? ADMIN_ITEMS_PER_PAGE);
    $status = $_GET['status'] ?? '';
    $search = $_GET['search'] ?? '';
    
    $offset = ($page - 1) * $limit;
    
    $whereConditions = [];
    $params = [];
    
    if (!empty($status)) {
        $whereConditions[] = "cm.status = ?";
        $params[] = $status;
    }
    
    if (!empty($search)) {
        $whereConditions[] = "(cm.name LIKE ? OR cm.email LIKE ? OR cm.subject LIKE ? OR cm.message LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM contact_messages cm $whereClause";
    $total = getSingle($countSql, $params)['total'];
    
    // Get messages
    $sql = "SELECT cm.* 
            FROM contact_messages cm 
            $whereClause 
            ORDER BY cm.created_at DESC 
            LIMIT ? OFFSET ?";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $messages = getMultiple($sql, $params);
    
    successResponse('Messages retrieved', [
        'messages' => $messages,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => ceil($total / $limit),
            'total_items' => $total,
            'items_per_page' => $limit
        ]
    ]);
}

/**
 * Get single contact message
 */
function handleGetMessage() {
    requireAuth();
    
    $id = $_GET['id'] ?? '';
    
    if (empty($id)) {
        errorResponse('Message ID is required');
    }
    
    $message = getSingle("SELECT * FROM contact_messages WHERE id = ?", [$id]);
    
    if (!$message) {
        errorResponse('Message not found', 404);
    }
    
    // Mark as read if it's new
    if ($message['status'] === 'new') {
        updateRecord("UPDATE contact_messages SET status = 'read' WHERE id = ?", [$id]);
        $message['status'] = 'read';
    }
    
    successResponse('Message retrieved', ['message' => $message]);
}

/**
 * Update message status
 */
function handleUpdateStatus() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id']) || !isset($input['status'])) {
        errorResponse('Message ID and status are required');
    }
    
    $messageId = (int)$input['id'];
    $status = sanitizeInput($input['status']);
    
    if (!in_array($status, ['new', 'read', 'replied', 'archived'])) {
        errorResponse('Invalid status');
    }
    
    $message = getSingle("SELECT id, name FROM contact_messages WHERE id = ?", [$messageId]);
    if (!$message) {
        errorResponse('Message not found', 404);
    }
    
    $affected = updateRecord("UPDATE contact_messages SET status = ? WHERE id = ?", [$status, $messageId]);
    
    if ($affected > 0) {
        logActivity('contact_status_update', "Message status updated to $status: {$message['name']}");
        successResponse('Message status updated successfully');
    } else {
        errorResponse('Failed to update message status');
    }
}

/**
 * Delete contact message
 */
function handleDeleteMessage() {
    requireAdmin();
    
    $messageId = $_GET['id'] ?? '';
    
    if (empty($messageId)) {
        errorResponse('Message ID is required');
    }
    
    $message = getSingle("SELECT id, name FROM contact_messages WHERE id = ?", [$messageId]);
    if (!$message) {
        errorResponse('Message not found', 404);
    }
    
    $affected = updateRecord("DELETE FROM contact_messages WHERE id = ?", [$messageId]);
    
    if ($affected > 0) {
        logActivity('contact_delete', "Message deleted: {$message['name']}");
        successResponse('Message deleted successfully');
    } else {
        errorResponse('Failed to delete message');
    }
}

/**
 * Get contact statistics
 */
function handleGetStats() {
    requireAuth();
    
    $stats = [
        'total' => getSingle("SELECT COUNT(*) as total FROM contact_messages")['total'],
        'new' => getSingle("SELECT COUNT(*) as total FROM contact_messages WHERE status = 'new'")['total'],
        'read' => getSingle("SELECT COUNT(*) as total FROM contact_messages WHERE status = 'read'")['total'],
        'replied' => getSingle("SELECT COUNT(*) as total FROM contact_messages WHERE status = 'replied'")['total'],
        'archived' => getSingle("SELECT COUNT(*) as total FROM contact_messages WHERE status = 'archived'")['total'],
        'today' => getSingle("SELECT COUNT(*) as total FROM contact_messages WHERE DATE(created_at) = CURDATE()")['total'],
        'this_week' => getSingle("SELECT COUNT(*) as total FROM contact_messages WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)")['total'],
        'this_month' => getSingle("SELECT COUNT(*) as total FROM contact_messages WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)")['total']
    ];
    
    successResponse('Statistics retrieved', ['stats' => $stats]);
}
?>
