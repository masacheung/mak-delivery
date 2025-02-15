CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    wechat_id VARCHAR(255) NOT NULL,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pick_up_date TIMESTAMP NOT NULL,
    pick_up_location VARCHAR(255) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    order_details JSONB NOT NULL
);