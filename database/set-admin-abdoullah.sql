-- ==========================================
-- Set Admin Role for abdoullahaljersi@gmail.com
-- ==========================================
-- Run this script in your Supabase SQL Editor
-- This will update the profile role to 'admin' for the specified email
-- ==========================================

-- First, check if the user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'abdoullahaljersi@gmail.com';

-- Update the profile to admin role
-- This works whether the profile exists or not (using ON CONFLICT)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'Admin User'),
  'admin'
FROM auth.users
WHERE email = 'abdoullahaljersi@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Verify the update
SELECT id, email, full_name, role, created_at, updated_at
FROM public.profiles
WHERE email = 'abdoullahaljersi@gmail.com';

-- If the above doesn't work, try this direct update:
-- UPDATE public.profiles
-- SET role = 'admin', updated_at = NOW()
-- WHERE email = 'abdoullahaljersi@gmail.com';

-- Check all admin users
SELECT id, email, full_name, role
FROM public.profiles
WHERE role = 'admin';

