import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ Stats: Missing Supabase Environment Variables!");
        throw new Error("Missing Supabase URL or Anon Key. Check your .env.local file.");
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
}
