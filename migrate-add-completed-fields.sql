-- Migration: Add completed and completedAt fields to tasks table
-- Run this script to add the new fields for task completion functionality

-- Add completed field (boolean, defaults to false)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;

-- Add completedAt field (timestamp, nullable)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completedAt TIMESTAMP WITH TIME ZONE;

-- Create index on completed field for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);

-- Create index on completedAt field for sorting
CREATE INDEX IF NOT EXISTS idx_tasks_completed_at ON tasks(completedAt);

-- Update existing tasks to have completed = false if not set
UPDATE tasks SET completed = FALSE WHERE completed IS NULL;

-- Make completed field NOT NULL after setting default values
ALTER TABLE tasks ALTER COLUMN completed SET NOT NULL;

-- Add comment to document the new fields
COMMENT ON COLUMN tasks.completed IS 'Indicates if the task is completed (true) or not (false)';
COMMENT ON COLUMN tasks.completedAt IS 'Timestamp when the task was marked as completed, null if not completed';
