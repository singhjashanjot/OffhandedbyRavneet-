-- ================================================================
-- Razorpay Integration: Add provider_signature column
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ================================================================

-- Add provider_signature column to payments table if it doesn't exist
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS provider_signature TEXT;

-- Also ensure provider_order_id and provider_payment_id exist
-- (These may already exist based on admin.ts queries)
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS provider_order_id TEXT;

ALTER TABLE payments
ADD COLUMN IF NOT EXISTS provider_payment_id TEXT;

-- Add a unique constraint on provider_order_id to prevent duplicate processing
-- This enforces idempotency at the DB level as a safety net
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'payments_provider_order_id_unique'
  ) THEN
    ALTER TABLE payments
    ADD CONSTRAINT payments_provider_order_id_unique
    UNIQUE (provider_order_id);
  END IF;
END
$$;

-- Verify the columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;
