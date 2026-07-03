-- Run this in your Supabase SQL Editor to add the FAQs column for search engine Schema generation
ALTER TABLE biography ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;
