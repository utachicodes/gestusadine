# How to Create an Admin Account

There are two ways to create an admin account:

## Method 1: Using the App (Recommended)

1. **Sign up for a regular account** through the app's sign-up page
2. **Note your email address**
3. **Open your Supabase Dashboard** → SQL Editor
4. **Run this SQL query** (replace `your-email@example.com` with your actual email):

```sql
UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'your-email@example.com';
```

5. **Sign out and sign back in** to refresh your admin status
6. You should now see admin options in the sidebar

## Method 2: Direct Database Update

If you already have an account:

1. Go to your **Supabase Dashboard** → SQL Editor
2. Run the query from `database/create-admin.sql`
3. Replace `'your-email@example.com'` with your actual email
4. Sign out and sign back in

## Verify Admin Status

To check if you're an admin, run this query:

```sql
SELECT id, email, full_name, role
FROM public.profiles
WHERE email = 'your-email@example.com';
```

The `role` column should show `'admin'`.

## Troubleshooting

- **Admin options not showing?** Try signing out and signing back in
- **Can't update profile?** Make sure you have the correct permissions in Supabase
- **Need to create account first?** Use the sign-up page in the app, then run the SQL update

## Security Note

Only run these SQL commands in your Supabase SQL Editor. Never expose admin creation scripts in production code.

