-- Migration 8: Add Image SEO Description Columns to remaining tables

-- Add og_image_description to seo_settings
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS og_image_description TEXT;

-- Add img_description to credits
ALTER TABLE credits ADD COLUMN IF NOT EXISTS img_description TEXT;

-- Add poster_description to showreels
ALTER TABLE showreels ADD COLUMN IF NOT EXISTS poster_description TEXT;
