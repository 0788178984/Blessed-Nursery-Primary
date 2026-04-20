<?php
/**
 * Staff API Endpoints
 * Handles CRUD operations for staff directory
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
        case 'list':
            if ($method === 'GET') {
                handleListStaff();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'get':
            if ($method === 'GET') {
                handleGetStaff();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'create':
            if ($method === 'POST') {
                handleCreateStaff();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'update':
            if ($method === 'PUT') {
                handleUpdateStaff();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'delete':
            if ($method === 'DELETE') {
                handleDeleteStaff();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'by_department':
            if ($method === 'GET') {
                handleGetStaffByDepartment();
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
 * List all staff with pagination
 */
function handleListStaff() {
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? ADMIN_ITEMS_PER_PAGE);
    $department = $_GET['department'] ?? '';
    $search = $_GET['search'] ?? '';
    $active_only = $_GET['active_only'] ?? 'true';
    
    $offset = ($page - 1) * $limit;
    
    $whereConditions = [];
    $params = [];
    
    if ($active_only === 'true') {
        $whereConditions[] = "s.is_active = 1";
    }
    
    if (!empty($department)) {
        $whereConditions[] = "s.department = ?";
        $params[] = $department;
    }
    
    if (!empty($search)) {
        $whereConditions[] = "(s.full_name LIKE ? OR s.position LIKE ? OR s.department LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM staff s $whereClause";
    $total = getSingle($countSql, $params)['total'];
    
    // Get staff
    $sql = "SELECT s.* 
            FROM staff s 
            $whereClause 
            ORDER BY s.sort_order ASC, s.full_name ASC 
            LIMIT ? OFFSET ?";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $staff = getMultiple($sql, $params);
    
    successResponse('Staff retrieved', [
        'staff' => $staff,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => ceil($total / $limit),
            'total_items' => $total,
            'items_per_page' => $limit
        ]
    ]);
}

/**
 * Get single staff member by ID
 */
function handleGetStaff() {
    $id = $_GET['id'] ?? '';
    
    if (empty($id)) {
        errorResponse('Staff ID is required');
    }
    
    $staff = getSingle("SELECT * FROM staff WHERE id = ?", [$id]);
    
    if (!$staff) {
        errorResponse('Staff member not found', 404);
    }
    
    successResponse('Staff member retrieved', ['staff' => $staff]);
}

/**
 * Create new staff member
 */
function handleCreateStaff() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['full_name']) || !isset($input['position'])) {
        errorResponse('Full name and position are required');
    }
    
    $full_name = sanitizeInput($input['full_name']);
    $position = sanitizeInput($input['position']);
    $department = sanitizeInput($input['department'] ?? '');
    $email = sanitizeInput($input['email'] ?? '');
    $phone = sanitizeInput($input['phone'] ?? '');
    $bio = sanitizeInput($input['bio'] ?? '');
    $qualifications = sanitizeInput($input['qualifications'] ?? '');
    $profile_image = sanitizeInput($input['profile_image'] ?? '');
    $is_active = isset($input['is_active']) ? (bool)$input['is_active'] : true;
    $sort_order = (int)($input['sort_order'] ?? 0);
    
    // Validate email if provided
    if (!empty($email) && !validateEmail($email)) {
        errorResponse('Invalid email address');
    }
    
    $staffId = insertRecord(
        "INSERT INTO staff (full_name, position, department, email, phone, bio, qualifications, profile_image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [$full_name, $position, $department, $email, $phone, $bio, $qualifications, $profile_image, $is_active ? 1 : 0, $sort_order]
    );
    
    logActivity('staff_create', "Staff member created: $full_name");
    
    successResponse('Staff member created successfully', ['staff_id' => $staffId]);
}

/**
 * Update existing staff member
 */
