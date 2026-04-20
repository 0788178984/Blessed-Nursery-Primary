<?php
/**
 * Media API Endpoints
 * Handles file upload and media management
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
        case 'upload':
            if ($method === 'POST') {
                handleFileUpload();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'list':
            if ($method === 'GET') {
                handleListMedia();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'get':
            if ($method === 'GET') {
                handleGetMedia();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'update':
            if ($method === 'PUT') {
                handleUpdateMedia();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'delete':
            if ($method === 'DELETE') {
                handleDeleteMedia();
            } else {
                errorResponse('Method not allowed', 405);
            }
            break;
            
        case 'by_type':
            if ($method === 'GET') {
                handleGetMediaByType();
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
 * Handle file upload
 */
function handleFileUpload() {
    requireAuth();
    
    if (!isset($_FILES['file'])) {
        errorResponse('No file uploaded');
    }
    
    $file = $_FILES['file'];
    $directory = sanitizeInput($_POST['directory'] ?? 'general');
    $alt_text = sanitizeInput($_POST['alt_text'] ?? '');
    $caption = sanitizeInput($_POST['caption'] ?? '');
    
    try {
        $uploadResult = uploadFile($file, $directory);
        
        // Save to database
        $mediaId = insertRecord(
            "INSERT INTO media (filename, original_name, file_path, file_type, file_size, alt_text, caption, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $uploadResult['filename'],
                $uploadResult['original_name'],
                $uploadResult['file_path'],
                $uploadResult['file_type'],
                $uploadResult['file_size'],
                $alt_text,
                $caption,
                $_SESSION['user_id']
            ]
        );
        
        logActivity('media_upload', "File uploaded: {$uploadResult['original_name']}");
        
        successResponse('File uploaded successfully', [
            'media_id' => $mediaId,
            'file' => [
                'id' => $mediaId,
                'filename' => $uploadResult['filename'],
                'original_name' => $uploadResult['original_name'],
                'file_path' => $uploadResult['file_path'],
                'file_type' => $uploadResult['file_type'],
                'file_size' => $uploadResult['file_size'],
                'alt_text' => $alt_text,
                'caption' => $caption,
                'url' => SITE_URL . '/' . $uploadResult['file_path']
            ]
        ]);
        
    } catch (Exception $e) {
        errorResponse($e->getMessage());
    }
}

/**
 * List all media with pagination
 */
function handleListMedia() {
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? ADMIN_ITEMS_PER_PAGE);
    $type = $_GET['type'] ?? '';
    $search = $_GET['search'] ?? '';
    
    $offset = ($page - 1) * $limit;
    
    $whereConditions = [];
    $params = [];
    
    if (!empty($type)) {
        $whereConditions[] = "m.file_type LIKE ?";
        $params[] = "$type%";
    }
    
    if (!empty($search)) {
        $whereConditions[] = "(m.original_name LIKE ? OR m.alt_text LIKE ? OR m.caption LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM media m $whereClause";
    $total = getSingle($countSql, $params)['total'];
    
    // Get media
    $sql = "SELECT m.*, u.username as uploaded_by_name 
            FROM media m 
            LEFT JOIN users u ON m.uploaded_by = u.id 
            $whereClause 
            ORDER BY m.created_at DESC 
            LIMIT ? OFFSET ?";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $media = getMultiple($sql, $params);
    
    // Add full URL to each media item
    foreach ($media as &$item) {
        $item['url'] = SITE_URL . '/' . $item['file_path'];
    }
    
    successResponse('Media retrieved', [
        'media' => $media,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => ceil($total / $limit),
            'total_items' => $total,
            'items_per_page' => $limit
        ]
    ]);
}

/**
 * Get single media by ID
 */
function handleGetMedia() {
    $id = $_GET['id'] ?? '';
    
    if (empty($id)) {
        errorResponse('Media ID is required');
    }
    
    $media = getSingle(
        "SELECT m.*, u.username as uploaded_by_name 
         FROM media m 
         LEFT JOIN users u ON m.uploaded_by = u.id 
         WHERE m.id = ?",
        [$id]
    );
    
    if (!$media) {
        errorResponse('Media not found', 404);
    }
    
    $media['url'] = SITE_URL . '/' . $media['file_path'];
    
    successResponse('Media retrieved', ['media' => $media]);
}

/**
 * Update media metadata
 */
function handleUpdateMedia() {
    requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        errorResponse('Media ID is required');
    }
    
    $mediaId = (int)$input['id'];
    $alt_text = sanitizeInput($input['alt_text'] ?? '');
    $caption = sanitizeInput($input['caption'] ?? '');
    
    // Check if media exists
    $media = getSingle("SELECT id, original_name FROM media WHERE id = ?", [$mediaId]);
    if (!$media) {
        errorResponse('Media not found', 404);
    }
    
    $affected = updateRecord(
        "UPDATE media SET alt_text = ?, caption = ? WHERE id = ?",
        [$alt_text, $caption, $mediaId]
    );
    
    if ($affected > 0) {
        logActivity('media_update', "Media updated: {$media['original_name']}");
        successResponse('Media updated successfully');
    } else {
        errorResponse('No changes made');
    }
}

/**
 * Delete media
 */
function handleDeleteMedia() {
    requireAuth();
    
    $mediaId = $_GET['id'] ?? '';
    
    if (empty($mediaId)) {
        errorResponse('Media ID is required');
    }
    
    $media = getSingle("SELECT id, file_path, original_name FROM media WHERE id = ?", [$mediaId]);
    if (!$media) {
        errorResponse('Media not found', 404);
    }
    
    // Delete physical file
    if (file_exists($media['file_path'])) {
        deleteFile($media['file_path']);
    }
    
    // Delete database record
    $affected = updateRecord("DELETE FROM media WHERE id = ?", [$mediaId]);
    
    if ($affected > 0) {
        logActivity('media_delete', "Media deleted: {$media['original_name']}");
        successResponse('Media deleted successfully');
    } else {
        errorResponse('Failed to delete media');
    }
}

/**
 * Get media by type
 */
function handleGetMediaByType() {
    $type = $_GET['type'] ?? '';
    $limit = (int)($_GET['limit'] ?? 0);
    
    if (empty($type)) {
        errorResponse('Type is required');
    }
    
    $whereConditions = ["m.file_type LIKE ?"];
    $params = ["$type%"];
    
    $limitClause = $limit > 0 ? "LIMIT ?" : "";
    if ($limit > 0) {
        $params[] = $limit;
    }
    
    $media = getMultiple(
        "SELECT m.*, u.username as uploaded_by_name 
         FROM media m 
         LEFT JOIN users u ON m.uploaded_by = u.id 
         WHERE " . implode(" AND ", $whereConditions) . " 
         ORDER BY m.created_at DESC 
         $limitClause",
        $params
    );
    
    // Add full URL to each media item
    foreach ($media as &$item) {
        $item['url'] = SITE_URL . '/' . $item['file_path'];
    }
    
    successResponse('Media retrieved', ['media' => $media]);
}
?>
