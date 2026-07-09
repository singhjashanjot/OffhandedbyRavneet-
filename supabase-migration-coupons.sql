-- Add coupon columns to workshops table
ALTER TABLE workshops 
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS coupon_discount_percent NUMERIC;

-- Alter column to NUMERIC in case it was previously INT
ALTER TABLE workshops
ALTER COLUMN coupon_discount_percent TYPE NUMERIC;

-- Add coupon columns to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS coupon_discount_percent NUMERIC,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC;

-- Alter column to NUMERIC in case it was previously INT
ALTER TABLE bookings
ALTER COLUMN coupon_discount_percent TYPE NUMERIC;
