# Supabase Storage Setup for Inspiration Photos

After running the `inspiration-database-setup.sql` file, you need to set up the storage bucket for photos.

## Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Set the bucket name to: `inspiration-photos`
5. Make sure **Public bucket** is checked (this allows public access to photos)
6. Click **Create bucket**

## Step 2: Set Storage Policies

Run these SQL commands in your Supabase SQL editor to set up proper access policies:

```sql
-- Allow authenticated users to upload photos
CREATE POLICY "Allow authenticated users to upload photos" 
ON storage.objects FOR INSERT 
WITH (auth.role() = 'authenticated');

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
```

## Step 3: Verify Setup

1. Go back to **Storage** in your Supabase dashboard
2. You should see the `inspiration-photos` bucket
3. The bucket should show as **Public**
4. You can now upload photos through the Inspiration component

## Troubleshooting

If you encounter permission errors:
- Make sure the bucket is set to **Public**
- Verify that the storage policies are correctly applied
- Check that your user is authenticated when testing the component

## Security Notes

- The bucket is public, which means photos can be accessed by anyone with the URL
- This is necessary for the inspiration component to work properly
- User data is still protected by Row Level Security (RLS) on the database tables
- Only authenticated users can upload, edit, or delete their own inspiration items
