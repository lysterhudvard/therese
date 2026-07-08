-- Migration 7: Media Metadata Table & Description Column Updates

-- Create media_metadata table
CREATE TABLE IF NOT EXISTS media_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_path TEXT UNIQUE NOT NULL,
    alt TEXT,
    title TEXT,
    caption TEXT,
    description TEXT,
    filename TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on media_metadata
ALTER TABLE media_metadata ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies (matching jarvheden convention)
DROP POLICY IF EXISTS "Allow public select on media_metadata" ON media_metadata;
CREATE POLICY "Allow public select on media_metadata" ON media_metadata FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all actions on media_metadata" ON media_metadata;
CREATE POLICY "Allow all actions on media_metadata" ON media_metadata FOR ALL USING (true) WITH CHECK (true);

-- Add description columns to portfolio_images and biography
ALTER TABLE portfolio_images ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_image_description TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS footer_image_description TEXT;
