<?php
/**
 * Pages API Endpoints
 * Handles CRUD operations for website pages
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
                handleListPages();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'get':
            if ($method === 'GET') {
                handleGetPage();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'create':
            if ($method === 'POST') {
                handleCreatePage();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'update':
            if ($method === 'PUT') {
                handleUpdatePage();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'delete':
            if ($method === 'DELETE') {
                handleDeletePage();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'publish':
            if ($method === 'POST') {
                handlePublishPage();
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
 * List all pages with pagination
 */
function handleListPages() {
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? ADMIN_ITEMS_PER_PAGE);
    $status = $_GET['status'] ?? '';
    $search = $_GET['search'] ?? '';
    
    $offset = ($page - 1) * $limit;
    
    $whereConditions = [];
    $params = [];
    
    if (!empty($status)) {
        $whereConditions[] = "p.status = ?";
        $params[] = $status;
    }
    
    if (!empty($search)) {
        $whereConditions[] = "(p.title LIKE ? OR p.content LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM pages p $whereClause";
    $total = getSingle($countSql, $params)['total'];
    
    // Get pages
    $sql = "SELECT p.*, u.username as created_by_name 
            FROM pages p 
            LEFT JOIN users u ON p.created_by = u.id 
            $whereClause 
            ORDER BY p.created_at DESC 
            LIMIT ? OFFSET ?";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $pages = getMultiple($sql, $params);
    
    successResponse('Pages retrieved', [
        'pages' => $pages,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => ceil($total / $limit),
            'total_items' => $total,
            'items_per_page' => $limit
        ]
    ]);
}

/**
 * Get single page by ID or slug
 */
function handleGetPage() {
    $id = $_GET['id'] ?? '';
    $slug = $_GET['slug'] ?? '';
    
    if (empty($id) && empty($slug)) {
        errorResponse('Page ID or slug is required');
    }
    
    $whereClause = !empty($id) ? "p.id = ?" : "p.slug = ?";
    $param = !empty($id) ? $id : $slug;
    
    $page = getSingle(
        "SELECT p.*, u.username as created_by_name 
         FROM pages p 
         LEFT JOIN users u ON p.created_by = u.id 
         WHERE $whereClause",
        [$param]
    );
    
    if (!$page) {
        errorResponse('Page not found', 404);
    }
    
    successResponse('Page retrieved', ['page' => $page]);
}

/**
 * Create new page
 */
function handleCreatePage() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['title']) || !isset($input['slug'])) {
        errorResponse('Title and slug are required');
    }
    
    $title = sanitizeInput($input['title']);
    $slug = sanitizeInput($input['slug']);
    $content = $input['content'] ?? '';
    $meta_description = sanitizeInput($input['meta_description'] ?? '');
    $meta_keywords = sanitizeInput($input['meta_keywords'] ?? '');
    $status = sanitizeInput($input['status'] ?? 'draft');
    $template = sanitizeInput($input['template'] ?? 'default');
    $sort_order = (int)($input['sort_order'] ?? 0);
    
    // Check if slug already exists
    $existing = getSingle("SELECT id FROM pages WHERE slug = ?", [$slug]);
    if ($existing) {
        errorResponse('Slug already exists');
    }
    
    // Validate status
    if (!in_array($status, ['published', 'draft', 'archived'])) {
        errorResponse('Invalid status');
    }
    
    $pageId = insertRecord(
        "INSERT INTO pages (title, slug, content, meta_description, meta_keywords, status, template, sort_order, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [$title, $slug, $content, $meta_description, $meta_keywords, $status, $template, $sort_order, $_SESSION['user_id']]
    );
    
    logActivity('page_create', "Page created: $title");
    
    successResponse('Page created successfully', ['page_id' => $pageId]);
}

/**
 * Update existing page
 */
