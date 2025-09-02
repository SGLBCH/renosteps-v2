-- Fix database schema for tasks table
-- This script safely adds the completed and completedAt columns

-- First, check if columns already exist
DO $$
BEGIN
    -- Add completed column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'completed'
    ) THEN
        ALTER TABLE tasks ADD COLUMN completed BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added completed column to tasks table';
    ELSE
        RAISE NOTICE 'completed column already exists in tasks table';
    END IF;

    -- Add completedAt column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'completedAt'
    ) THEN
        ALTER TABLE tasks ADD COLUMN "completedAt" TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added completedAt column to tasks table';
    ELSE
        RAISE NOTICE 'completedAt column already exists in tasks table';
    END IF;
END $$;

-- Update existing tasks to have completed = false if not set
UPDATE tasks SET completed = FALSE WHERE completed IS NULL;

-- Make completed field NOT NULL after setting default values
ALTER TABLE tasks ALTER COLUMN completed SET NOT NULL;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_completed_at ON tasks("completedAt");

-- Add comments to document the new fields
COMMENT ON COLUMN tasks.completed IS 'Indicates if the task is completed (true) or not (false)';
COMMENT ON COLUMN tasks."completedAt" IS 'Timestamp when the task was marked as completed, null if not completed';

-- Verify the columns exist
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND column_name IN ('completed', 'completedAt')
ORDER BY column_name;
