<?php
/**
 * Database Setup Script for Blessed Nursery and Primary School
 * Run this script to initialize the database and create default data
 */

// Database configuration
$host = 'localhost';
$dbname = 'blessed_nursery_school';
$username = 'root';
$password = '';

try {
    // Connect to MySQL server (without database)
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h1>Blessed Nursery and Primary School Database Setup</h1>";
    echo "<p>Setting up database and initializing data...</p>";
    
    // Read and execute schema file
    $schema = file_get_contents('database/schema.sql');
    
    // Split by semicolon and execute each statement
    $statements = explode(';', $schema);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            try {
                $pdo->exec($statement);
                echo "<p>✓ Executed: " . substr($statement, 0, 50) . "...</p>";
            } catch (PDOException $e) {
                echo "<p>⚠ Warning: " . $e->getMessage() . "</p>";
            }
        }
    }
    
    echo "<h2>Setup Complete!</h2>";
    echo "<p>Database 'blessed_nursery_school' has been created with all necessary tables and sample data.</p>";
    echo "<h3>Default Admin Credentials:</h3>";
    echo "<ul>";
    echo "<li><strong>Username:</strong> admin</li>";
    echo "<li><strong>Password:</strong> admin123</li>";
    echo "<li><strong>Email:</strong> admin@blessednursery.com</li>";
    echo "</ul>";
    echo "<h3>Next Steps:</h3>";
    echo "<ol>";
    echo "<li>Update database configuration in <code>config/database.php</code> if needed</li>";
    echo "<li>Set up file upload permissions for the <code>uploads/</code> directory</li>";
    echo "<li>Access the admin panel at <a href='admin/login.php'>admin/login.php</a></li>";
    echo "<li>Change the default admin password for security</li>";
    echo "</ol>";
    
    // Test database connection
    echo "<h3>Testing Database Connection:</h3>";
    $testPdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $stmt = $testPdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch();
    echo "<p>✓ Database connection successful. Found {$result['count']} users.</p>";
    
    // Test API endpoints
    echo "<h3>Testing API Endpoints:</h3>";
    $apiTests = [
        'auth.php?action=check' => 'Authentication API',
        'pages.php?action=list&limit=1' => 'Pages API',
        'news.php?action=list&limit=1' => 'News API',
        'programs.php?action=list&limit=1' => 'Programs API',
        'staff.php?action=list&limit=1' => 'Staff API',
        'media.php?action=list&limit=1' => 'Media API',
        'settings.php?action=get' => 'Settings API'
    ];
    
    foreach ($apiTests as $endpoint => $name) {
        $url = "http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/api/$endpoint";
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 5
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        if ($response !== false) {
            $data = json_decode($response, true);
            if ($data && isset($data['success'])) {
                echo "<p>✓ $name: Working</p>";
            } else {
                echo "<p>⚠ $name: Response format issue</p>";
            }
        } else {
            echo "<p>✗ $name: Not accessible</p>";
        }
    }
    
} catch (PDOException $e) {
    echo "<h2>Setup Failed!</h2>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
    echo "<h3>Common Issues:</h3>";
    echo "<ul>";
    echo "<li>Make sure MySQL server is running</li>";
    echo "<li>Check database credentials in this script</li>";
    echo "<li>Ensure the MySQL user has CREATE DATABASE privileges</li>";
    echo "<li>Check file permissions for the database/schema.sql file</li>";
    echo "</ul>";
}
?>

<style>
body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    line-height: 1.6;
}
h1, h2, h3 {
    color: #16a34a;
}
code {
    background: #f4f4f4;
    padding: 2px 4px;
    border-radius: 3px;
}
ul, ol {
    margin: 10px 0;
}
p {
    margin: 5px 0;
}
</style>
