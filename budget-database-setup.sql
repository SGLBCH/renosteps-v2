-- Create budget_items table
CREATE TABLE IF NOT EXISTS budget_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  allocated_amount DECIMAL(10,2) NOT NULL CHECK (allocated_amount >= 0),
  actual_spent DECIMAL(10,2) DEFAULT 0 CHECK (actual_spent >= 0),
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
  due_date DATE,
  priority VARCHAR(50) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  vendor_contractor VARCHAR(255),
  receipt_invoice TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on project_id for better query performance
CREATE INDEX IF NOT EXISTS idx_budget_items_project_id ON budget_items(project_id);

-- Create index on task_id for task relationships
CREATE INDEX IF NOT EXISTS idx_budget_items_task_id ON budget_items(task_id);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_budget_items_category ON budget_items(category);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_budget_items_status ON budget_items(status);

-- Create index on priority for sorting
CREATE INDEX IF NOT EXISTS idx_budget_items_priority ON budget_items(priority);

-- Enable Row Level Security (RLS)
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see budget items from their own projects
CREATE POLICY "Users can view budget items from their own projects" ON budget_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = budget_items.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create policy to allow users to insert budget items in their own projects
CREATE POLICY "Users can insert budget items in their own projects" ON budget_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = budget_items.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create policy to allow users to update budget items in their own projects
CREATE POLICY "Users can update budget items in their own projects" ON budget_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = budget_items.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create policy to allow users to delete budget items in their own projects
CREATE POLICY "Users can delete budget items in their own projects" ON budget_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = budget_items.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_budget_items_updated_at 
  BEFORE UPDATE ON budget_items 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
