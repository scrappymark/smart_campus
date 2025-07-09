<?php
/**
 * Database Setup Script for Campus Map Editor
 * Run this script to set up the database tables for the map editor
 */

require_once 'config.php';

echo "Setting up database for Campus Map Editor...\n";

try {
    // Read and execute migration SQL
    $migrationSQL = file_get_contents('migration.sql');
    
    // Split SQL into individual statements
    $statements = array_filter(array_map('trim', explode(';', $migrationSQL)));
    
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            $pdo->exec($statement);
            echo "✓ Executed: " . substr($statement, 0, 50) . "...\n";
        }
    }
    
    echo "\n✅ Database setup completed successfully!\n";
    echo "\nTables created:\n";
    echo "- buildings (with new fields: code, department, description)\n";
    echo "- roads (new table)\n";
    echo "- zones (new table)\n";
    echo "- routes (existing)\n";
    echo "- feedback (existing)\n";
    echo "- analytics (existing)\n";
    echo "- users (existing)\n";
    echo "- roles (existing)\n";
    
    echo "\n🎉 You can now use the Campus Map Editor!\n";
    echo "Visit: /public/admin/map-editor.php\n";
    
} catch (PDOException $e) {
    echo "❌ Database setup failed: " . $e->getMessage() . "\n";
    echo "Please check your database connection in config.php\n";
}
?>