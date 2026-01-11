-- Migration: Add pin_code and gender columns to users table
-- Date: 2026-01-11
-- Description: Thêm trường mã PIN (6 chữ số) và giới tính cho bảng users

-- Thêm column pin_code
ALTER TABLE users 
ADD COLUMN pin_code VARCHAR(6) NULL;

-- Thêm column gender
ALTER TABLE users 
ADD COLUMN gender VARCHAR(10) NULL;

-- Thêm comment cho các columns
COMMENT ON COLUMN users.pin_code IS 'Mã PIN 6 chữ số để bảo vệ tài khoản';
COMMENT ON COLUMN users.gender IS 'Giới tính: male, female, other';

-- Tạo index cho pin_code (nếu cần tìm kiếm theo PIN)
-- CREATE INDEX idx_users_pin_code ON users(pin_code);

-- Tạo index cho gender (nếu cần filter theo giới tính)
-- CREATE INDEX idx_users_gender ON users(gender);
