-- Run this in your Supabase SQL Editor to add the showreel_settings column to biography
ALTER TABLE biography ADD COLUMN IF NOT EXISTS showreel_settings JSONB DEFAULT '{}'::jsonb;
