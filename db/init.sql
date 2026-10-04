CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    location VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO items (name, type, location)
VALUES
    ('Black Wallet', 'lost', 'Library'),
    ('Blue Umbrella', 'found', 'Cafeteria');
