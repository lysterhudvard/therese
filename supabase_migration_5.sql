-- 1. Create Biography Table if it does not exist
CREATE TABLE IF NOT EXISTS biography (
    id TEXT PRIMARY KEY DEFAULT 'main',
    quote_sv TEXT NOT NULL DEFAULT '',
    quote_en TEXT NOT NULL DEFAULT '',
    dialects_sv TEXT NOT NULL DEFAULT '',
    dialects_en TEXT NOT NULL DEFAULT '',
    languages_sv TEXT NOT NULL DEFAULT '',
    languages_en TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insert default row if it does not exist
INSERT INTO biography (id, quote_sv, quote_en, dialects_sv, dialects_en, languages_sv, languages_en)
VALUES (
  'main', 
  'Drama är något jag känner extra starkt för.', 
  'Drama is something I feel especially strongly about.', 
  'Skånsk · Rikssvenska', 
  'Scanian · Standard Swedish', 
  'Svenska · Engelska', 
  'Swedish · English'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Add hero and bio customization fields to biography table
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_role_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_role_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_base_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS hero_base_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS bio_image_credits_sv TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS bio_image_credits_en TEXT;
ALTER TABLE biography ADD COLUMN IF NOT EXISTS bio_sections JSONB DEFAULT '[]'::jsonb;

-- 4. Update the default row with initial values matching our local fallbacks
UPDATE biography
SET 
  hero_image = COALESCE(hero_image, 'https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650'),
  hero_role_sv = COALESCE(hero_role_sv, 'Skådespelerska'),
  hero_role_en = COALESCE(hero_role_en, 'Actress'),
  hero_base_sv = COALESCE(hero_base_sv, 'Malmö · Stockholm'),
  hero_base_en = COALESCE(hero_base_en, 'Malmö · Stockholm'),
  bio_image_credits_sv = COALESCE(bio_image_credits_sv, 'Foto: Robert Eldrim\nSmink: Sara Zetterström'),
  bio_image_credits_en = COALESCE(bio_image_credits_en, 'Photo: Robert Eldrim\nMakeup: Sara Zetterström'),
  bio_sections = CASE 
    WHEN bio_sections IS NULL OR bio_sections = '[]'::jsonb THEN '[
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
    ELSE bio_sections
  END
WHERE id = 'main';