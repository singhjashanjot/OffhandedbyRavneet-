-- ================================================================
-- Workshops Pricing & Images Migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ================================================================

-- Add price_for_two column to workshops table
ALTER TABLE workshops
ADD COLUMN IF NOT EXISTS price_for_two INTEGER;

-- Add card_image column to workshops table
ALTER TABLE workshops
ADD COLUMN IF NOT EXISTS card_image TEXT;

-- Verify the columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'workshops'
AND column_name IN ('price_for_two', 'card_image', 'what_to_expect');

-- Add what_to_expect JSONB column to workshops table
-- Stores an array of {icon, title, description} objects for the "What to Expect" section
ALTER TABLE workshops
ADD COLUMN IF NOT EXISTS what_to_expect JSONB;