function handleUpdatePage() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        errorResponse('Page ID is required');
    }
    
    $pageId = (int)$input['id'];
    $title = sanitizeInput($input['title'] ?? '');
    $slug = sanitizeInput($input['slug'] ?? '');
    $content = $input['content'] ?? '';
    $meta_description = sanitizeInput($input['meta_description'] ?? '');
    $meta_keywords = sanitizeInput($input['meta_keywords'] ?? '');
    $status = sanitizeInput($input['status'] ?? '');
    $template = sanitizeInput($input['template'] ?? '');
    $sort_order = isset($input['sort_order']) ? (int)$input['sort_order'] : null;
    
    // Check if page exists
    $page = getSingle("SELECT id, title FROM pages WHERE id = ?", [$pageId]);
    if (!$page) {
        errorResponse('Page not found', 404);
    }
    
    $updateFields = [];
    $params = [];
    
    if (!empty($title)) {
        $updateFields[] = "title = ?";
        $params[] = $title;
    }
    
    if (!empty($slug)) {
        // Check if new slug already exists (excluding current page)
        $existing = getSingle("SELECT id FROM pages WHERE slug = ? AND id != ?", [$slug, $pageId]);
        if ($existing) {
            errorResponse('Slug already exists');
        }
        $updateFields[] = "slug = ?";
        $params[] = $slug;
    }
    
    if (isset($content)) {
        $updateFields[] = "content = ?";
        $params[] = $content;
    }
    
    if (isset($meta_description)) {
        $updateFields[] = "meta_description = ?";
        $params[] = $meta_description;
    }
    
    if (isset($meta_keywords)) {
        $updateFields[] = "meta_keywords = ?";
        $params[] = $meta_keywords;
    }
    
    if (!empty($status)) {
        if (!in_array($status, ['published', 'draft', 'archived'])) {
            errorResponse('Invalid status');
        }
        $updateFields[] = "status = ?";
        $params[] = $status;
    }
    
    if (!empty($template)) {
        $updateFields[] = "template = ?";
        $params[] = $template;
    }
    
    if ($sort_order !== null) {
        $updateFields[] = "sort_order = ?";
        $params[] = $sort_order;
    }
    
    if (empty($updateFields)) {
        errorResponse('No fields to update');
    }
    
    $params[] = $pageId;
    
    $sql = "UPDATE pages SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $affected = updateRecord($sql, $params);
    
    if ($affected > 0) {
        logActivity('page_update', "Page updated: {$page['title']}");
        successResponse('Page updated successfully');
    } else {
        errorResponse('No changes made');
    }
}

/**
 * Delete page
 */
function handleDeletePage() {
    requireAdmin();
    
    $pageId = $_GET['id'] ?? '';
    
    if (empty($pageId)) {
        errorResponse('Page ID is required');
    }
    
    $page = getSingle("SELECT id, title FROM pages WHERE id = ?", [$pageId]);
    if (!$page) {
        errorResponse('Page not found', 404);
    }
    
    $affected = updateRecord("DELETE FROM pages WHERE id = ?", [$pageId]);
    
    if ($affected > 0) {
        logActivity('page_delete', "Page deleted: {$page['title']}");
        successResponse('Page deleted successfully');
    } else {
        errorResponse('Failed to delete page');
    }
}

/**
 * Publish/unpublish page
 */
function handlePublishPage() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id']) || !isset($input['status'])) {
        errorResponse('Page ID and status are required');
    }
    
    $pageId = (int)$input['id'];
    $status = sanitizeInput($input['status']);
    
    if (!in_array($status, ['published', 'draft', 'archived'])) {
        errorResponse('Invalid status');
    }
    
    $page = getSingle("SELECT id, title FROM pages WHERE id = ?", [$pageId]);
    if (!$page) {
        errorResponse('Page not found', 404);
    }
    
    $affected = updateRecord("UPDATE pages SET status = ? WHERE id = ?", [$status, $pageId]);
    
    if ($affected > 0) {
        logActivity('page_publish', "Page status changed to $status: {$page['title']}");
        successResponse('Page status updated successfully');
    } else {
        errorResponse('Failed to update page status');
    }
}
?>
