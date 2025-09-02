-- Simple Storage Policies for inspiration-photos bucket
-- These are more permissive and should work better

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete photos" ON storage.objects;

-- Create simple policies
CREATE POLICY "Enable insert for authenticated users only" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON storage.objects
FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users only" ON storage.objects
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');
