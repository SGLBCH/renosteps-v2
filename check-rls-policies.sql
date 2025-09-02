-- Check RLS policies for tasks table
-- Run this to verify that RLS policies are correctly set up

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'tasks';

-- Check all policies on tasks table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'tasks'
ORDER BY policyname;

-- Test if current user can access tasks
SELECT 
    'Current user can SELECT tasks' as test,
    COUNT(*) as accessible_tasks
FROM tasks;

-- Test if current user can update tasks
SELECT 
    'Current user can UPDATE tasks' as test,
    COUNT(*) as updatable_tasks
FROM tasks
WHERE EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = tasks.project_id 
    AND projects.user_id = auth.uid()
);

-- Check if completed and completedAt columns exist
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND column_name IN ('completed', 'completedAt')
ORDER BY column_name;
