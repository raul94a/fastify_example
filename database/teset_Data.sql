-- Users table
INSERT INTO users (email, password, name) VALUES
('john.doe@example.com', 'password123', 'John Doe'),
('jane.doe@example.com', 'password456', 'Jane Doe'),
('jim.smith@example.com', 'password789', 'Jim Smith');

-- Permissions table
INSERT INTO permissions (name) VALUES
('admin'),
('editor'),
('contributor');

-- Events table
INSERT INTO events (name, description, place, is_free) VALUES
('Music Festival', 'A weekend of live music from top artists', 'Central Park, New York', false),
('Art Exhibition', 'A collection of contemporary art from around the world', 'Tate Modern, London', true),
('Charity Run', 'A 5k run to raise money for cancer research', 'Golden Gate Park, San Francisco', false);

-- User_Event_Permission table
INSERT INTO user_event_permission (user_id, event_id, permission_id) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(1, 2, 2),
(2, 2, 3),
(3, 2, 1),
(1, 3, 3),
(2, 3, 1),
(3, 3, 2);

-- Pictures table
INSERT INTO pictures (event_id, user_id, filepath, size) VALUES
(1, 1, '/pictures/music_festival_1.jpg', 1024),
(1, 1, '/pictures/music_festival_2.jpg', 2048),
(1, 2, '/pictures/music_festival_3.jpg', 3072),
(2, 2, '/pictures/art_exhibition_1.jpg', 4096),
(2, 3, '/pictures/art_exhibition_2.jpg', 5120),
(3, 3, '/pictures/charity_run_1.jpg', 6144),
(3, 1, '/pictures/charity_run_2.jpg', 7168),
(3, 2, '/pictures/charity_run_3.jpg', 8192);
