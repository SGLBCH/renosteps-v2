-- Corrected Storage Policies for inspiration-photos bucket
-- Run these policies in Supabase SQL Editor

-- Allow authenticated users to upload photos
CREATE POLICY "Allow authenticated users to upload photos" 
ON storage.objects FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to view photos
CREATE POLICY "Allow authenticated users to view photos" 
ON storage.objects FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow authenticated users to update photos
CREATE POLICY "Allow authenticated users to update photos" 
ON storage.objects FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete photos
CREATE POLICY "Allow authenticated users to delete photos" 
ON storage.objects FOR DELETE 
USING (auth.role() = 'authenticated');