function handleUpdateStaff() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        errorResponse('Staff ID is required');
    }
    
    $staffId = (int)$input['id'];
    $full_name = sanitizeInput($input['full_name'] ?? '');
    $position = sanitizeInput($input['position'] ?? '');
    $department = sanitizeInput($input['department'] ?? '');
    $email = sanitizeInput($input['email'] ?? '');
    $phone = sanitizeInput($input['phone'] ?? '');
    $bio = sanitizeInput($input['bio'] ?? '');
    $qualifications = sanitizeInput($input['qualifications'] ?? '');
    $profile_image = sanitizeInput($input['profile_image'] ?? '');
    $is_active = isset($input['is_active']) ? (bool)$input['is_active'] : null;
    $sort_order = isset($input['sort_order']) ? (int)$input['sort_order'] : null;
    
    // Check if staff exists
    $staff = getSingle("SELECT id, full_name FROM staff WHERE id = ?", [$staffId]);
    if (!$staff) {
        errorResponse('Staff member not found', 404);
    }
    
    $updateFields = [];
    $params = [];
    
    if (!empty($full_name)) {
        $updateFields[] = "full_name = ?";
        $params[] = $full_name;
    }
    
    if (!empty($position)) {
        $updateFields[] = "position = ?";
        $params[] = $position;
    }
    
    if (isset($department)) {
        $updateFields[] = "department = ?";
        $params[] = $department;
    }
    
    if (isset($email)) {
        if (!empty($email) && !validateEmail($email)) {
            errorResponse('Invalid email address');
        }
        $updateFields[] = "email = ?";
        $params[] = $email;
    }
    
    if (isset($phone)) {
        $updateFields[] = "phone = ?";
        $params[] = $phone;
    }
    
    if (isset($bio)) {
        $updateFields[] = "bio = ?";
        $params[] = $bio;
    }
    
    if (isset($qualifications)) {
        $updateFields[] = "qualifications = ?";
        $params[] = $qualifications;
    }
    
    if (isset($profile_image)) {
        $updateFields[] = "profile_image = ?";
        $params[] = $profile_image;
    }
    
    if ($is_active !== null) {
        $updateFields[] = "is_active = ?";
        $params[] = $is_active ? 1 : 0;
    }
    
    if ($sort_order !== null) {
        $updateFields[] = "sort_order = ?";
        $params[] = $sort_order;
    }
    
    if (empty($updateFields)) {
        errorResponse('No fields to update');
    }
    
    $params[] = $staffId;
    
    $sql = "UPDATE staff SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $affected = updateRecord($sql, $params);
    
    if ($affected > 0) {
        logActivity('staff_update', "Staff member updated: {$staff['full_name']}");
        successResponse('Staff member updated successfully');
    } else {
        errorResponse('No changes made');
    }
}

/**
 * Delete staff member
 */
function handleDeleteStaff() {
    requireAdmin();
    
    $staffId = $_GET['id'] ?? '';
    
    if (empty($staffId)) {
        errorResponse('Staff ID is required');
    }
    
    $staff = getSingle("SELECT id, full_name FROM staff WHERE id = ?", [$staffId]);
    if (!$staff) {
        errorResponse('Staff member not found', 404);
    }
    
    $affected = updateRecord("DELETE FROM staff WHERE id = ?", [$staffId]);
    
    if ($affected > 0) {
        logActivity('staff_delete', "Staff member deleted: {$staff['full_name']}");
        successResponse('Staff member deleted successfully');
    } else {
        errorResponse('Failed to delete staff member');
    }
}

/**
 * Get staff by department
 */
function handleGetStaffByDepartment() {
    $department = $_GET['department'] ?? '';
    $active_only = $_GET['active_only'] ?? 'true';
    
    if (empty($department)) {
        errorResponse('Department is required');
    }
    
    $whereConditions = ["s.department = ?"];
    $params = [$department];
    
    if ($active_only === 'true') {
        $whereConditions[] = "s.is_active = 1";
    }
    
    $staff = getMultiple(
        "SELECT s.* 
         FROM staff s 
         WHERE " . implode(" AND ", $whereConditions) . " 
         ORDER BY s.sort_order ASC, s.full_name ASC",
        $params
    );
    
    successResponse('Staff retrieved', ['staff' => $staff]);
}
?>
