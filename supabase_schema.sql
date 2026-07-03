-- 1. Create Biography Table
CREATE TABLE IF NOT EXISTS biography (
    id TEXT PRIMARY KEY DEFAULT 'main',
    quote_sv TEXT NOT NULL,
    quote_en TEXT NOT NULL,
    dialects_sv TEXT NOT NULL,
    dialects_en TEXT NOT NULL,
    languages_sv TEXT NOT NULL,
    languages_en TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
CREATE POLICY "Allow public select on biography" ON biography FOR SELECT USING (true);
CREATE POLICY "Allow public select on credits" ON credits FOR SELECT USING (true);
CREATE POLICY "Allow public select on showreels" ON showreels FOR SELECT USING (true);
CREATE POLICY "Allow public select on seo_settings" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Allow public select on portfolio_images" ON portfolio_images FOR SELECT USING (true);

-- Create Policies for Anonymous Admin Write Access (simplified for custom key-based admin setups)
CREATE POLICY "Allow all actions on biography" ON biography FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all actions on credits" ON credits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all actions on showreels" ON showreels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all actions on seo_settings" ON seo_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all actions on portfolio_images" ON portfolio_images FOR ALL USING (true) WITH CHECK (true);
