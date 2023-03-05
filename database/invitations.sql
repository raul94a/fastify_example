CREATE TABLE invitations (
  id INT NOT NULL AUTO_INCREMENT,
  secret VARCHAR(255) NOT NULL,
  invited_by INT NOT NULL,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  expiration_time TIMESTAMP DEFAULT (NOW() + INTERVAL 24 HOUR),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (invited_by) REFERENCES users(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);
