# Database Setup Guide

## Setting up the Projects Table in Supabase

### 1. Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project
3. Go to the SQL Editor in the left sidebar

### 2. Run the Database Setup Script
1. Copy the contents of `database-setup.sql`
2. Paste it into the SQL Editor in Supabase
3. Click "Run" to execute the script

### 3. Verify the Setup
After running the script, you should see:
- A new `projects` table in your database
- Row Level Security (RLS) enabled
- Policies created for user access control
- Indexes for performance optimization

### 4. Table Structure
The `projects` table includes:
- `id`: Unique identifier (UUID)
- `name`: Project name (required)
- `description`: Project description (optional)
- `user_id`: Reference to authenticated user
- `status`: Project status (active, completed, on-hold, cancelled)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### 5. Security Features
- **Row Level Security (RLS)**: Users can only access their own projects
- **Automatic timestamps**: Created and updated timestamps are managed automatically
- **User isolation**: Each user's projects are completely isolated from others

### 6. Testing the Setup
1. Create a project through the dashboard
2. Verify it appears in the Supabase table
3. Check that RLS is working by trying to access projects from different user accounts

### 7. Troubleshooting
If you encounter issues:
- Check that the script ran without errors
- Verify RLS is enabled on the table
- Ensure policies are created correctly
- Check the Supabase logs for any error messages

## Next Steps
After setting up the database:
1. Test project creation through the dashboard
2. Implement project listing functionality
3. Add project editing and deletion features
4. Set up real-time subscriptions for live updates
