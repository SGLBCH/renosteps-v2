-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  description TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status VARCHAR(50) DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'On Hold', 'Completed', 'Cancelled')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  estimated_hours DECIMAL(5,2),
  materials_needed TEXT,
  budget_allocation DECIMAL(10,2),
  room_location VARCHAR(255),
  dependencies UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on project_id for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Create index on priority for sorting
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see tasks from their own projects
CREATE POLICY "Users can view tasks from their own projects" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create policy to allow users to insert tasks in their own projects
CREATE POLICY "Users can insert tasks in their own projects" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create policy to allow users to update tasks in their own projects
CREATE POLICY "Users can update tasks in their own projects" ON tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create policy to allow users to delete tasks in their own projects
CREATE POLICY "Users can delete tasks in their own projects" ON tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON tasks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
