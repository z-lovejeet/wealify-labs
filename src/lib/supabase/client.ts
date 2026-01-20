import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
    if (client) return client

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ Stats: Missing Supabase Environment Variables!");
        throw new Error("Missing Supabase URL or Anon Key. Check your .env.local file.");
    }

    client = createBrowserClient(supabaseUrl, supabaseKey);
    return client;
}
