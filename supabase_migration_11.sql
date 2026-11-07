-- Migration 11: Add or update agentName in biography contact_links
-- Since contact_links is a JSONB column, this ensures agentName is set in contact_links

UPDATE biography
SET contact_links = COALESCE(contact_links, '{}'::jsonb) || '{"agentName": "Commercial Actors"}'::jsonb
WHERE id = 'main';

