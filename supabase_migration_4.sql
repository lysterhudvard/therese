-- Run this in your Supabase SQL Editor to add the contact_links column to biography
ALTER TABLE biography ADD COLUMN IF NOT EXISTS contact_links JSONB DEFAULT '{}'::jsonb;
