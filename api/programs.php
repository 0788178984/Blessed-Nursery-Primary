<?php
/**
 * Programs API Endpoints
 * Handles CRUD operations for academic programs
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
                handleListPrograms();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'get':
            if ($method === 'GET') {
                handleGetProgram();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'create':
            if ($method === 'POST') {
                handleCreateProgram();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'update':
            if ($method === 'PUT') {
                handleUpdateProgram();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'delete':
            if ($method === 'DELETE') {
                handleDeleteProgram();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'by_level':
            if ($method === 'GET') {
                handleGetProgramsByLevel();
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
 * List all programs with pagination
 */
function handleListPrograms() {
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? ADMIN_ITEMS_PER_PAGE);
    $status = $_GET['status'] ?? '';
    $level = $_GET['level'] ?? '';
    $search = $_GET['search'] ?? '';
    
    $offset = ($page - 1) * $limit;
    
    $whereConditions = [];
    $params = [];
    
    if (!empty($status)) {
        $whereConditions[] = "p.status = ?";
        $params[] = $status;
    }
    
    if (!empty($level)) {
        $whereConditions[] = "p.level = ?";
        $params[] = $level;
    }
    
    if (!empty($search)) {
        $whereConditions[] = "(p.title LIKE ? OR p.description LIKE ? OR p.content LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM programs p $whereClause";
    $total = getSingle($countSql, $params)['total'];
    
    // Get programs
    $sql = "SELECT p.*, u.username as created_by_name 
            FROM programs p 
            LEFT JOIN users u ON p.created_by = u.id 
            $whereClause 
            ORDER BY p.sort_order ASC, p.created_at DESC 
            LIMIT ? OFFSET ?";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $programs = getMultiple($sql, $params);
    
    successResponse('Programs retrieved', [
        'programs' => $programs,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => ceil($total / $limit),
            'total_items' => $total,
            'items_per_page' => $limit
        ]
    ]);
}

/**
 * Get single program by ID or slug
 */
function handleGetProgram() {
    $id = $_GET['id'] ?? '';
    $slug = $_GET['slug'] ?? '';
    
    if (empty($id) && empty($slug)) {
        errorResponse('Program ID or slug is required');
    }
    
    $whereClause = !empty($id) ? "p.id = ?" : "p.slug = ?";
    $param = !empty($id) ? $id : $slug;
    
    $program = getSingle(
        "SELECT p.*, u.username as created_by_name 
         FROM programs p 
         LEFT JOIN users u ON p.created_by = u.id 
         WHERE $whereClause",
        [$param]
    );
    
    if (!$program) {
        errorResponse('Program not found', 404);
    }
    
    successResponse('Program retrieved', ['program' => $program]);
}

/**
 * Create new program
 */
function handleCreateProgram() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['title']) || !isset($input['slug']) || !isset($input['level'])) {
        errorResponse('Title, slug, and level are required');
    }
    
    $title = sanitizeInput($input['title']);
    $slug = sanitizeInput($input['slug']);
    $description = sanitizeInput($input['description'] ?? '');
    $content = $input['content'] ?? '';
    $duration = sanitizeInput($input['duration'] ?? '');
    $level = sanitizeInput($input['level']);
    $requirements = sanitizeInput($input['requirements'] ?? '');
    $fees = isset($input['fees']) ? (float)$input['fees'] : null;
    $featured_image = sanitizeInput($input['featured_image'] ?? '');
    $status = sanitizeInput($input['status'] ?? 'active');
    $sort_order = (int)($input['sort_order'] ?? 0);
    
    // Check if slug already exists
    $existing = getSingle("SELECT id FROM programs WHERE slug = ?", [$slug]);
    if ($existing) {
        errorResponse('Slug already exists');
    }
    
    // Validate level
    if (!in_array($level, ['certificate', 'diploma', 'degree', 'masters', 'phd'])) {
        errorResponse('Invalid level');
    }
    
    // Validate status
    if (!in_array($status, ['active', 'inactive', 'archived'])) {
        errorResponse('Invalid status');
    }
    
    $programId = insertRecord(
        "INSERT INTO programs (title, slug, description, content, duration, level, requirements, fees, featured_image, status, sort_order, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [$title, $slug, $description, $content, $duration, $level, $requirements, $fees, $featured_image, $status, $sort_order, $_SESSION['user_id']]
    );
    
    logActivity('program_create', "Program created: $title");
    
    successResponse('Program created successfully', ['program_id' => $programId]);
}

/**
 * Update existing program
 */
