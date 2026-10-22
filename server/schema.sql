CREATE DATABASE IF NOT EXISTS dairy_management;
USE dairy_management;

CREATE TABLE IF NOT EXISTS customers (
  cust_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cust_name VARCHAR(120) NOT NULL,
  cust_contact VARCHAR(20) NOT NULL,
  cust_address VARCHAR(255) NOT NULL DEFAULT '',
  cattle_type ENUM('Cow', 'Buffalo', 'Mixed') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_customers_name (cust_name),
  INDEX idx_customers_contact (cust_contact)
);

CREATE TABLE IF NOT EXISTS daily_collection (
  ID BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  time TIME NULL,
  shift ENUM('Morning', 'Evening') NOT NULL,
  litre DECIMAL(10,2) NOT NULL,
  fat DECIMAL(5,2) NOT NULL DEFAULT 0,
  lacto DECIMAL(5,2) NOT NULL DEFAULT 0,
  snf DECIMAL(5,2) NOT NULL DEFAULT 0,
  rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_customer_date_shift (customer_id, date, shift),
  CONSTRAINT fk_collection_customer FOREIGN KEY (customer_id) REFERENCES customers(cust_id)
);

CREATE TABLE IF NOT EXISTS payments (
  ID BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT UNSIGNED NOT NULL,
  days INT UNSIGNED NOT NULL DEFAULT 0,
  total_litres DECIMAL(12,2) NOT NULL DEFAULT 0,
  avg_fat DECIMAL(5,2) NOT NULL DEFAULT 0,
  avg_snf DECIMAL(5,2) NOT NULL DEFAULT 0,
  avg_lacto DECIMAL(5,2) NOT NULL DEFAULT 0,
  avg_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_customer FOREIGN KEY (customer_id) REFERENCES customers(cust_id)
);
