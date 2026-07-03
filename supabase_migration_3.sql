-- Run this in your Supabase SQL Editor to add the voice_settings and paragraph columns to biography
ALTER TABLE biography ADD COLUMN IF NOT EXISTS heading_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS heading_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS paragraph1_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS paragraph1_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS paragraph2_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS paragraph2_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS paragraph3_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS paragraph3_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS voice_settings JSONB DEFAULT '{}'::jsonb;
