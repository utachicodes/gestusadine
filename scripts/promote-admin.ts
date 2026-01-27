
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase URL or Service Role Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const email = 'xamsadineai@gmail.com';

async function promoteToAdmin() {
    console.log(`Promoting user ${email} to admin...`);

    // 1. Get the user ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        process.exit(1);
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error(`User with email ${email} not found. Please sign up first.`);
        process.exit(1);
    }

    console.log(`Found user: ${user.id}`);

    // 2. Update user metadata (if used for role checks)
    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { role: 'admin' } }
    );

    if (updateAuthError) {
        console.error('Error updating user metadata:', updateAuthError);
    } else {
        console.log('User metadata updated.');
    }

    // 3. Update profiles table (primary source of truth for RLS/app logic)
    const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ role: 'admin', updated_at: new Date().toISOString() })
        .eq('id', user.id);

    if (updateProfileError) {
        console.error('Error updating profiles table:', updateProfileError);
        process.exit(1);
    }

    console.log(`Successfully promoted ${email} to admin!`);
}

promoteToAdmin();
