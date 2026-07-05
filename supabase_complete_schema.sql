-- ==========================================
-- SUPABASE COMPLETE SCHEMA FOR JARVHEDEN
-- Run this script in your Supabase SQL Editor
-- to set up all tables, schemas, policies, and columns.
-- ==========================================

-- 1. Create Biography Table (with all migration columns included)
CREATE TABLE IF NOT EXISTS biography (
    id TEXT PRIMARY KEY DEFAULT 'main',
    quote_sv TEXT NOT NULL,
    quote_en TEXT NOT NULL,
    dialects_sv TEXT NOT NULL,
    dialects_en TEXT NOT NULL,
    languages_sv TEXT NOT NULL,
    languages_en TEXT NOT NULL,
    
    -- Hero Automation (Migration 1)
    hero_text_sv TEXT,
    hero_text_en TEXT,
    is_automated BOOLEAN DEFAULT false,
    
    -- FAQs (Migration 2)
    faqs JSONB DEFAULT '[]'::jsonb,
    
    -- Extended Bio & Voice & Footer Settings (Migration 3)
    heading_sv TEXT,
    heading_en TEXT,
    paragraph1_sv TEXT,
    paragraph1_en TEXT,
    paragraph2_sv TEXT,
    paragraph2_en TEXT,
    paragraph3_sv TEXT,
    paragraph3_en TEXT,
    voice_settings JSONB DEFAULT '{}'::jsonb,
    review_quotes JSONB DEFAULT '[]'::jsonb,
    quote_comedic_sv TEXT,
    quote_comedic_en TEXT,
    quote_classical_sv TEXT,
    quote_classical_en TEXT,
    mood_images JSONB DEFAULT '{}'::jsonb,
    footer_credits JSONB DEFAULT '[]'::jsonb,
    footer_image TEXT,
    footer_end_sv TEXT,
    footer_end_en TEXT,
    
    -- Contact settings (Migration 4)
    contact_links JSONB DEFAULT '{}'::jsonb,
    
    -- Hero & Bio Sektioner Customization (Migration 5)
    hero_image TEXT,
    hero_role_sv TEXT,
    hero_role_en TEXT,
    hero_base_sv TEXT,
    hero_base_en TEXT,
    bio_image_credits_sv TEXT,
    bio_image_credits_en TEXT,
    bio_sections JSONB DEFAULT '[]'::jsonb,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all columns from migrations exist (in case the table already existed)
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_text_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_text_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS is_automated BOOLEAN DEFAULT false;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS heading_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS heading_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS paragraph1_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS paragraph1_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS paragraph2_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS paragraph2_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS paragraph3_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS paragraph3_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS voice_settings JSONB DEFAULT '{}'::jsonb;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS review_quotes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS quote_comedic_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS quote_comedic_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS quote_classical_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS quote_classical_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS mood_images JSONB DEFAULT '{}'::jsonb;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS footer_credits JSONB DEFAULT '[]'::jsonb;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS footer_image TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS footer_end_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS footer_end_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS contact_links JSONB DEFAULT '{}'::jsonb;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_role_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_role_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_base_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_base_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS bio_image_credits_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS bio_image_credits_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS bio_sections JSONB DEFAULT '[]'::jsonb;

-- 2. Create Credits (Merits) Table
CREATE TABLE IF NOT EXISTS credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    role_sv TEXT NOT NULL,
    role_en TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Film', 'TV', 'Voice', 'Theater'
    category_sv TEXT NOT NULL,
    category_en TEXT NOT NULL,
    network TEXT NOT NULL,
    url TEXT,
    img TEXT NOT NULL,
    commentary_url TEXT,
    commentary_duration TEXT,
    commentary_sv TEXT,
    commentary_en TEXT,
    script_scene TEXT,
    script_char TEXT,
    script_line_sv TEXT,
    script_line_en TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_current_production BOOLEAN DEFAULT false, -- (Migration 1)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Showreels Table
CREATE TABLE IF NOT EXISTS showreels (
    id TEXT PRIMARY KEY,
    title_sv TEXT NOT NULL,
    title_en TEXT NOT NULL,
    sub_sv TEXT NOT NULL,
    sub_en TEXT NOT NULL,
    vimeo_id TEXT,
    youtube_id TEXT,
    url TEXT,
    poster TEXT NOT NULL,
    genre TEXT NOT NULL,
    specs TEXT NOT NULL,
    glow TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create SEO Settings Table
CREATE TABLE IF NOT EXISTS seo_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    title_sv TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_sv TEXT NOT NULL,
    description_en TEXT NOT NULL,
    og_image TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Portfolio Images Table
CREATE TABLE IF NOT EXISTS portfolio_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    alt TEXT NOT NULL,
    allow_download BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE biography ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE showreels ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;

-- Create Policies for Anonymous Public Read-Only Access
DROP POLICY IF EXISTS "Allow public select on biography" ON biography;
CREATE POLICY "Allow public select on biography" ON biography FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on credits" ON credits;
CREATE POLICY "Allow public select on credits" ON credits FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on showreels" ON showreels;
CREATE POLICY "Allow public select on showreels" ON showreels FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on seo_settings" ON seo_settings;
CREATE POLICY "Allow public select on seo_settings" ON seo_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on portfolio_images" ON portfolio_images;
CREATE POLICY "Allow public select on portfolio_images" ON portfolio_images FOR SELECT USING (true);

-- Create Policies for Anonymous Admin Write Access (simplified for custom key-based admin setups)
DROP POLICY IF EXISTS "Allow all actions on biography" ON biography;
CREATE POLICY "Allow all actions on biography" ON biography FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all actions on credits" ON credits;
CREATE POLICY "Allow all actions on credits" ON credits FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all actions on showreels" ON showreels;
CREATE POLICY "Allow all actions on showreels" ON showreels FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all actions on seo_settings" ON seo_settings;
CREATE POLICY "Allow all actions on seo_settings" ON seo_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all actions on portfolio_images" ON portfolio_images;
CREATE POLICY "Allow all actions on portfolio_images" ON portfolio_images FOR ALL USING (true) WITH CHECK (true);

-- 6. Insert Default Biography Row
INSERT INTO biography (
    id,
    quote_sv,
    quote_en,
    dialects_sv,
    dialects_en,
    languages_sv,
    languages_en,
    hero_text_sv,
    hero_text_en,
    is_automated,
    hero_image,
    hero_role_sv,
    hero_role_en,
    hero_base_sv,
    hero_base_en,
    bio_image_credits_sv,
    bio_image_credits_en,
    bio_sections
) VALUES (
    'main',
    'Drama är något jag känner extra starkt för.',
    'Drama is something I feel especially strongly about.',
    'Skånsk · Rikssvenska',
    'Scanian · Standard Swedish',
    'Svenska · Engelska',
    'Swedish · English',
    '"En våldsam kärlek" — SVT dramadokumentär.',
    '"En våldsam kärlek" — SVT documentary drama.',
    false,
    'https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650',
    'Skådespelerska',
    'Actress',
    'Malmö · Stockholm',
    'Malmö · Stockholm',
    'Foto: Robert Eldrim\nSmink: Sara Zetterström',
    'Photo: Robert Eldrim\nMakeup: Sara Zetterström',
    '[
      {
        "id": "Dramatic",
        "title_sv": "Dramatisk",
        "title_en": "Dramatic",
        "quote_sv": "Drama är något jag känner extra starkt för.",
        "quote_en": "Drama is something I feel especially strongly about.",
        "image": "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650",
        "weight": 300
      },
      {
        "id": "Comedic",
        "title_sv": "Komisk",
        "title_en": "Comedic",
        "quote_sv": "Komedi kräver samma precision som tragedi — bara snabbare.",
        "quote_en": "Comedy demands the same precision as tragedy — just faster.",
        "image": "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000017-971e0971e2/Thess1079_highres.jpg?ph=a6c2528650",
        "weight": 500
      },
      {
        "id": "Classical",
        "title_sv": "Klassisk",
        "title_en": "Classical",
        "quote_sv": "Scenen lärde mig allt jag vet om timing och tystnad.",
        "quote_en": "The stage taught me everything I know about timing and silence.",
        "image": "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000043-e152ee1530/Thess0477_highres-5.jpg?ph=a6c2528650",
        "weight": 400
      }
    ]'::jsonb
) ON CONFLICT (id) DO NOTHING;
