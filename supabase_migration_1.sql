-- Run this in your Supabase SQL Editor to add the columns required for Hero automation and Current Production flags

ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_text_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_text_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS is_automated BOOLEAN DEFAULT false;

ALTER TABLE credits ADD COLUMN IF NOT EXISTS is_current_production BOOLEAN DEFAULT false;
