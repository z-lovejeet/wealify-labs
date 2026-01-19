import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSchema() {
    // There isn't a direct "show tables" in Supabase JS client without accessing `information_schema` via SQL or specific RPCs.
    // However, we can try to selecting from potential table names to see if they exist.

    const potentialTables = ['lesson_completions', 'user_progress', 'completed_lessons'];

    for (const table of potentialTables) {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`Table '${table}': NOT FOUND or Error (${error.message})`);
        } else {
            console.log(`Table '${table}': EXISTS`);
        }
    }
}

checkSchema();
