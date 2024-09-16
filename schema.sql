-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the tasks table
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    dueDate DATETIME,
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    updatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);


-- Password should be hashed before inserting into the database
INSERT INTO users (email, password) VALUES ('mina@example.com', 'hashed_password');

-- Insert task
INSERT INTO tasks (title, description, dueDate, status, userId)
VALUES ('Finish Report', 'Complete the annual report by end of the month', '2024-09-30 23:59:59', 'Pending', 1);