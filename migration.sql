-- Create database
CREATE DATABASE IF NOT EXISTS campus_nav;
USE campus_nav;

-- Buildings table
CREATE TABLE IF NOT EXISTS buildings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    department VARCHAR(100),
    lat DOUBLE NOT NULL,
    lng DOUBLE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Roads table
CREATE TABLE IF NOT EXISTS roads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    width INT DEFAULT 3,
    description TEXT,
    coordinates_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Zones table
CREATE TABLE IF NOT EXISTS zones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#fd7e14',
    description TEXT,
    coordinates_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_id INT NOT NULL,
    to_id INT NOT NULL,
    path_json TEXT NOT NULL,
    distance FLOAT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_id) REFERENCES buildings(id) ON DELETE CASCADE,
    FOREIGN KEY (to_id) REFERENCES buildings(id) ON DELETE CASCADE
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message TEXT NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table (for chart data)
CREATE TABLE IF NOT EXISTS analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT NOT NULL,
    building_id INT NOT NULL,
    access_count INT DEFAULT 0,
    last_accessed DATETIME,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role) REFERENCES roles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);