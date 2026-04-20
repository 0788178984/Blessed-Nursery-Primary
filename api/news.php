<?php
/**
 * News API Endpoints
 * Handles CRUD operations for news and events
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
                handleListNews();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'get':
            if ($method === 'GET') {
                handleGetNews();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'create':
            if ($method === 'POST') {
                handleCreateNews();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'update':
            if ($method === 'PUT') {
                handleUpdateNews();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'delete':
            if ($method === 'DELETE') {
                handleDeleteNews();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'featured':
            if ($method === 'GET') {
                handleGetFeaturedNews();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'recent':
            if ($method === 'GET') {
                handleGetRecentNews();
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
 * List all news with pagination
 */
function handleListNews() {
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? ADMIN_ITEMS_PER_PAGE);
    $status = $_GET['status'] ?? '';
    $search = $_GET['search'] ?? '';
    $featured = $_GET['featured'] ?? '';
    
    $offset = ($page - 1) * $limit;
    
    $whereConditions = [];
    $params = [];
    
    if (!empty($status)) {
        $whereConditions[] = "n.status = ?";
        $params[] = $status;
    }
    
    if (!empty($featured)) {
        $whereConditions[] = "n.is_featured = ?";
        $params[] = $featured === 'true' ? 1 : 0;
    }
    
    if (!empty($search)) {
        $whereConditions[] = "(n.title LIKE ? OR n.content LIKE ? OR n.excerpt LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM news n $whereClause";
    $total = getSingle($countSql, $params)['total'];
    
    // Get news
    $sql = "SELECT n.*, u.username as created_by_name 
            FROM news n 
            LEFT JOIN users u ON n.created_by = u.id 
            $whereClause 
            ORDER BY n.published_at DESC, n.created_at DESC 
            LIMIT ? OFFSET ?";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $news = getMultiple($sql, $params);
    
    successResponse('News retrieved', [
        'news' => $news,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => ceil($total / $limit),
            'total_items' => $total,
            'items_per_page' => $limit
        ]
    ]);
}

/**
 * Get single news by ID or slug
 */
function handleGetNews() {
    $id = $_GET['id'] ?? '';
    $slug = $_GET['slug'] ?? '';
    
    if (empty($id) && empty($slug)) {
        errorResponse('News ID or slug is required');
    }
    
    $whereClause = !empty($id) ? "n.id = ?" : "n.slug = ?";
    $param = !empty($id) ? $id : $slug;
    
    $news = getSingle(
        "SELECT n.*, u.username as created_by_name 
         FROM news n 
         LEFT JOIN users u ON n.created_by = u.id 
         WHERE $whereClause",
        [$param]
    );
    
    if (!$news) {
        errorResponse('News not found', 404);
    }
    
    successResponse('News retrieved', ['news' => $news]);
}

/**
 * Create new news
 */
function handleCreateNews() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['title']) || !isset($input['slug'])) {
        errorResponse('Title and slug are required');
    }
    
    $title = sanitizeInput($input['title']);
    $slug = sanitizeInput($input['slug']);
    $content = $input['content'] ?? '';
    $excerpt = sanitizeInput($input['excerpt'] ?? '');
    $featured_image = sanitizeInput($input['featured_image'] ?? '');
    $status = sanitizeInput($input['status'] ?? 'draft');
    $is_featured = isset($input['is_featured']) ? (bool)$input['is_featured'] : false;
    $published_at = $input['published_at'] ?? null;
    
    // Check if slug already exists
    $existing = getSingle("SELECT id FROM news WHERE slug = ?", [$slug]);
    if ($existing) {
        errorResponse('Slug already exists');
    }
    
    // Validate status
    if (!in_array($status, ['published', 'draft', 'archived'])) {
        errorResponse('Invalid status');
    }
    
    // Set published_at if status is published and no date provided
    if ($status === 'published' && empty($published_at)) {
        $published_at = date('Y-m-d H:i:s');
    }
    
    $newsId = insertRecord(
        "INSERT INTO news (title, slug, content, excerpt, featured_image, status, is_featured, published_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [$title, $slug, $content, $excerpt, $featured_image, $status, $is_featured, $published_at, $_SESSION['user_id']]
    );
    
    logActivity('news_create', "News created: $title");
    
    successResponse('News created successfully', ['news_id' => $newsId]);
}

