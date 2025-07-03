CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pick_up_date TIMESTAMP NOT NULL,
    pick_up_location VARCHAR(255) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    order_details JSONB NOT NULL,
    notes TEXT
);

CREATE TABLE admin_config (
    id SERIAL PRIMARY KEY,
    pick_up_date TIMESTAMP NOT NULL,
    pick_up_locations TEXT[] NOT NULL,
    restaurants TEXT[] NOT NULL
);

-- Users table for account management
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6),
    verification_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_phone ON users(phone_number);