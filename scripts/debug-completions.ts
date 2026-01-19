import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debugCompletions() {
    console.log("Debugging Lesson Completions...");

    // 1. Check total rows
    const { count, error: countError } = await supabase
        .from('lesson_completions')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error("Error counting rows:", countError);
        return;
    }
    console.log(`Total rows in 'lesson_completions': ${count}`);

    // 2. List first 5 rows
    const { data: rows } = await supabase
        .from('lesson_completions')
        .select('*')
        .limit(5);

    console.log("Sample Data:", rows);

    // 3. Check for specific user (optional, if we knew the ID)
    // We can list users to find our test user 'lovejeet1225@gmail.com'
    // But we don't have access to auth.users via client easily unless we use admin auth.

    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    if (users) {
        const targetUser = users.find(u => u.email?.includes('lovejeet'));
        if (targetUser) {
            console.log(`Found User: ${targetUser.email} (${targetUser.id})`);

            // Check completions for this user
            const { data: userCompletions } = await supabase
                .from('lesson_completions')
                .select('*')
                .eq('user_id', targetUser.id);
            console.log(`Completions for ${targetUser.email}:`, userCompletions?.length);
        } else {
            console.log("Target user 'lovejeet' not found in auth.");
        }
    }
}

debugCompletions();