/**
 * Update existing news
 */
function handleUpdateNews() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        errorResponse('News ID is required');
    }
    
    $newsId = (int)$input['id'];
    $title = sanitizeInput($input['title'] ?? '');
    $slug = sanitizeInput($input['slug'] ?? '');
    $content = $input['content'] ?? '';
    $excerpt = sanitizeInput($input['excerpt'] ?? '');
    $featured_image = sanitizeInput($input['featured_image'] ?? '');
    $status = sanitizeInput($input['status'] ?? '');
    $is_featured = isset($input['is_featured']) ? (bool)$input['is_featured'] : null;
    $published_at = $input['published_at'] ?? null;
    
    // Check if news exists
    $news = getSingle("SELECT id, title FROM news WHERE id = ?", [$newsId]);
    if (!$news) {
        errorResponse('News not found', 404);
    }
    
    $updateFields = [];
    $params = [];
    
    if (!empty($title)) {
        $updateFields[] = "title = ?";
        $params[] = $title;
    }
    
    if (!empty($slug)) {
        // Check if new slug already exists (excluding current news)
        $existing = getSingle("SELECT id FROM news WHERE slug = ? AND id != ?", [$slug, $newsId]);
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
    
    if (isset($excerpt)) {
        $updateFields[] = "excerpt = ?";
        $params[] = $excerpt;
    }
    
    if (isset($featured_image)) {
        $updateFields[] = "featured_image = ?";
        $params[] = $featured_image;
    }
    
    if (!empty($status)) {
        if (!in_array($status, ['published', 'draft', 'archived'])) {
            errorResponse('Invalid status');
        }
        $updateFields[] = "status = ?";
        $params[] = $status;
        
        // Set published_at if status is published and no date provided
        if ($status === 'published' && empty($published_at)) {
            $updateFields[] = "published_at = ?";
            $params[] = date('Y-m-d H:i:s');
        }
    }
    
    if ($is_featured !== null) {
        $updateFields[] = "is_featured = ?";
        $params[] = $is_featured ? 1 : 0;
    }
    
    if ($published_at !== null) {
        $updateFields[] = "published_at = ?";
        $params[] = $published_at;
    }
    
    if (empty($updateFields)) {
        errorResponse('No fields to update');
    }
    
    $params[] = $newsId;
    
    $sql = "UPDATE news SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $affected = updateRecord($sql, $params);
    
    if ($affected > 0) {
        logActivity('news_update', "News updated: {$news['title']}");
        successResponse('News updated successfully');
    } else {
        errorResponse('No changes made');
    }
}

/**
 * Delete news
 */
function handleDeleteNews() {
    requireAdmin();
    
    $newsId = $_GET['id'] ?? '';
    
    if (empty($newsId)) {
        errorResponse('News ID is required');
    }
    
    $news = getSingle("SELECT id, title FROM news WHERE id = ?", [$newsId]);
    if (!$news) {
        errorResponse('News not found', 404);
    }
    
    $affected = updateRecord("DELETE FROM news WHERE id = ?", [$newsId]);
    
    if ($affected > 0) {
        logActivity('news_delete', "News deleted: {$news['title']}");
        successResponse('News deleted successfully');
    } else {
        errorResponse('Failed to delete news');
    }
}

/**
 * Get featured news
 */
function handleGetFeaturedNews() {
    $limit = (int)($_GET['limit'] ?? 3);
    
    $news = getMultiple(
        "SELECT n.*, u.username as created_by_name 
         FROM news n 
         LEFT JOIN users u ON n.created_by = u.id 
         WHERE n.status = 'published' AND n.is_featured = 1 
         ORDER BY n.published_at DESC 
         LIMIT ?",
        [$limit]
    );
    
    successResponse('Featured news retrieved', ['news' => $news]);
}

/**
 * Get recent news
 */
function handleGetRecentNews() {
    $limit = (int)($_GET['limit'] ?? 6);
    
    $news = getMultiple(
        "SELECT n.*, u.username as created_by_name 
         FROM news n 
         LEFT JOIN users u ON n.created_by = u.id 
         WHERE n.status = 'published' 
         ORDER BY n.published_at DESC 
         LIMIT ?",
        [$limit]
    );
    
    successResponse('Recent news retrieved', ['news' => $news]);
}
?>
