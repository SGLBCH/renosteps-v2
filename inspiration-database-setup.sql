-- Inspiration Component Database Setup
-- Run this SQL to create the necessary tables for the inspiration feature

-- Create inspiration_items table
CREATE TABLE IF NOT EXISTS inspiration_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2),
    category TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspiration_photos table
CREATE TABLE IF NOT EXISTS inspiration_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    inspiration_id UUID NOT NULL REFERENCES inspiration_items(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    photo_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inspiration_items_user_id ON inspiration_items(user_id);
CREATE INDEX IF NOT EXISTS idx_inspiration_items_project_id ON inspiration_items(project_id);
CREATE INDEX IF NOT EXISTS idx_inspiration_items_category ON inspiration_items(category);
CREATE INDEX IF NOT EXISTS idx_inspiration_items_created_at ON inspiration_items(created_at);
CREATE INDEX IF NOT EXISTS idx_inspiration_photos_inspiration_id ON inspiration_photos(inspiration_id);
CREATE INDEX IF NOT EXISTS idx_inspiration_photos_order ON inspiration_photos(photo_order);

-- Enable Row Level Security (RLS)
ALTER TABLE inspiration_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspiration_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for inspiration_items
CREATE POLICY "Users can view their own inspiration items" ON inspiration_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inspiration items" ON inspiration_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inspiration items" ON inspiration_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inspiration items" ON inspiration_items
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for inspiration_photos
CREATE POLICY "Users can view photos of their inspiration items" ON inspiration_photos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM inspiration_items 
            WHERE inspiration_items.id = inspiration_photos.inspiration_id 
            AND inspiration_items.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert photos for their inspiration items" ON inspiration_photos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM inspiration_items 
            WHERE inspiration_items.id = inspiration_photos.inspiration_id 
            AND inspiration_items.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update photos of their inspiration items" ON inspiration_photos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM inspiration_items 
            WHERE inspiration_items.id = inspiration_photos.inspiration_id 
            AND inspiration_items.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete photos of their inspiration items" ON inspiration_photos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM inspiration_items 
            WHERE inspiration_items.id = inspiration_photos.inspiration_id 
            AND inspiration_items.user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_inspiration_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_inspiration_items_updated_at
    BEFORE UPDATE ON inspiration_items
    FOR EACH ROW
    EXECUTE FUNCTION update_inspiration_updated_at();

-- Note: After running this SQL, you'll need to create a storage bucket named 'inspiration-photos' in Supabase Storage
-- The bucket should be public and have the following policy for authenticated users:
-- CREATE POLICY "Allow authenticated users to upload photos" ON storage.objects FOR INSERT WITH (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated users to view photos" ON storage.objects FOR SELECT USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated users to update photos" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated users to delete photos" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');