function handleUpdateProgram() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        errorResponse('Program ID is required');
    }
    
    $programId = (int)$input['id'];
    $title = sanitizeInput($input['title'] ?? '');
    $slug = sanitizeInput($input['slug'] ?? '');
    $description = sanitizeInput($input['description'] ?? '');
    $content = $input['content'] ?? '';
    $duration = sanitizeInput($input['duration'] ?? '');
    $level = sanitizeInput($input['level'] ?? '');
    $requirements = sanitizeInput($input['requirements'] ?? '');
    $fees = isset($input['fees']) ? (float)$input['fees'] : null;
    $featured_image = sanitizeInput($input['featured_image'] ?? '');
    $status = sanitizeInput($input['status'] ?? '');
    $sort_order = isset($input['sort_order']) ? (int)$input['sort_order'] : null;
    
    // Check if program exists
    $program = getSingle("SELECT id, title FROM programs WHERE id = ?", [$programId]);
    if (!$program) {
        errorResponse('Program not found', 404);
    }
    
    $updateFields = [];
    $params = [];
    
    if (!empty($title)) {
        $updateFields[] = "title = ?";
        $params[] = $title;
    }
    
    if (!empty($slug)) {
        // Check if new slug already exists (excluding current program)
        $existing = getSingle("SELECT id FROM programs WHERE slug = ? AND id != ?", [$slug, $programId]);
        if ($existing) {
            errorResponse('Slug already exists');
        }
        $updateFields[] = "slug = ?";
        $params[] = $slug;
    }
    
    if (isset($description)) {
        $updateFields[] = "description = ?";
        $params[] = $description;
    }
    
    if (isset($content)) {
        $updateFields[] = "content = ?";
        $params[] = $content;
    }
    
    if (isset($duration)) {
        $updateFields[] = "duration = ?";
        $params[] = $duration;
    }
    
    if (!empty($level)) {
        if (!in_array($level, ['certificate', 'diploma', 'degree', 'masters', 'phd'])) {
            errorResponse('Invalid level');
        }
        $updateFields[] = "level = ?";
        $params[] = $level;
    }
    
    if (isset($requirements)) {
        $updateFields[] = "requirements = ?";
        $params[] = $requirements;
    }
    
    if ($fees !== null) {
        $updateFields[] = "fees = ?";
        $params[] = $fees;
    }
    
    if (isset($featured_image)) {
        $updateFields[] = "featured_image = ?";
        $params[] = $featured_image;
    }
    
    if (!empty($status)) {
        if (!in_array($status, ['active', 'inactive', 'archived'])) {
            errorResponse('Invalid status');
        }
        $updateFields[] = "status = ?";
        $params[] = $status;
    }
    
    if ($sort_order !== null) {
        $updateFields[] = "sort_order = ?";
        $params[] = $sort_order;
    }
    
    if (empty($updateFields)) {
        errorResponse('No fields to update');
    }
    
    $params[] = $programId;
    
    $sql = "UPDATE programs SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $affected = updateRecord($sql, $params);
    
    if ($affected > 0) {
        logActivity('program_update', "Program updated: {$program['title']}");
        successResponse('Program updated successfully');
    } else {
        errorResponse('No changes made');
    }
}

/**
 * Delete program
 */
function handleDeleteProgram() {
    requireAdmin();
    
    $programId = $_GET['id'] ?? '';
    
    if (empty($programId)) {
        errorResponse('Program ID is required');
    }
    
    $program = getSingle("SELECT id, title FROM programs WHERE id = ?", [$programId]);
    if (!$program) {
        errorResponse('Program not found', 404);
    }
    
    $affected = updateRecord("DELETE FROM programs WHERE id = ?", [$programId]);
    
    if ($affected > 0) {
        logActivity('program_delete', "Program deleted: {$program['title']}");
        successResponse('Program deleted successfully');
    } else {
        errorResponse('Failed to delete program');
    }
}

/**
 * Get programs by level
 */
function handleGetProgramsByLevel() {
    $level = $_GET['level'] ?? '';
    $status = $_GET['status'] ?? 'active';
    $limit = (int)($_GET['limit'] ?? 0);
    
    if (empty($level)) {
        errorResponse('Level is required');
    }
    
    if (!in_array($level, ['certificate', 'diploma', 'degree', 'masters', 'phd'])) {
        errorResponse('Invalid level');
    }
    
    $whereConditions = ["p.level = ?", "p.status = ?"];
    $params = [$level, $status];
    
    $limitClause = $limit > 0 ? "LIMIT ?" : "";
    if ($limit > 0) {
        $params[] = $limit;
    }
    
    $programs = getMultiple(
        "SELECT p.*, u.username as created_by_name 
         FROM programs p 
         LEFT JOIN users u ON p.created_by = u.id 
         WHERE " . implode(" AND ", $whereConditions) . " 
         ORDER BY p.sort_order ASC, p.created_at DESC 
         $limitClause",
        $params
    );
    
    successResponse('Programs retrieved', ['programs' => $programs]);
}
?>
