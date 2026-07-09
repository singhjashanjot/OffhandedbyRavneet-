-- Add coupon columns to workshops table
ALTER TABLE workshops 
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS coupon_discount_percent INT;

-- Add coupon columns to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS coupon_discount_percent INT,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC;
