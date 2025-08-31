-- Migration: Add start_date and end_date columns to projects table
-- Run this if you have an existing projects table without these columns

-- Add start_date column
ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date DATE;

-- Add end_date column  
ALTER TABLE projects ADD COLUMN IF NOT EXISTS end_date DATE;

-- Update existing records to have default dates (optional)
-- UPDATE projects SET start_date = created_at, end_date = created_at + INTERVAL '30 days' WHERE start_date IS NULL;

-- Make columns NOT NULL after setting default values (uncomment after running the update above)
-- ALTER TABLE projects ALTER COLUMN start_date SET NOT NULL;
-- ALTER TABLE projects ALTER COLUMN end_date SET NOT NULL;
