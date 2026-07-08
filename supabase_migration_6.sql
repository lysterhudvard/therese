-- Migration 6: Add SEO Image Columns (Alt, Caption, Title, Filename) to all image-related tables

-- 1. Portfolio Images
ALTER TABLE portfolio_images ADD COLUMN IF NOT EXISTS caption TEXT;
ALTER TABLE portfolio_images ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE portfolio_images ADD COLUMN IF NOT EXISTS filename TEXT;

-- 2. Biography (Hero & Footer)
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_image_alt TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_image_caption TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_image_title TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_image_filename TEXT;

ALTER TABLE biography ADD COLUMN IF NOT EXISTS footer_image_alt TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS footer_image_caption TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS footer_image_title TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS footer_image_filename TEXT;

-- 3. Showreels
ALTER TABLE showreels ADD COLUMN IF NOT EXISTS poster_alt TEXT;
ALTER TABLE showreels ADD COLUMN IF NOT EXISTS poster_caption TEXT;
ALTER TABLE showreels ADD COLUMN IF NOT EXISTS poster_title TEXT;
ALTER TABLE showreels ADD COLUMN IF NOT EXISTS poster_filename TEXT;

-- 4. SEO Settings
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS og_image_alt TEXT;
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS og_image_caption TEXT;
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS og_image_title TEXT;
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS og_image_filename TEXT;

-- 5. Credits (Merits)
ALTER TABLE credits ADD COLUMN IF NOT EXISTS img_alt TEXT;
ALTER TABLE credits ADD COLUMN IF NOT EXISTS img_caption TEXT;
ALTER TABLE credits ADD COLUMN IF NOT EXISTS img_title TEXT;
ALTER TABLE credits ADD COLUMN IF NOT EXISTS img_filename TEXT;
