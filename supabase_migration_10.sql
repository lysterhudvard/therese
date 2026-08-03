-- Migration 10: Add columns for Press and Voice page SEO content

ALTER TABLE biography ADD COLUMN IF NOT EXISTS press_page_content JSONB DEFAULT '{}'::jsonb;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS voice_page_content JSONB DEFAULT '{}'::jsonb;
