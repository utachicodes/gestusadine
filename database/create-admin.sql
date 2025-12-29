-- ==========================================
-- Create Admin Account Script
-- ==========================================
-- This script helps you create an admin account
-- 
-- INSTRUCTIONS:
-- 1. First, sign up for a regular account through the app (or use Supabase Auth UI)
-- 2. Note the email address you used
-- 3. Run this script in your Supabase SQL Editor, replacing 'your-email@example.com' with your actual email
-- 4. After running, sign out and sign back in to refresh your admin status
-- ==========================================

-- Option 1: Update an existing user to admin role
-- Replace 'your-email@example.com' with your actual email address
UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, full_name, role, created_at
FROM public.profiles
WHERE email = 'your-email@example.com';

-- Option 2: If you need to manually create a profile for an existing auth user
-- First, get the user ID from auth.users table:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
-- Then use that ID to create/update the profile:
-- INSERT INTO public.profiles (id, email, full_name, role)
-- VALUES (
--   'USER_ID_FROM_AUTH_USERS',  -- Replace with actual UUID from auth.users
--   'your-email@example.com',
--   'Admin User',
--   'admin'
-- )
-- ON CONFLICT (id) DO UPDATE SET
--   role = 'admin',
--   updated_at = NOW();

-- ==========================================
-- Quick Admin Check
-- ==========================================
-- Run this to see all admin users:
SELECT id, email, full_name, role, created_at
FROM public.profiles
WHERE role = 'admin';

